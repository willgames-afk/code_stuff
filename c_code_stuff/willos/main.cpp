#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string>
#include <iostream>

typedef struct { // TTL state that the CPU controls
	uint16_t PC;
	uint8_t IR, D, AC, X, Y, OUT, undef;
} CpuState;

uint8_t ROM[1<<16][2], RAM[1<<15], IN=0xff;

uint8_t COL_LOOKUP[4] = {0, 1, 3, 5};

CpuState cpuCycle(const CpuState S)
{ 
	CpuState T = S; // New state is old state unless something changes

	T.IR = ROM[S.PC][0]; // Instruction Fetch
	T.D = ROM[S.PC][1];

	int ins = S.IR >> 5; // Instruction
	int mod = (S.IR >> 2) & 7; // Addressing mode (or condition)
	int bus = S.IR&3; // Busmode
	int W = (ins == 6); // Write instruction?
	int J = (ins == 7); // Jump instruction?

	uint8_t lo=S.D, hi=0, *to=NULL; // Mode Decoder
	int incX=0;
	if (!J)
		switch (mod) {
			#define E(p) (W?0:p) // Disable AC and OUT loading during RAM write
			case 0: to=E(&T.AC); break;
			case 1: to=E(&T.AC); lo=S.X; break;
			case 2: to=E(&T.AC); hi=S.Y; break;
			case 3: to=E(&T.AC); lo=S.X; hi=S.Y; break;
			case 4: to= &T.X; break;
			case 5: to= &T.Y; break;
			case 6: to=E(&T.OUT); break;
			case 7: to=E(&T.OUT); lo=S.X; hi=S.Y; incX=1; break;
		}
	uint16_t addr = (hi << 8) | lo;

	int B = S.undef; // Data Bus
	switch (bus) {
		case 0: B=S.D; break;
		case 1: if (!W) B = RAM[addr&0x7fff]; break;
		case 2: B=S.AC; break;
		case 3: B=IN; break;
	}

	if (W) RAM[addr&0x7fff] = B; // Random Access Memory

	uint8_t ALU; // Arithmetic and Logic Unit
	switch (ins) {
		case 0: ALU = B; break; // LD
		case 1: ALU = S.AC & B; break; // ANDA
		case 2: ALU = S.AC | B; break; // ORA
		case 3: ALU = S.AC ^ B; break; // XORA
		case 4: ALU = S.AC + B; break; // ADDA
		case 5: ALU = S.AC - B; break; // SUBA
		case 6: ALU = S.AC; break; // ST
		case 7: ALU = -S.AC; break; // Bcc/JMP
	}
	if (to) *to = ALU; // Load value into register
	if (incX) T.X = S.X + 1; // Increment X

	T.PC = S.PC + 1; // Next instruction
	if (J) {
		if (mod != 0) { // Conditional branch within page
			int cond = (S.AC>>7) + 2*(S.AC==0);
			if (mod & (1 << cond)) // 74153
				T.PC = (S.PC & 0xff00) | B;
		} else
		T.PC = (S.Y << 8) | B; // Unconditional far jump
	}
	return T;
}
void garble(uint8_t mem[], int len)
{ 
	for (int i=0; i<len; i++) mem[i] = rand();
}
char buffer[2789];
int main(void)
{ 
	buffer[0] = '\0';
	CpuState S;
	srand(time(NULL)); // Initialize with randomized data
	garble((uint8_t *)ROM, sizeof ROM);
	garble((uint8_t *)RAM, sizeof RAM);
	garble((uint8_t *)&S, sizeof S);

	FILE *fp = fopen("gigatron.rom", "rb");
	if (!fp) {
		fprintf(stderr, "Error: failed to open ROM file\n");
		exit(EXIT_FAILURE);
	}
	fread(ROM, 1, sizeof ROM, fp);
	fclose(fp);

	int vgaX=0, vgaY=0, t=-2;
	
	while (1) {
		if (t < 0) {
			S.PC = 0; // MCP100 Power-On Reset
			t++;
		}

		CpuState T = cpuCycle(S); // Update CPU

		int hSync = (T.OUT & 0x40) - (S.OUT & 0x40); // "VGA monitor" (use simple stdout)

		int vSync = (T.OUT & 0x80) - (S.OUT & 0x80);
		if (vSync < 0) {
			vgaY = -36; // Falling vSync edge
			fflush(stdout);
		}
		if (vgaY == 0) {
			printf("\033[3J\033[H");
		}
		if (vgaX++ < 200) {
			if (hSync) strcat(buffer,"|||"); // Visual indicator of hSync
			else if (vgaX == 200) strcat(buffer, ">>>"); // Too many pixels
			else if (~S.OUT & 0x80) strcat(buffer, "^^^"); // Visualize vBlank pulse
			//S.OUT & 63
			else {
				strcat(buffer, "\033[48;5;");
				strcat(buffer, std::to_string(16 + COL_LOOKUP[(S.OUT & 48) >> 4] + COL_LOOKUP[(S.OUT & 12) >> 2] * 6 + COL_LOOKUP[S.OUT & 3] * 36).c_str()); // Plot pixel
				strcat(buffer, "m   ");
			}
		}
		if (hSync > 0) { // Rising hSync edge
			printf("%s",buffer);
			buffer[0] = '\0';
			printf("\033[0m%s line %d xout %02x t %0.3f\033[G\033[B",
					vgaX!=200 ? "~" : "", // Mark horizontal cycle errors
					vgaY, T.AC, t/6.250e+06);
			vgaX = 0;
			vgaY++;
			T.undef = rand() & 0xff; // Change this once in a while
		}
		S=T;
	}
	return 0;
}
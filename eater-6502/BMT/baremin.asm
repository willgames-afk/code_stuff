    .org $8000 ;code starts at $8000

;LABEL DEFINITIONS
PORTB = $6000    
PORTA = $6001
DDRB  = $6002
DDRA  = $6003

reset:
;resets the processor
    ldx #$ff;Reset stack pointer
    txs

    LDA #%00000001 ;set portB pins to output
    STA DDRA
    
	LDA 1
	STA PORTA

	LDX #$ff
	LDY #$FF
loop:
	DEX
	BNE loop
	DEY
	BNE loop

	ADC #1
	AND #%00000001
	STA PORTA
	jmp loop

done:
	jmp done

;RESET VECTORS
    .org $fffc
    .word reset
    .word $0000 ;pad it out to 32kb
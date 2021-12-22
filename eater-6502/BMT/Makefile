target = baremin

$(target): $(target).asm
	../vasm6502_oldstyle -Fbin -dotdir $(target).asm
	minipro -p AT28C256 -w a.out
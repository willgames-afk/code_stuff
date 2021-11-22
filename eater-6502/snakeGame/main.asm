	.org $8000 ; Code starts at $8000

include labels.s
include lcd.s
include print.s

reset:
	jsr lcd_initNormal; Initialize LCD
	

nmi:
	rti

irq:


clicked_message: .asciiz ":)"
default_message: .asciiz "Hello, World!"

;RESET VECTORS
    .org $fffa
    .word nmi
    .word reset
    .word irq
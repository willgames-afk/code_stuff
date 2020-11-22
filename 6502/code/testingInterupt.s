 .org $8000; put it at the start of memory (eeprom chip mapped in at addr $8000)
;Labels
E  = %10000001 ;LCD display
RW = %01000001 ;|
RS = %00100001 ;/

CCH = $08 ;LCD CGRAM address of the custom char used for graphics

;Variables and External Registers
dot_x   = $0000 ;1 byte
dot_y   = $0001 ;1 byte
;Max is $00FF; $0100 is stack

PORTB = $6000 ;io chip
PORTA = $6001
DDRB  = $6002
DDRA  = $6003 
PCR   = $600c
IFR   = $600d
IER   = $600e

init:
    cli
    lda #%10000010 ;Try $82 if not work
    sta IER
    lda #$FF ;Ben has this the opposite; negative triggering edge
    sta PCR





lcd_instruction:
    jsr lcd_wait
    sta PORTB
    lda #0
    sta PORTA
    lda #E
    sta PORTA
    lda #0
    sta PORTA
    rts

lcd_data:
    jsr lcd_wait
    sta PORTB
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA
    rts

lcd_wait:
    pha
    lda #%00000000
    sta DDRB ; set portb to input
lcd_busy:
    lda #RW
    sta PORTA
    lda #(RW | E) ;Send LCD instruction
    sta PORTA
    lda PORTB      ;Get busy flag
    and #%10000000
    bne lcd_busy   ;If LCD is busy, loop

    lda #RW
    sta PORTA
    lda #%11111111 ;set portb back to output
    sta DDRB
    pla
    rts

nmi:
    rti

irqbrk:
    pha
    lda #%00000001
    bit IFR
    beq not_A1
;If A1

not_A1:
    lda #%00000010
    bit IFR
    beq exit_irq
;If A2



exit_irq:
    pla
    bit PORTA ;read of port a/b clears CA/CB interupt
    bit PORTB 
    rti

    






    .org $fffa
    .word nmi
    .word init
    .word irqbrk
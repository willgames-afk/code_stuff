    .org $8000; put it at the start of memory (eeprom chip mapped in at $8000)
;Labels
E  = %10000001 ;LCD display
RW = %01000001 ;|
RS = %00100001 ;/

CCH = $08 ;LCD CGRAM address of the custom char used for graphics

;Variables and External Registers
dpad_up = $0000
dpad_left = $0001
dpad_down = $0002
dpad_right = $0003
dot_x = $0004
dot_y = $0005
;Max is $00FF; $0100 is stack

PORTB = $6000 ;io chip
PORTA = $6001 ;|
DDRB  = $6002 ;|
DDRA  = $6003 ;/


init:
    lda #%11111111 ;set portB pins to output
    sta DDRB
    lda #%11100001 ;set top 3 portA pins to output plus LED (so we can light it up)
    sta DDRA
    
    lda #%00000001 ;Ensure everything is reset and turn on indicator LED
    sta PORTA
    lda #%00000000
    sta PORTB

    lda #$00 ;reset dot position
    sta dot_x
    sta dot_y

    lda #%00111000 ;8-bit mode; 2 line; 5x8 font
    jsr lcd_instruction
    lda #%00001110 ;Display on; cursor on; blink off;
    jsr lcd_instruction
    lda #%00000110 ;Increment and shift cursor, don't shift screen
    jsr lcd_instruction
    lda #%00000001 ;clear
    jsr lcd_instruction

    lda #%10000100 ;Set DDRAM address to 4
    jsr lcd_instruction
    lda #%00000001 ; set char 5 on lcd to be our custom character that is the gamefield
    jsr lcd_char

loop:
    lda #%00000010 ;csr Home
    jsr lcd_instruction

    lda #%00011110 ;Get button values into y register
    and PORTA
    clc
    ror
    tay

;Gets and Prints the states of the 4 buttons.    
    ldx #$04
print_bits:
    tya
    and #%00000001 ;mask off all but the first bit
    bne print_one  ;
;print_zero:
    lda #"0"
    jmp print_bit
print_one:
    lda #1
    sta (dpad_up,x)
    lda #"1"
print_bit:
    jsr lcd_char
    tya ; slide bits along so next bit is "seen" through bitmask
    ror ; |
    tay ;/

    dex
    bne print_bits

dot_up:
    inc dot_y
    rts
dot_down:
    dec dot_y
    rts
dot_left:
    dec dot_x
    rts
dot_right:
    inc dot_x
    rts

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

lcd_char:
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


    .org $fffc
    .word init
    .word $0000 ;pad it out to 32kB
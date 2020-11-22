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

    lda #$00 ;reset vars
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
    jsr lcd_data

loop:
    lda #%00000010 ;csr Home
    jsr lcd_instruction

    lda #%00011110 ;Get button values into y register
    and PORTA
    clc
    ror
    tay

;IF button 4 is pressed, move right
    and #%00000001 ;mask off all but the first bit
    beq fdot_right 

    inc dot_x
    jmp redraw
fdot_right:
    tya ; slide bits along so next bit is "seen" through bitmask
    ror ; |
    tay ;/

;If button 3 is pressed, move down
    and #%00000001
    beq fdot_down 

    dec dot_y
    jmp redraw
fdot_down:
    tya
    ror
    tay
    
;If button 2 is pressed, move left
    and #%00000001
    beq fdot_left

    dec dot_x
    jmp redraw
fdot_left:
    tya
    ror
    tay

;If button 1 is pressed, move up
    and #%00000001
    beq fdot_down 

    inc dot_y
    jmp redraw
fdot_down:
    jmp loop


redraw:
;Set LCD CGRAM address to 8; this sets us up to define/redefine our custom char!
    lda #%01001000
    jsr lcd_instruction

; IF row = dot_y, do row code
    ldy #$00
rowloop:
    cpy dot_y
    bne rowloop_continue

;Run this on correct row:
    lda #%00010000
    ldx dot_x ;ldx last, so flag registers are correct
colLoop:
    beq colLoop_done
    ror ;Move the bit right until it's in the correct spot
    dex
    jmp colLoop
colLoop_done:
    jmp lcd_data ;Send the byte containing the player to the LCD

rowloop_continue:
    iny
    cpy #8 ;Once we've gone through 8 times, we're done!
    bne rowloop

    lda #%10000000 ;Get back into DDRAM
    jsr lcd_instruction


;Delay to prevent insane dot speeds 
    ldx #$FF
    ldy #$FF

delay_loop:
    dex
    bne delay_loop
    ldx #$FF
    dey
    bne delay_loop
    jmp loop




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


    .org $fffc
    .word init
    .word $0000 ;pad it out to 32kB
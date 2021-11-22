;LCD SUBROUTINES

;Include labels.s


lcd_wait:
;Checks the LCD busy flag until it's not set.

    pha ;don't overwrite the A register
    lda #%00000000 ;set PORTB to input
    sta DDRB
lcd_busy:
    lda #RW  ;Send Instruction
    sta PORTA
    lda #(RW | E)
    sta PORTA
    lda PORTB
    and #%10000000 ; We only care about the busy flag
    bne lcd_busy   ;if it's set, keep looping. Otherwise, the LCD is ready.
    lda #RW  ;Clear E bit
    sta PORTA
    lda #%11111111 ;set PORTB to output
    sta DDRB
    pla
    rts 

lcd_instruction:
;Sends an Instruction to the LCD

    jsr lcd_wait ;wait until the LCD is available
    sta PORTB
    ;Clear RS/RW/E, then Set E bit, then clear all.
    lda #0
    sta PORTA
    lda #E
    sta PORTA
    lda #0
    sta PORTA
    rts

lcd_char:
;Sends a Character to the LCD

    jsr lcd_wait ;wait until the LCD is available
    sta PORTB
    ;Set RS, Clear RW/E, then Set E bit, then clear E bit.
    lda #RS
    STA PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA
    rts

lcd_initNormal:
;Sets up LCD
    LDA #%00111000 ;8-bit mode, 2-line display, 5x8 font
    jsr lcd_instruction
    lda #%00001110 ;Display on, Cursor on, blink off
    jsr lcd_instruction
    lda #%00000110 ;Increment and shift cursor but not display
    jsr lcd_instruction
    lda #%00000001 ;Clear the display
    jsr lcd_instruction
    .org $8000 ;code starts at $8000

;LABEL DEFINITIONS
PORTB = $6000    
PORTA = $6001
DDRB  = $6002
DDRA  = $6003

E  = %10000000
RW = %01000000
RS = %00100000

reset:
;resets the processor
    ldx #$ff;Reset stack pointer
    txs

    LDA #%11111111 ;set portB pins to output
    STA DDRB
    LDA #%11100000 ;set top 3 portA pins to output
    STA DDRA

    ;Set up LCD
    LDA #%00111000 ;8-bit mode, 2-line display, 5x8 font
    jsr lcd_instruction
    lda #%00001110 ;Display on, Cursor on, blink off
    jsr lcd_instruction
    lda #%00000110 ;Increment and shift cursor but not display
    jsr lcd_instruction
    lda #%00000001 ;Clear the display, in case of a reset
    jsr lcd_instruction

loop:
    lda #%00000010
    jsr lcd_instruction


    ldx #0
print:
    lda message,x
    beq done
    jsr lcd_char
    inx
    jmp print

done:
    jmp loop

    
message: .asciiz "Hello, Maya!" ;DO NOT PUT THIS AT START OF CODE!!





;LCD SUBROUTINES


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
    bne lcd_busy;if it's set, keep looping. Otherwise, the LCD is ready.

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




;RESET VECTORS
    .org $fffc
    .word reset
    .word $0000 ;pad it out to 32kb
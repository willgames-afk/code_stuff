
;LABEL DEFINITIONS
PORTB = $6000 ;1 byte
PORTA = $6001
DDRB  = $6002
DDRA  = $6003

value = $0200 ;2 bytes
mod10 = $0202 ;2 bytes
message = $0204 ;6 bytes (Null terminated 5 char string)


E  = %10000000
RW = %01000000
RS = %00100000

    .org $8000 ;code starts at $8000

reset:
;resets the processor
    ldx #$ff;Reset stack pointer
    txs

    LDA #%11111111 ;set portB pins to output
    STA DDRB
    LDA #%11100001 ;set top 3 portA pins to output
    STA DDRA

    lda #1
    sta PORTA

    ;Set up LCD
    LDA #%00111000 ;8-bit mode, 2-line display, 5x8 font
    jsr lcd_instruction
    lda #%00001110 ;Display on, Cursor on, blink off
    jsr lcd_instruction
    lda #%00000110 ;Increment and shift cursor but not display
    jsr lcd_instruction
    lda #%00000001 ;Clear the display, in case of a reset
    jsr lcd_instruction

    ;reset 'message'
    lda #0
    sta message

    ;Reset 'value' to 'number' stored in EEPROM that we want to convert
    lda number
    sta value
    lda number + 1
    sta value  + 1

divide:

    lda #%00000010 ;crsr home
    jsr lcd_instruction

    ;reset mod10 (remadier) to zero
    lda #0
    sta mod10
    sta mod10 + 1
    clc

    ldx #16
divloop:
    ;32 bit rotate of quotient and remandier
    rol value
    rol value + 1
    rol mod10
    rol mod10 + 1

    ;Process 16 bit subtraction
    sec
    lda mod10
    sbc #10
    tay ; save lo byte
    lda mod10 + 1
    sbc #0
    ;a,y now contain the result of the subrtaction

    bcc ignore_result ;brnch if dividend < divisor
    sty mod10
    sta mod10 + 1

ignore_result:
    dex
    bne divloop
    rol value
    rol value + 1

    lda mod10
    clc
    adc #"0" ;add ascii zero to it to get the correct character
    jsr push_char

    ; if value != 0 then keep dividing
    lda value
    ora value + 1
    bne divide


    ldx #0
print:
    lda message,x
    beq done
    jsr lcd_char
    inx
    jmp print


done:
    jmp divide
    

number: .word 1729

;add char in A register to null-terminated string at 'message'
push_char:
    pha ;Push A to stack
    ldy #0

char_loop:
    lda message,y; get char from string and put into x
    tax
    pla
    sta message,y; Pull char off stack and add it to string
    iny
    txa
    pha ; push char from string onto stack
    bne char_loop

    pla
    sta message,y ;Put null back at end of string

    rts

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
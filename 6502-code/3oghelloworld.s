    .org $8000
PORTB = $6000    
PORTA = $6001
DDRB  = $6002
DDRA  = $6003

E  = %10000000
RW = %01000000
RS = %00100000

reset:

    LDA #%11111111 ;set portB pins to output
    STA DDRB
    LDA #%11100000 ;set top 3 portA pins to output
    STA DDRA

    ;Set up LCD

    LDA #%00111000 ;8-bit mode, 2-line display, 5x8 font
    sta PORTB
    ;Send Instruction
    lda #0 ; Clear RS/RW/E, then Set E bit, then clear all.
    sta PORTA
    lda #E
    sta PORTA
    lda #0
    sta PORTA

    lda #%00001110 ;Display on, Cursor on, blink off
    sta PORTB
    ;Send Instruction
    lda #0
    sta PORTA
    lda #E
    sta PORTA
    lda #0
    sta PORTA

    lda #%00000110 ;Increment and shift cursor but not display
    sta PORTB
    ;Send Instruction
    lda #0
    sta PORTA
    lda #E
    sta PORTA
    lda #0
    sta PORTA

    lda #"H"
    sta PORTB
    ;Send Char
    lda #RS ;set RS, Clear RW/E, then Set E bit, then clear E bit.
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"e"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"l"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"l"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"o"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #","
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #" "
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"W"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"o"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"r"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"l"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"d"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

    lda #"!"
    sta PORTB
    ;Send Char
    lda #RS
    sta PORTA
    lda #(RS | E)
    sta PORTA
    lda #RS
    sta PORTA

done:
    jmp done

    .org $fffc
    .word reset
    .word $0000 ;pad it out to 32kb
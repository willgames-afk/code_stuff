DDRB  = $6002
PORTB = $6000


    .org $8000

reset:
    LDA #$FF ;set pins to output
    STA DDRB

    LDA #%10100000
loop:
    STA PORTB
    ROR

    JMP loop

    .org $fffc
    .word reset
    .word $0000 ;padding
    .org $8000

reset:
    LDA #$FF ;set pins to output
    STA $6002

loop:
    LDA #$55 ;01010101
    STA $6000

    LDA #$aa ;10101010
    STA $6000

    JMP loop

    .org $fffc
    .word reset
    .word $0000 ;padding
;Print String SRs

;Include lcd.s

printStringAddr:	
	.word $0000; //String Address

print: 

;Args: Address, LSB in the A reg and MSB in Y.
; Should point to a null-terminated string.
; If the string is longer than 256 bytes, it will only print the first 256.
;Stores 
	sta printStringAddr
	sty printStringAddr + 1

    ldy #$00
_printLoop:
    lda printStringAddr,Y ;Grab Character
    bne _printexit  ;Finish if it's a Null
    jsr lcd_data	;Print it otherwise
    iny				;Increment Y to the next character
	bcs _printexit  
    jmp _printloop  ;Repeat!
_printexit:
    lda printStringAddr     ;Get original values for A and Y, in case the thing that called this subroutine still needed them
    lda printStringAddr + 1
    rts
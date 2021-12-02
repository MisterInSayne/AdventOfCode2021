section	.bss
    %define buffer_len 1
    buffer: resb buffer_len
    length: resd 1
	
    start: resd 1
	
	instruction: resb 1024
	instrNr: resd 1
	instrStart: resd 1
	
	character: resd 128
	
	string: resb 10240
	substr: resb 128
	strlen: resd 1
	
	xpos: resd 1
	ypos: resd 1
	yposb: resd 1
	
	

section	.data
	pOneTxt db '------------------[Part 1]------------------'
	pTwoTxt db '------------------[Part 2]------------------'
	horposTxt db 'horizontal position: '
	depthposTxt db 'depth position: '
	answerTxt db 'Answer: '

section	.text
	global _start
	
_start:
    mov [length], dword 0
    mov [instrStart], dword 0
	mov [xpos], dword 0
    mov [ypos], dword 0
    mov [yposb], dword 0
	
    call doPartOne
	
	mov edx, 44
	mov ecx, pOneTxt
	call printMsg
	
	mov eax, 0xa
    call printChar
	
	mov edx, 21
	mov ecx, horposTxt
	call printMsg
	
	mov eax, [xpos]
	call printNum
	
	mov eax, 0xa
    call printChar
	
	mov edx, 16
	mov ecx, depthposTxt
	call printMsg
	
	mov eax, [ypos]
	call printNum
	
	mov eax, 0xa
    call printChar
	
	mov edx, 8
	mov ecx, answerTxt
	call printMsg
	
	mov eax, [ypos]
	imul eax, [xpos]
	call printNum
	
	mov eax, 0xa
    call printChar
	
	mov edx, 44
	mov ecx, pTwoTxt
	call printMsg
	
	mov eax, 0xa
    call printChar
	
	mov edx, 21
	mov ecx, horposTxt
	call printMsg
	
	mov eax, [xpos]
	call printNum
	
	mov eax, 0xa
    call printChar
	
	mov edx, 16
	mov ecx, depthposTxt
	call printMsg
	
	mov eax, [yposb]
	call printNum
	
	mov eax, 0xa
    call printChar
	
	mov edx, 8
	mov ecx, answerTxt
	call printMsg
	
	mov eax, [yposb]
	imul eax, [xpos]
	call printNum
	
    mov eax, 1
	int 0x80
	


printMsg:
    mov ebx, 1
	mov eax, 4
	int 0x80
    ret



doPartOne:
	call getInstr
	cmp eax, 0
	jle doPartOneEnd
    call getFirstLetter
	
	cmp [substr], byte 0x66 ; forward
	jne doPartOneNotForward
	mov [start], dword 8
	call getInstNumber
	mov eax, [instrNr]
	add dword [xpos], eax
	imul eax, [ypos]
	add dword [yposb], eax
	
	jmp doPartOneCmpDone
	doPartOneNotForward:
	cmp [substr], byte 0x75 ; up
	jne doPartOneNotUp
	mov [start], dword 3
	call getInstNumber
	mov eax, [instrNr]
	sub dword [ypos], eax
	
	jmp doPartOneCmpDone
	doPartOneNotUp: ; down
	mov [start], dword 5
	call getInstNumber
	mov eax, [instrNr]
	add dword [ypos], eax
	
	doPartOneCmpDone:
	jmp doPartOne
	doPartOneEnd:
	ret


getFirstLetter:
	mov [start], dword 0
	mov [strlen], dword 1
    mov [substr], dword 0
	mov dword [string], instruction
    mov esi, [string]
    add esi, [start]
    mov edi, substr
    mov ecx, [strlen]
    rep movsb
    ret

getInstNumber:
	mov [strlen], dword 1
    mov [instrNr], dword 0
	mov dword [string], instruction
    mov esi, [string]
    add esi, [start]
    mov edi, instrNr
    mov ecx, [strlen]
    rep movsb
	
	sub [instrNr], byte 0x30
    ret



getInstr:
	mov [instruction], dword 0
    mov [length], dword 0
	mov edi, instruction
	add edi, [length]
	mov eax, [length]
	mov [instrStart],dword eax
	getInstrLoop:
		mov edx, buffer_len
		mov ecx, buffer
		mov ebx, 0
		mov eax, 3
		int 0x80
		cmp eax, 0 ; end of file
		jle getInstrEOL
		cmp [buffer], byte 0xa ;end of line
		je getInstrEOL
		mov ebx, dword [buffer]
		mov [edi], ebx
		inc dword [length]
		inc edi
		jmp getInstrLoop
	getInstrEOL:
	ret


printNum:
    push eax
    push ecx
    push edx
    push ebx
    mov ecx, 10
printNumLoop: 
    mov edx,0
    call divbyten
    add edx, 0x30
    push edx
    dec ecx
    cmp eax, 0
    je printNumPart2
    cmp ecx, 0
    jne printNumLoop
printNumPart2:
    mov ebx, ecx
    mov ecx, 10
    sub ecx, ebx
printNumLoop2:
    pop eax
    call printChar
    dec ecx
    jne printNumLoop2
    pop ebx
    pop edx
    pop ecx
    pop eax
    ret

divbyten:
    push ebx
    mov ebx, 10
    mov edx, 0
    idiv ebx
    pop ebx
    ret
	
printChar:
    push ecx
    push edx
    mov [character], eax
    mov edx, 1
	mov ecx, character
	mov ebx, 1
	mov eax, 4
	int 0x80
	pop edx
	pop ecx
	ret
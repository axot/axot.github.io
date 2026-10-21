---
layout: post
status: publish
published: true
title: "Can You Crack It? A Step-by-Step Solution"
author: axot
author_login: axot
author_email: im.axot@gmail.com
author_url: http://www.axot.org
excerpt: "A walkthrough of GCHQ’s 2011 challenge, from hidden bytes and x86 machine code to a virtual CPU and the final license file."
wordpress_id: 17
wordpress_url: http://www.axot.org/?p=17
date: !binary |-
  MjAxMS0xMi0wNSAwOToyMjozNiArMDkwMA==
date_gmt: !binary |-
  MjAxMS0xMi0wNSAwOToyMjozNiArMDkwMA==
categories:
- Reverse Engineering
tags:
- RCE
- Crack
- GDB
- GCC
- CYGWIN
comments:
- id: 28
  author: Rayshelon
  author_email: support@sakura.ad.jp
  author_url: http://www.facebook.com/
  date: !binary |-
    MjAxMS0xMi0yNSAyMjo1MzowMCArMDkwMA==
  date_gmt: !binary |-
    MjAxMS0xMi0yNSAxMzo1MzowMCArMDkwMA==
  content: This shows real epxertise. Thanks for the answer.
- id: 32
  author: Alyn
  author_email: chshah@cox.net
  author_url: http://www.google.com/
  date: !binary |-
    MjAxMS0xMi0zMCAxNDozNTozNSArMDkwMA==
  date_gmt: !binary |-
    MjAxMS0xMi0zMCAwNTozNTozNSArMDkwMA==
  content: I tohguht I'd have to read a book for a discovery like this!
- id: 67
  author: aoouch
  author_email: kohyzsc123@qq.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMi0xNSAyMzo1NTowMCArMDkwMA==
  date_gmt: !binary |-
    MjAxMi0wMi0xNSAxNDo1NTowMCArMDkwMA==
  content: ! '师父我弱爆了T_T

'
---
It had been a while since my last post when GCHQ’s 2011 “Can You Crack It?” challenge caught my attention. What started as a picture of hexadecimal bytes turned into a three-stage exercise in reverse engineering: decode some machine code, implement a virtual CPU, and reconstruct a license file.

This is my walkthrough of the original challenge at [canyoucrackit.co.uk](http://canyoucrackit.co.uk/). The listings below are from my 2011 notes, so the commands, tools, and external resources reflect that environment.

## Part 1: From pixels to machine code

### Identifying the bytes

The [original challenge image](http://www.axot.org/wp-content/uploads/2011/12/cyber.png) contains a 10-by-16 grid of hexadecimal values: 160 bytes in total. I copied those bytes into a file called `raw` and started by looking for printable strings.

```bash
$ strings raw
\X=AAAAuCX=BBBBu;Z
```

The strings `AAAA` and `BBBB` stood out, but they did not explain much on their own. The first byte was a more useful clue: `0xEB` is an x86 short-jump opcode. Perhaps these were instructions rather than arbitrary data.

I disassembled the file as a raw 32-bit x86 binary:

```asm
$ gobjdump -D -b binary -mi386 raw
raw:     file format binary
Disassembly of section .data:
00000000 <.data>:
   0:	eb 04                	jmp    0x6
   2:	af                   	scas   %es:(%edi),%eax
   3:	c2 bf a3             	ret    $0xa3bf
   6:	81 ec 00 01 00 00    	sub    $0x100,%esp
   c:	31 c9                	xor    %ecx,%ecx
   e:	88 0c 0c             	mov    %cl,(%esp,%ecx,1)
  11:	fe c1                	inc    %cl
  13:	75 f9                	jne    0xe
  15:	31 c0                	xor    %eax,%eax
  17:	ba ef be ad de       	mov    $0xdeadbeef,%edx
  1c:	02 04 0c             	add    (%esp,%ecx,1),%al
  1f:	00 d0                	add    %dl,%al
  21:	c1 ca 08             	ror    $0x8,%edx
  24:	8a 1c 0c             	mov    (%esp,%ecx,1),%bl
  27:	8a 3c 04             	mov    (%esp,%eax,1),%bh
  2a:	88 1c 04             	mov    %bl,(%esp,%eax,1)
  2d:	88 3c 0c             	mov    %bh,(%esp,%ecx,1)
  30:	fe c1                	inc    %cl
  32:	75 e8                	jne    0x1c
  34:	e9 5c 00 00 00       	jmp    0x95
  39:	89 e3                	mov    %esp,%ebx
  3b:	81 c3 04 00 00 00    	add    $0x4,%ebx
  41:	5c                   	pop    %esp
  42:	58                   	pop    %eax
  43:	3d 41 41 41 41       	cmp    $0x41414141,%eax
  48:	75 43                	jne    0x8d
  4a:	58                   	pop    %eax
  4b:	3d 42 42 42 42       	cmp    $0x42424242,%eax
  50:	75 3b                	jne    0x8d
  52:	5a                   	pop    %edx
  53:	89 d1                	mov    %edx,%ecx
  55:	89 e6                	mov    %esp,%esi
  57:	89 df                	mov    %ebx,%edi
  59:	29 cf                	sub    %ecx,%edi
  5b:	f3 a4                	rep movsb %ds:(%esi),%es:(%edi)
  5d:	89 de                	mov    %ebx,%esi
  5f:	89 d1                	mov    %edx,%ecx
  61:	89 df                	mov    %ebx,%edi
  63:	29 cf                	sub    %ecx,%edi
  65:	31 c0                	xor    %eax,%eax
  67:	31 db                	xor    %ebx,%ebx
  69:	31 d2                	xor    %edx,%edx
  6b:	fe c0                	inc    %al
  6d:	02 1c 06             	add    (%esi,%eax,1),%bl
  70:	8a 14 06             	mov    (%esi,%eax,1),%dl
  73:	8a 34 1e             	mov    (%esi,%ebx,1),%dh
  76:	88 34 06             	mov    %dh,(%esi,%eax,1)
  79:	88 14 1e             	mov    %dl,(%esi,%ebx,1)
  7c:	00 f2                	add    %dh,%dl
  7e:	30 f6                	xor    %dh,%dh
  80:	8a 1c 16             	mov    (%esi,%edx,1),%bl
  83:	8a 17                	mov    (%edi),%dl
  85:	30 da                	xor    %bl,%dl
  87:	88 17                	mov    %dl,(%edi)
  89:	47                   	inc    %edi
  8a:	49                   	dec    %ecx
  8b:	75 de                	jne    0x6b
  8d:	31 db                	xor    %ebx,%ebx
  8f:	89 d8                	mov    %ebx,%eax
  91:	fe c0                	inc    %al
  93:	cd 80                	int    $0x80
  95:	90                   	nop
  96:	90                   	nop
  97:	e8 9d ff ff ff       	call   0x39
  9c:	41                   	inc    %ecx
  9d:	41                   	inc    %ecx
  9e:	41                   	inc    %ecx
  9f:	41                   	inc    %ecx
```

### Finding the missing data

The first instruction jumps to offset `0x6`, skipping four bytes. That was worth remembering, although it did not immediately explain the rest of the code.

The call at `0x97` pushes the return address, `0x9C`, onto the stack and transfers control to `0x39`. The subsequent instructions read values from the data starting at that address. The comparison at `0x43` checks for `AAAA`, which matches the last four bytes in the image. The next comparison, at `0x4B`, expects `BBBB`—but the image ends at `0x9F`, before that value could appear.

That suggested the visible grid was only part of the input. I downloaded the PNG itself and inspected its contents:

```text
$ hexdump -C cyber.png
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|
00000010  00 00 02 e4 00 00 01 04  08 02 00 00 00 ef 6a b6  |..............j.|
00000020  2d 00 00 00 01 73 52 47  42 00 ae ce 1c e9 00 00  |-....sRGB.......|
00000030  00 09 70 48 59 73 00 00  0b 13 00 00 0b 13 01 00  |..pHYs..........|
00000040  9a 9c 18 00 00 00 07 74  49 4d 45 07 db 08 05 0e  |.......tIME.....|
00000050  12 33 7e 39 c1 70 00 00  00 5d 69 54 58 74 43 6f  |.3~9.p...]iTXtCo|
00000060  6d 6d 65 6e 74 00 00 00  00 00 51 6b 4a 43 51 6a  |mment.....QkJCQj|
00000070  49 41 41 41 43 52 32 50  46 74 63 43 41 36 71 32  |IAAACR2PFtcCA6q2|
00000080  65 61 43 38 53 52 2b 38  64 6d 44 2f 7a 4e 7a 4c  |eaC8SR+8dmD/zNzL|
00000090  51 43 2b 74 64 33 74 46  51 34 71 78 38 4f 34 34  |QC+td3tFQ4qx8O44|
000000a0  37 54 44 65 75 5a 77 35  50 2b 30 53 73 62 45 63  |7TDeuZw5P+0SsbEc|
000000b0  59 52 0a 37 38 6a 4b 4c  77 3d 3d 32 ca be f1 00  |YR.78jKLw==2....|
...
```

The PNG’s comment metadata contained another clue. Joining the encoded text into a single line gives:

```text
QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR78jKLw==
```

The trailing `==` looked like Base64 padding. I decoded the string and inspected the result:

```text
$ echo 'QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR78jKLw==' | base64 -D -o decoded.bin
$ hexdump -C decoded.bin
00000000  42 42 42 42 32 00 00 00  91 d8 f1 6d 70 20 3a ab  |BBBB2......mp :.|
00000010  67 9a 0b c4 91 fb c7 66  0f fc cd cc b4 02 fa d7  |g......f........|
00000020  77 b4 54 38 ab 1f 0e e3  8e d3 0d eb 99 c3 93 fe  |w.T8............|
00000030  d1 2b 1b 11 c6 11 ef c8  ca 2f                    |.+......./|
0000003a
```

There was the missing `BBBB` marker, followed by more data. I appended those decoded bytes to the 160 bytes from the image.

### Running the combined payload

To inspect the result, I put the combined bytes into a small C harness. It changes `INT 0x80` to `INT 3` so execution stops in the debugger, marks the memory executable, and calls the payload.

This is the original 2011 harness, written for a 32-bit environment. It is included as part of the historical solution, not as a recommendation to execute unknown code on a current system.

```c
#include <stdio.h>
#include <sys/types.h>
#include <sys/mman.h>
main(){
  int i;
  static unsigned char shellcode[] = {
    0xEB,0x04,0xAF,0xC2,0xBF,0xA3,0x81,0xEC,
    0x00,0x01,0x00,0x00,0x31,0xC9,0x88,0x0C,
    0x0C,0xFE,0xC1,0x75,0xF9,0x31,0xC0,0xBA,
    0xEF,0xBE,0xAD,0xDE,0x02,0x04,0x0C,0x00,
    0xD0,0xC1,0xCA,0x08,0x8A,0x1C,0x0C,0x8A,
    0x3C,0x04,0x88,0x1C,0x04,0x88,0x3C,0x0C,
    0xFE,0xC1,0x75,0xE8,0xE9,0x5C,0x00,0x00,
    0x00,0x89,0xE3,0x81,0xC3,0x04,0x00,0x00,
    0x00,0x5C,0x58,0x3D,0x41,0x41,0x41,0x41,
    0x75,0x43,0x58,0x3D,0x42,0x42,0x42,0x42,
    0x75,0x3B,0x5A,0x89,0xD1,0x89,0xE6,0x89,
    0xDF,0x29,0xCF,0xF3,0xA4,0x89,0xDE,0x89,
    0xD1,0x89,0xDF,0x29,0xCF,0x31,0xC0,0x31,
    0xDB,0x31,0xD2,0xFE,0xC0,0x02,0x1C,0x06,
    0x8A,0x14,0x06,0x8A,0x34,0x1E,0x88,0x34,
    0x06,0x88,0x14,0x1E,0x00,0xF2,0x30,0xF6,
    0x8A,0x1C,0x16,0x8A,0x17,0x30,0xDA,0x88,
    0x17,0x47,0x49,0x75,0xDE,0x31,0xDB,0x89,
    0xD8,0xFE,0xC0,0xCD,0x80,0x90,0x90,0xE8,
    0x9D,0xFF,0xFF,0xFF,0x41,0x41,0x41,0x41,
    0x42,0x42,0x42,0x42,0x32,0x00,0x00,0x00,
    0x91,0xD8,0xF1,0x6D,0x70,0x20,0x3A,0xAB,
    0x67,0x9A,0x0B,0xC4,0x91,0xFB,0xC7,0x66,
    0x0F,0xFC,0xCD,0xCC,0xB4,0x02,0xFA,0xD7,
    0x77,0xB4,0x54,0x38,0xAB,0x1F,0x0E,0xE3,
    0x8E,0xD3,0x0D,0xEB,0x99,0xC3,0x93,0xFE,
    0xD1,0x2B,0x1B,0x11,0xC6,0x11,0xEF,0xC8,
    0xCA,0x2F
  };
  /*
   * patch INT 0x80 to INT 3 to throw an exception signal to debugger
   * 0xCD -> 0xCC
   */
  printf("patching shellcode...\n");
  for(i = 0; i < sizeof(shellcode); i++){
    if(*(unsigned short*)&shellcode[i] == 0x80CD){
      shellcode[i] = 0xCC;
      printf("patch done\n");
      break;
    }
  }
  unsigned int page = ((unsigned int)shellcode)&0xfffff000;
  if(-1 == mprotect((void*)page, 4096, PROT_READ | PROT_WRITE | PROT_EXEC))
    perror("mprotect error");
  ((int(*)())shellcode)();
}
```

The loop writes the decoded output through `EDI`, including the write at offset `0x87`. By the time the debugger stops at the patched interrupt, the resulting string begins at `EDI - 0x32`.

```bash
$ gcc -arch i386 -g stage1.c -o stage1
$ gdb stage1
(gdb) r
(gdb) x/s $edi-0x32
0xbffff79a:	 "GET /15b436de1f9107f3778aad525e5d0b20.js HTTP/1.1"
```

The decoded HTTP request points to `/15b436de1f9107f3778aad525e5d0b20.js`. That [JavaScript file](http://canyoucrackit.co.uk/15b436de1f9107f3778aad525e5d0b20.js) is the next stage.

## Part 2: Building a virtual machine

### Reading the specification

The JavaScript file defines a virtual CPU, initializes its memory, and describes the instruction set. The execution function is deliberately missing: `VM.exec()` throws an error instead of running the program.

Here is the original challenge file:

```js
//--------------------------------------------------------------------------------------------------
//
// stage 2 of 3
//
// challenge:
//   reveal the solution within VM.mem
//
// disclaimer:
//   tested in ie 9, firefox 6, chrome 14 and v8 shell (http://code.google.com/apis/v8/build.html),
//   other javascript implementations may or may not work.
//
//--------------------------------------------------------------------------------------------------
var VM = {
  cpu: {
    ip: 0x00,
    r0: 0x00,
    r1: 0x00,
    r2: 0x00,
    r3: 0x00,
    cs: 0x00,
    ds: 0x10,
    fl: 0x00,
    firmware: [0xd2ab1f05, 0xda13f110]
  },
  mem: [
    0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,
    0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,
    0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,
    0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,
    0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
    0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
    0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,
    0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,
    0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,
    0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,
    0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,
    0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,
    0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,
    0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,
    0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,
    0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,
    0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,
    0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,
    0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,
    0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,
    0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,
    0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,
    0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,
    0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,
    0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,
    0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,
    0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,
    0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,
    0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,
    0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ],
  exec: function()
  {
    // virtual machine architecture
    // ++++++++++++++++++++++++++++
    //
    // segmented memory model with 16-byte segment size (notation seg:offset)
    //
    // 4 general-purpose registers (r0-r3)
    // 2 segment registers (cs, ds equiv. to r4, r5)
    // 1 flags register (fl)
    //
    // instruction encoding
    // ++++++++++++++++++++
    //
    //           byte 1               byte 2 (optional)
    // bits      [ 7 6 5 4 3 2 1 0 ]  [ 7 6 5 4 3 2 1 0 ]
    // opcode      - - -
    // mod               -
    // operand1            - - - -
    // operand2                         - - - - - - - -
    //
    // operand1 is always a register index
    // operand2 is optional, depending upon the instruction set specified below
    // the value of mod alters the meaning of any operand2
    //   0: operand2 = reg ix
    //   1: operand2 = fixed immediate value or target segment (depending on instruction)
    //
    // instruction set
    // +++++++++++++++
    //
    // Notes:
    //   * r1, r2 => operand 1 is register 1, operand 2 is register 2
    //   * movr r1, r2 => move contents of register r2 into register r1
    //
    // opcode | instruction | operands (mod 0) | operands (mod 1)
    // -------+-------------+------------------+-----------------
    // 0x00   | jmp         | r1               | r2:r1
    // 0x01   | movr        | r1, r2           | rx,   imm
    // 0x02   | movm        | r1, [ds:r2]      | [ds:r1], r2
    // 0x03   | add         | r1, r2           | r1,   imm
    // 0x04   | xor         | r1, r2           | r1,   imm
    // 0x05   | cmp         | r1, r2           | r1,   imm
    // 0x06   | jmpe        | r1               | r2:r1
    // 0x07   | hlt         | N/A              | N/A
    //
    // flags
    // +++++
    //
    // cmp r1, r2 instruction results in:
    //   r1 == r2 => fl = 0
    //   r1 < r2  => fl = 0xff
    //   r1 > r2  => fl = 1
    //
    // jmpe r1
    //   => if (fl == 0) jmp r1
    //      else nop
    throw "VM.exec not yet implemented";
  }
};
//--------------------------------------------------------------------------------------------------
try
{
  VM.exec();
}
catch(e)
{
  alert('\nError: ' + e + '\n');
}
//--------------------------------------------------------------------------------------------------
```

The architecture has four general-purpose registers, two segment registers, and a flags register. Memory addresses use 16-byte segments. The first instruction byte encodes the opcode, a mode bit, and the first operand; some instructions also use a second byte.

The task is to implement those instructions and let the program transform its memory. I chose to write the interpreter in C rather than fill in the JavaScript function.

### Implementing the interpreter

My implementation keeps the CPU state in a structure, decodes each instruction, and dispatches it through a `switch` statement. Once execution halts, it writes the data segment to `mem.dump` so I can inspect the result.

This is the implementation from my original notes:

```c
#include <stdio.h>
static unsigned char mem[] = {
  0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,
  0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,
  0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,
  0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,
  0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
  0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,
  0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,
  0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,
  0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,
  0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,
  0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,
  0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,
  0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,
  0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,
  0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,
  0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,
  0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,
  0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,
  0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,
  0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,
  0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,
  0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,
  0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,
  0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,
  0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,
  0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,
  0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,
  0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,
  0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,
  0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};
#define adr(seg, off) ((seg << 4) + off)
typedef unsigned char   byte;
typedef unsigned short  word;
typedef unsigned int    dword;
typedef struct _CPU {
  byte ip;
  byte regs[6];
  byte fl;
} _CPU;
_CPU cpu;
enum _REGISTER {
  r0,
  r1,
  r2,
  r3,
  cs,
  ds
};
typedef struct _INSTRUCTION {
  byte opcode;
  byte mod;
  byte operand1;
  byte operand2;
  byte unknown[2];
} _INSTRUCTION, *pInstruction;
_INSTRUCTION ins;
enum _OPCODE {
  JMP,
  MOVR,
  MOVM,
  ADD,
  XOR,
  CMP,
  JMPE,
  HLT
};
void fetchDecode(pInstruction pIns){
  word currentIP    = adr(cpu.regs[cs], cpu.ip);
  pIns->opcode      = (mem[currentIP] >> 5) & 0x07;
  pIns->mod         = (mem[currentIP] >> 4) & 0x01;
  pIns->operand1    = mem[currentIP] & 0x0F;
  pIns->operand2    = mem[currentIP+1];
  pIns->unknown[0]  = mem[currentIP];
  pIns->unknown[1]  = mem[currentIP+1];
  cpu.ip += 2;
}
void exec(pInstruction pIns){
  printf("IP:%d\t", cpu.ip);
  switch(pIns->opcode) {
    case JMP:
      if(!pIns->mod){
        cpu.ip = cpu.regs[pIns->operand1];
        printf("JMP  %d\n", pIns->operand1);
      }
      else{
        cpu.regs[cs] = pIns->operand2;
        cpu.ip = (cpu.regs[cs] << 4) + cpu.regs[pIns->operand1];
        printf("JMP  %d: %d\n", pIns->operand2, pIns->operand1);
      }
      break;
    case MOVR:
      if(!pIns->mod){
        cpu.regs[pIns->operand1] = cpu.regs[pIns->operand2];
        printf("MOVR %d, %d\n", pIns->operand1, pIns->operand2);
      }
      else{
        cpu.regs[pIns->operand1] = pIns->operand2;
        printf("MOVR %d, %02X\n", pIns->operand1, pIns->operand2);
      }
      break;
    case MOVM:
      if(!pIns->mod){
        cpu.regs[pIns->operand1] = mem[adr(cpu.regs[ds], cpu.regs[pIns->operand2])];
        printf("MOVM %d, [DS: %d]\n", pIns->operand1, pIns->operand2);
      }
      else{
        mem[adr(cpu.regs[ds], cpu.regs[pIns->operand1])] = cpu.regs[pIns->operand2];
        printf("MOVM [DS: %d], %d\n", pIns->operand1, pIns->operand2);
      }
      break;
    case ADD:
      if(!pIns->mod){
        cpu.regs[pIns->operand1] += cpu.regs[pIns->operand2];
        printf("ADD %d, %d\n", pIns->operand1, pIns->operand2);
      }
      else{
        cpu.regs[pIns->operand1] += pIns->operand2;
        printf("ADD %d, %02X\n", pIns->operand1, pIns->operand2);
      }
      break;
    case XOR:
      if(!pIns->mod){
        cpu.regs[pIns->operand1] ^= cpu.regs[pIns->operand2];
        printf("XOR %d, R%d\n", pIns->operand1, pIns->operand2);
      }
      else{
        cpu.regs[pIns->operand1] ^= pIns->operand2;
        printf("XOR %d, %02X\n", pIns->operand1, pIns->operand2);
      }
      break;
    case CMP:
      if(!pIns->mod){
        cpu.fl = cpu.regs[pIns->operand1] == cpu.regs[pIns->operand2]? 0x00: (cpu.regs[pIns->operand1] < cpu.regs[pIns->operand2]? 0xff: 0x01);
        printf("CMP  %d, %d\n", pIns->operand1, pIns->operand2);
      }
      else{
        cpu.fl = cpu.regs[pIns->operand1] == pIns->operand2? 0x00: (cpu.regs[pIns->operand1] < pIns->operand2? 0xff: 0x01);
        printf("CMP %d, %02X\n", pIns->operand1, pIns->operand2);
      }
      break;
    case JMPE:
      if(!cpu.fl){
        if(!pIns->mod){
          cpu.ip = adr(cpu.regs[cs], cpu.regs[pIns->operand1]);
          printf("JMPE %d\n", pIns->operand1);
        }
        else{
          cpu.ip = adr(cpu.regs[cs], adr(cpu.regs[pIns->operand2], cpu.regs[pIns->operand1]));
          printf("JMPE %d: %d\n", pIns->operand2, pIns->operand1);
        }
        break;
      }
      --cpu.ip;
      printf("JMPE NOP\n");
      break;
    case HLT:
      pIns->opcode = HLT;
      printf("HLT\n");
      break;
    default:
      pIns->opcode = HLT;
      printf("UNKNOW %02Xh, %02Xh\n", pIns->unknown[0], pIns->unknown[1]);
      break;
  };
}
main(){
  cpu.ip = 0x00;
  cpu.regs[r0] = 0x00;
  cpu.regs[r1] = 0x00;
  cpu.regs[r2] = 0x00;
  cpu.regs[r3] = 0x00;
  cpu.regs[cs] = 0x00;
  cpu.regs[ds] = 0x10;
  cpu.fl = 0x00;
  int i = 0;
  while ( ++i < (2<<16) && ins.opcode != HLT) {
    fetchDecode(&ins);
    exec(&ins);
  }
  FILE *fp = fopen("mem.dump", "w");
  dword dataStart = adr(cpu.regs[ds], 0);
  fwrite((void*)(mem+dataStart), sizeof(mem)-dataStart, 1, fp);
  fclose(fp);
}
```

### Inspecting the decoded memory

I compiled the interpreter, ran it, and searched the memory dump for readable strings:

```text
$ gcc -arch i386 -g stage2_vm.c -o stage2_vm
$ ./stage2_vm
...
IP:22	JMPE NOP
IP:23	CMP 0, 00
IP:25	MOVR 0, 1B
IP:27	JMPE 0
IP:29	HLT
$ strings mem.dump
GET /da75370fe15c4148bd4ceec861fbdaa5.exe HTTP/1.0
h%2w
b#[GUS0
k6oofU0
t\?)+f=
EFg }D
kEmT
`bUZJfa
xvar>7#Vsqyc|
Z//NN
```

The useful string is another HTTP request, this time for `/da75370fe15c4148bd4ceec861fbdaa5.exe`. That gives us the [executable for Part 3](http://canyoucrackit.co.uk/da75370fe15c4148bd4ceec861fbdaa5.exe).

## Part 3: Reconstructing the license

### Examining the executable

The final stage is a Windows executable that depends on Cygwin. My original setup required Windows or Wine with the appropriate runtime.

As before, I started with its printable strings:

```text
$ strings da75370fe15c4148bd4ceec861fbdaa5.exe
...
hqDTK7b8K2rvw
keygen.exe
usage: keygen.exe hostname
license.txt
error: license.txt not found
loading stage1 license key(s)...
loading stage2 license key(s)...
error: license.txt invalid
error: gethostbyname() failed
error: connect("%s") failed
GET /%s/%x/%x/%x/key.txt HTTP/1.0
...
```

Several strings explain what the program expects: a hostname argument, a file named `license.txt`, and license keys carried over from the first two stages. The HTTP request format also shows how the final URL will be assembled.

I renamed the downloaded executable to `keygen.exe`, matching the name in its usage message, and invoked it with the challenge hostname:

```bash
keygen.exe canyoucrackit.co.uk
```

It still needed a valid `license.txt`. To work out the file format, I inspected the validation routine in IDA Pro 6.1.110530 Evaluation. Here is the relevant disassembly from my notes:

```masm
.text:00401120 loc_401120:                             ; CODE XREF: sub_401090+76j
.text:00401120                 mov     [esp+78h+var_70], 18h
.text:00401128                 mov     [esp+78h+hqDTK7b8K2rvw_copy], 0
.text:00401130                 lea     eax, [ebp+license1]
.text:00401133                 mov     [esp+78h+license2], eax
.text:00401136                 call    memset
.text:0040113B                 lea     eax, [ebp+license1]
.text:0040113E                 mov     [esp+78h+var_70], eax
.text:00401142                 mov     [esp+78h+hqDTK7b8K2rvw_copy], offset aS ; "%s"
.text:0040114A                 mov     eax, [ebp+var_4C]
.text:0040114D                 mov     [esp+78h+license2], eax
.text:00401150                 call    fscanf
.text:00401155                 mov     eax, [ebp+var_4C]
.text:00401158                 mov     [esp+78h+license2], eax
.text:0040115B                 call    fclose
.text:00401160                 mov     [ebp+var_4C], 0
.text:00401167                 cmp     [ebp+license1], 'qhcg'               // head 4 chars of license are qhcg
.text:0040116E                 jnz     short loc_4011CF
.text:00401170                 mov     eax, hqDTK7b8K2rvw
.text:00401175                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax
.text:00401179                 lea     eax, [ebp+license1]
.text:0040117C                 add     eax, 4
.text:0040117F                 mov     [esp+78h+license2], eax
                                                                            // char *crypt(const char *key, const char *salt);
                                                                            // key are 8 chars、salt are 2 chars
.text:00401182                 call    crypt                                // crypt("license", "hq");
.text:00401187                 mov     edx, eax
.text:00401189                 mov     eax, hqDTK7b8K2rvw
.text:0040118E                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax
.text:00401192                 mov     [esp+78h+license2], edx
.text:00401195                 call    strcmp
.text:0040119A                 test    eax, eax
.text:0040119C                 jnz     short loc_4011A5
.text:0040119E                 mov     [ebp+var_C], 1
.text:004011A5
.text:004011A5 loc_4011A5:                             ; CODE XREF: sub_401090+10Cj
.text:004011A5                 mov     [esp+78h+license2], offset aLoadingStage1L ; "loading stage1 license key(s)...\n"
.text:004011AC                 call    printf
.text:004011B1                 mov     eax, [ebp+license3]
.text:004011B4                 mov     [ebp+license3_copy], eax
.text:004011B7                 mov     [esp+78h+license2], offset aLoadingStage2L ; "loading stage2 license key(s)...\n\n"
.text:004011BE                 call    printf
.text:004011C3                 mov     eax, [ebp+license4]
.text:004011C6                 mov     [ebp+license4_copy], eax
.text:004011C9                 mov     eax, [ebp+license5]
.text:004011CC                 mov     [ebp+license5_copy], eax
.text:004011CF
.text:004011CF loc_4011CF:                             ; CODE XREF: sub_401090+DEj
.text:004011CF                 cmp     [ebp+var_C], 0
.text:004011D3                 jnz     short loc_4011EA
.text:004011D5                 mov     [esp+78h+license2], offset aErrorLicense_0 ; "error: license.txt invalid\n"
.text:004011DC                 call    printf
.text:004011E1                 mov     [ebp+var_50], 0FFFFFFFFh
.text:004011E8                 jmp     short loc_401204
.text:004011EA ; ---------------------------------------------------------------------------
.text:004011EA
.text:004011EA loc_4011EA:                             ; CODE XREF: sub_401090+143j
.text:004011EA                 lea     eax, [ebp+license3_copy]
.text:004011ED                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax
.text:004011F1                 mov     eax, [ebp+hostname]
.text:004011F4                 add     eax, 4
.text:004011F7                 mov     eax, [eax]
.text:004011F9                 mov     [esp+78h+license2], eax
.text:004011FC                 call    genURL                                  //for generating URL only need license3,4,5
.text:00401201                 mov     [ebp+var_50], eax
.text:00401204
.text:00401204 loc_401204:                             ; CODE XREF: sub_401090+56j
.text:00401204                                         ; sub_401090+8Bj ...
.text:00401204                 mov     eax, [ebp+var_50]
.text:00401207                 leave
.text:00401208                 retn
.text:00401208 sub_401090      endp
```

### Understanding the file format

The routine checks a four-byte prefix, passes the next field to `crypt()`, and compares the result with `hqDTK7b8K2rvw`. It then uses three four-byte values to construct the URL.

The license layout is:

```text
gchq (4 bytes) + crypt() input (8 bytes) + license3 (4 bytes) + license4 (4 bytes) + license5 (4 bytes)
```

There is a byte-order detail here. IDA displays the four-byte comparison as `'qhcg'`, but x86 stores the corresponding value in little-endian order. The bytes in the file therefore spell `gchq`, as the final hex dump below confirms.

The two status messages indicate where to look for the remaining keys:

```text
"loading stage1 license key(s)...\n"
"loading stage2 license key(s)...\n\n"
```

Part 1 supplies one key; Part 2 supplies the other two.

### Recovering the three numeric keys

The first jump in Part 1 skips the bytes at offsets `0x2` through `0x5`: `AF C2 BF A3`. The disassembler displays them as instructions, but they are not executed along that path. They are the first key. Interpreted as a little-endian 32-bit value, those bytes become `0xA3BFC2AF`.

The other two keys are in the virtual CPU’s `firmware` array from Part 2. The interpreter does not use that array, which makes it easy to overlook:

```text
license3: 0xA3BFC2AF
  Source bytes in Part 1: AF C2 BF A3

license4: 0xD2AB1F05
license5: 0xDA13F110
  Source in Part 2: firmware: [0xd2ab1f05, 0xda13f110]
```

Keep the distinction between values and stored bytes in mind. The URL contains `a3bfc2af`, `d2ab1f05`, and `da13f110`; the license file stores each four-byte value in little-endian order.

### Finding the text field

The remaining field is the eight-character input to `crypt()`. I did not initially know what it was. While investigating the check, I also recorded a branch-patching experiment at `.text:0040119C`:

```text
Original branch-patching experiment at .text:0040119C:
  jnz -> jmp
  0x75 -> 0xEB
```

That experiment is separate from the final license-file solution. In the listing above, this branch skips the assignment that marks the license as valid, so changing the opcode alone should not be treated as a complete bypass recipe.

A search for the missing text turned up `cyberwin`. With that field and the three numeric keys, the complete license file is:

```text
67636871637962657277696EAFC2BFA3051FABD210F113DA
```

Write those hexadecimal values as binary bytes into `license.txt`, not as the literal text of the hex string. The file begins with `gchqcyberwin`, followed by the three little-endian keys.

### Retrieving the final answer

With `license.txt` in place, the executable generated the final request:

```bash
$ ./keygen.exe canyoucrackit.co.uk
keygen.exe
loading stage1 license key(s)...
loading stage2 license key(s)...
request:
GET /hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt HTTP/1.0
```

Opening the [resulting URL](http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt) returned:

```text
Pr0t3ct!on#cyber_security@12*12.2011+
```

That was the final answer. The [original completion screenshot](http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png) records the result.

The most useful clues were the details that appeared to serve no purpose: the bytes skipped by the first jump, data hidden in the PNG, and an unused firmware array. Following those clues connected all three stages of the puzzle.

## References

- *The Mac Hacker’s Handbook*
- [Original reference notes on Pastebin](http://pastebin.com/GAZ2aCLm)

---
layout: post
status: publish
published: true
title: Can you crack it solution
author: axot
author_login: axot
author_email: im.axot@gmail.com
author_url: http://www.axot.org
excerpt: ! "Britain's GCHQ has launched an online code test that aims to identify
  potential spies and codebreakers.\r\nThe solution was written in English/简体中文/日本語\r\n"
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
<p>Britain's GCHQ has launched an online code test that aims to identify potential spies and codebreakers.<br />
The solution was written in English/简体中文/日本語<br />
<a id="more"></a><a id="more-17"></a><br />
[tabs style="1"] </p>
<p>[tab title="English"]<br />
It's been a long time since I've update my blog last time.</p>
<p>Here is the problem: http://canyoucrackit.co.uk/<br />
<strong>Part 1:</strong><br />
<a href="http://www.axot.org/wp-content/uploads/2011/12/cyber.png"><br />
[frame align="center"]<img src="http://www.axot.org/wp-content/uploads/2011/12/cyber.png" alt="" title="cyberPart1" width="370" height="130" class="alignnone size-full wp-image-21" /> [/frame]</a><br />
It contains about 10x16=160 bytes of information, first I find out all the strings involved.<br />
[code lang="bash"]<br />
$ strings raw<br />
\X=AAAAuCX=BBBBu;Z<br />
[/code]<br />
It only includes AAAA and BBBB. I have no idea what it means.<br />
But I noticed that the first byte is 0xEB, 0xEB(JMP) is often used in cracking! So, does it meaning that this is a executable binary file?<br />
[code lang="asm"]<br />
$ gobjdump -D -b binary -mi386 raw</p>
<p>raw:     file format binary</p>
<p>Disassembly of section .data:</p>
<p>00000000 &lt;.data&gt;:<br />
   0:	eb 04                	jmp    0x6<br />
   2:	af                   	scas   %es:(%edi),%eax<br />
   3:	c2 bf a3             	ret    $0xa3bf<br />
   6:	81 ec 00 01 00 00    	sub    $0x100,%esp<br />
   c:	31 c9                	xor    %ecx,%ecx<br />
   e:	88 0c 0c             	mov    %cl,(%esp,%ecx,1)<br />
  11:	fe c1                	inc    %cl<br />
  13:	75 f9                	jne    0xe<br />
  15:	31 c0                	xor    %eax,%eax<br />
  17:	ba ef be ad de       	mov    $0xdeadbeef,%edx<br />
  1c:	02 04 0c             	add    (%esp,%ecx,1),%al<br />
  1f:	00 d0                	add    %dl,%al<br />
  21:	c1 ca 08             	ror    $0x8,%edx<br />
  24:	8a 1c 0c             	mov    (%esp,%ecx,1),%bl<br />
  27:	8a 3c 04             	mov    (%esp,%eax,1),%bh<br />
  2a:	88 1c 04             	mov    %bl,(%esp,%eax,1)<br />
  2d:	88 3c 0c             	mov    %bh,(%esp,%ecx,1)<br />
  30:	fe c1                	inc    %cl<br />
  32:	75 e8                	jne    0x1c<br />
  34:	e9 5c 00 00 00       	jmp    0x95<br />
  39:	89 e3                	mov    %esp,%ebx<br />
  3b:	81 c3 04 00 00 00    	add    $0x4,%ebx<br />
  41:	5c                   	pop    %esp<br />
  42:	58                   	pop    %eax<br />
  43:	3d 41 41 41 41       	cmp    $0x41414141,%eax<br />
  48:	75 43                	jne    0x8d<br />
  4a:	58                   	pop    %eax<br />
  4b:	3d 42 42 42 42       	cmp    $0x42424242,%eax<br />
  50:	75 3b                	jne    0x8d<br />
  52:	5a                   	pop    %edx<br />
  53:	89 d1                	mov    %edx,%ecx<br />
  55:	89 e6                	mov    %esp,%esi<br />
  57:	89 df                	mov    %ebx,%edi<br />
  59:	29 cf                	sub    %ecx,%edi<br />
  5b:	f3 a4                	rep movsb %ds:(%esi),%es:(%edi)<br />
  5d:	89 de                	mov    %ebx,%esi<br />
  5f:	89 d1                	mov    %edx,%ecx<br />
  61:	89 df                	mov    %ebx,%edi<br />
  63:	29 cf                	sub    %ecx,%edi<br />
  65:	31 c0                	xor    %eax,%eax<br />
  67:	31 db                	xor    %ebx,%ebx<br />
  69:	31 d2                	xor    %edx,%edx<br />
  6b:	fe c0                	inc    %al<br />
  6d:	02 1c 06             	add    (%esi,%eax,1),%bl<br />
  70:	8a 14 06             	mov    (%esi,%eax,1),%dl<br />
  73:	8a 34 1e             	mov    (%esi,%ebx,1),%dh<br />
  76:	88 34 06             	mov    %dh,(%esi,%eax,1)<br />
  79:	88 14 1e             	mov    %dl,(%esi,%ebx,1)<br />
  7c:	00 f2                	add    %dh,%dl<br />
  7e:	30 f6                	xor    %dh,%dh<br />
  80:	8a 1c 16             	mov    (%esi,%edx,1),%bl<br />
  83:	8a 17                	mov    (%edi),%dl<br />
  85:	30 da                	xor    %bl,%dl<br />
  87:	88 17                	mov    %dl,(%edi)<br />
  89:	47                   	inc    %edi<br />
  8a:	49                   	dec    %ecx<br />
  8b:	75 de                	jne    0x6b<br />
  8d:	31 db                	xor    %ebx,%ebx<br />
  8f:	89 d8                	mov    %ebx,%eax<br />
  91:	fe c0                	inc    %al<br />
  93:	cd 80                	int    $0x80<br />
  95:	90                   	nop<br />
  96:	90                   	nop<br />
  97:	e8 9d ff ff ff       	call   0x39<br />
  9c:	41                   	inc    %ecx<br />
  9d:	41                   	inc    %ecx<br />
  9e:	41                   	inc    %ecx<br />
  9f:	41                   	inc    %ecx<br />
[/code]<br />
It is strange that JMP appeared first.<br />
At line 0x97, when it calls 0x39, 0x9C will be pushed into stack, but at line 0x42 and 0x4A which pop eax twice are meaningless。<br />
At 0x43、it is comparing EAX with "AAAA", and EAX stored with "AAAA", so the result must be true.<br />
At the next line, it is comparing EAX with "BBBB", but EAX is uncertainty. So some things that were missed after line 0x9f.<br />
Download the picture, dump the hex code, we will see:<br />
[code lang="text"]<br />
$ hexdump -C cyber.png<br />
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|<br />
00000010  00 00 02 e4 00 00 01 04  08 02 00 00 00 ef 6a b6  |..............j.|<br />
00000020  2d 00 00 00 01 73 52 47  42 00 ae ce 1c e9 00 00  |-....sRGB.......|<br />
00000030  00 09 70 48 59 73 00 00  0b 13 00 00 0b 13 01 00  |..pHYs..........|<br />
00000040  9a 9c 18 00 00 00 07 74  49 4d 45 07 db 08 05 0e  |.......tIME.....|<br />
00000050  12 33 7e 39 c1 70 00 00  00 5d 69 54 58 74 43 6f  |.3~9.p...]iTXtCo|<br />
00000060  6d 6d 65 6e 74 00 00 00  00 00 51 6b 4a 43 51 6a  |mment.....QkJCQj|<br />
00000070  49 41 41 41 43 52 32 50  46 74 63 43 41 36 71 32  |IAAACR2PFtcCA6q2|<br />
00000080  65 61 43 38 53 52 2b 38  64 6d 44 2f 7a 4e 7a 4c  |eaC8SR+8dmD/zNzL|<br />
00000090  51 43 2b 74 64 33 74 46  51 34 71 78 38 4f 34 34  |QC+td3tFQ4qx8O44|<br />
000000a0  37 54 44 65 75 5a 77 35  50 2b 30 53 73 62 45 63  |7TDeuZw5P+0SsbEc|<br />
000000b0  59 52 0a 37 38 6a 4b 4c  77 3d 3d 32 ca be f1 00  |YR.78jKLw==2....|<br />
...<br />
[/code]<br />
In the header block,<br />
[code lang="text"]<br />
QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR.78jKLw==<br />
[/code]<br />
are stored, you can see "==" at the end of line. It may mean that this code is encoded with base64.</p>
<p>Decode:<br />
[code lang="text"]<br />
$ echo 'QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR78jKLw==' | base64 -D -o decoded.bin<br />
$ hexdump -C decoded.bin<br />
00000000  42 42 42 42 32 00 00 00  91 d8 f1 6d 70 20 3a ab  |BBBB2......mp :.|<br />
00000010  67 9a 0b c4 91 fb c7 66  0f fc cd cc b4 02 fa d7  |g......f........|<br />
00000020  77 b4 54 38 ab 1f 0e e3  8e d3 0d eb 99 c3 93 fe  |w.T8............|<br />
00000030  d1 2b 1b 11 c6 11 ef c8  ca 2f                    |.+......./|<br />
0000003a<br />
[/code]<br />
Woo! BBBB are appeared, combine 2 parts of binary codes, and view the execution results.<br />
[code lang="c"]<br />
#include &lt;stdio.h&gt;<br />
#include &lt;sys/types.h&gt;<br />
#include &lt;sys/mman.h&gt;</p>
<p>main(){</p>
<p>  int i;</p>
<p>  static unsigned char shellcode[] = {<br />
    0xEB,0x04,0xAF,0xC2,0xBF,0xA3,0x81,0xEC,<br />
    0x00,0x01,0x00,0x00,0x31,0xC9,0x88,0x0C,<br />
    0x0C,0xFE,0xC1,0x75,0xF9,0x31,0xC0,0xBA,<br />
    0xEF,0xBE,0xAD,0xDE,0x02,0x04,0x0C,0x00,<br />
    0xD0,0xC1,0xCA,0x08,0x8A,0x1C,0x0C,0x8A,<br />
    0x3C,0x04,0x88,0x1C,0x04,0x88,0x3C,0x0C,<br />
    0xFE,0xC1,0x75,0xE8,0xE9,0x5C,0x00,0x00,<br />
    0x00,0x89,0xE3,0x81,0xC3,0x04,0x00,0x00,<br />
    0x00,0x5C,0x58,0x3D,0x41,0x41,0x41,0x41,<br />
    0x75,0x43,0x58,0x3D,0x42,0x42,0x42,0x42,<br />
    0x75,0x3B,0x5A,0x89,0xD1,0x89,0xE6,0x89,<br />
    0xDF,0x29,0xCF,0xF3,0xA4,0x89,0xDE,0x89,<br />
    0xD1,0x89,0xDF,0x29,0xCF,0x31,0xC0,0x31,<br />
    0xDB,0x31,0xD2,0xFE,0xC0,0x02,0x1C,0x06,<br />
    0x8A,0x14,0x06,0x8A,0x34,0x1E,0x88,0x34,<br />
    0x06,0x88,0x14,0x1E,0x00,0xF2,0x30,0xF6,<br />
    0x8A,0x1C,0x16,0x8A,0x17,0x30,0xDA,0x88,<br />
    0x17,0x47,0x49,0x75,0xDE,0x31,0xDB,0x89,<br />
    0xD8,0xFE,0xC0,0xCD,0x80,0x90,0x90,0xE8,<br />
    0x9D,0xFF,0xFF,0xFF,0x41,0x41,0x41,0x41,<br />
    0x42,0x42,0x42,0x42,0x32,0x00,0x00,0x00,<br />
    0x91,0xD8,0xF1,0x6D,0x70,0x20,0x3A,0xAB,<br />
    0x67,0x9A,0x0B,0xC4,0x91,0xFB,0xC7,0x66,<br />
    0x0F,0xFC,0xCD,0xCC,0xB4,0x02,0xFA,0xD7,<br />
    0x77,0xB4,0x54,0x38,0xAB,0x1F,0x0E,0xE3,<br />
    0x8E,0xD3,0x0D,0xEB,0x99,0xC3,0x93,0xFE,<br />
    0xD1,0x2B,0x1B,0x11,0xC6,0x11,0xEF,0xC8,<br />
    0xCA,0x2F<br />
  };</p>
<p>  /*<br />
   * patch INT 0x80 to INT 3 to throw an exception signal to debugger<br />
   * 0xCD -&gt; 0xCC<br />
   */<br />
  printf(&quot;patching shellcode...\n&quot;);</p>
<p>  for(i = 0; i &lt; sizeof(shellcode); i++){<br />
    if(*(unsigned short*)&amp;shellcode[i] == 0x80CD){<br />
      shellcode[i] = 0xCC;<br />
      printf(&quot;patch done\n&quot;);<br />
      break;<br />
    }<br />
  }</p>
<p>  unsigned int page = ((unsigned int)shellcode)&amp;0xfffff000;</p>
<p>  if(-1 == mprotect((void*)page, 4096, PROT_READ | PROT_WRITE | PROT_EXEC))<br />
    perror(&quot;mprotect error&quot;);</p>
<p>  ((int(*)())shellcode)();</p>
<p>}<br />
[/code]<br />
The results are stored in EDI ~ EDI-0x32, at line 0x87.<br />
[code lang="bash"]<br />
$ gcc -arch i386 -g stage1.c -o stage1<br />
$ gdb stage1<br />
(gdb) r<br />
(gdb) x/s $edi-0x32<br />
0xbffff79a:	 &quot;GET /15b436de1f9107f3778aad525e5d0b20.js HTTP/1.1&quot;<br />
[/code]</p>
<p><strong>Part 2:</strong><br />
the result of part1 are: <a href="http://canyoucrackit.co.uk/15b436de1f9107f3778aad525e5d0b20.js" target="_blank">URL</a></p>
<p>[code lang="js"]<br />
//--------------------------------------------------------------------------------------------------<br />
//<br />
// stage 2 of 3<br />
//<br />
// challenge:<br />
//   reveal the solution within VM.mem<br />
//<br />
// disclaimer:<br />
//   tested in ie 9, firefox 6, chrome 14 and v8 shell (http://code.google.com/apis/v8/build.html),<br />
//   other javascript implementations may or may not work.<br />
//<br />
//--------------------------------------------------------------------------------------------------</p>
<p>var VM = {</p>
<p>  cpu: {<br />
    ip: 0x00,</p>
<p>    r0: 0x00,<br />
    r1: 0x00,<br />
    r2: 0x00,<br />
    r3: 0x00,</p>
<p>    cs: 0x00,<br />
    ds: 0x10,</p>
<p>    fl: 0x00,</p>
<p>    firmware: [0xd2ab1f05, 0xda13f110]<br />
  },</p>
<p>  mem: [<br />
    0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,<br />
    0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>    0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,<br />
    0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,<br />
    0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,<br />
    0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,<br />
    0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,<br />
    0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,<br />
    0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,<br />
    0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,<br />
    0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,<br />
    0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,<br />
    0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,<br />
    0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,<br />
    0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,<br />
    0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,<br />
    0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,<br />
    0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>    0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,<br />
    0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,<br />
    0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,<br />
    0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,<br />
    0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,<br />
    0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,<br />
    0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,<br />
    0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,<br />
    0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,<br />
    0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,<br />
    0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,<br />
    0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,<br />
    0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,<br />
    0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00<br />
  ],</p>
<p>  exec: function()<br />
  {<br />
    // virtual machine architecture<br />
    // ++++++++++++++++++++++++++++<br />
    //<br />
    // segmented memory model with 16-byte segment size (notation seg:offset)<br />
    //<br />
    // 4 general-purpose registers (r0-r3)<br />
    // 2 segment registers (cs, ds equiv. to r4, r5)<br />
    // 1 flags register (fl)<br />
    //<br />
    // instruction encoding<br />
    // ++++++++++++++++++++<br />
    //<br />
    //           byte 1               byte 2 (optional)<br />
    // bits      [ 7 6 5 4 3 2 1 0 ]  [ 7 6 5 4 3 2 1 0 ]<br />
    // opcode      - - -<br />
    // mod               -<br />
    // operand1            - - - -<br />
    // operand2                         - - - - - - - -<br />
    //<br />
    // operand1 is always a register index<br />
    // operand2 is optional, depending upon the instruction set specified below<br />
    // the value of mod alters the meaning of any operand2<br />
    //   0: operand2 = reg ix<br />
    //   1: operand2 = fixed immediate value or target segment (depending on instruction)<br />
    //<br />
    // instruction set<br />
    // +++++++++++++++<br />
    //<br />
    // Notes:<br />
    //   * r1, r2 =&gt; operand 1 is register 1, operand 2 is register 2<br />
    //   * movr r1, r2 =&gt; move contents of register r2 into register r1<br />
    //<br />
    // opcode | instruction | operands (mod 0) | operands (mod 1)<br />
    // -------+-------------+------------------+-----------------<br />
    // 0x00   | jmp         | r1               | r2:r1<br />
    // 0x01   | movr        | r1, r2           | rx,   imm<br />
    // 0x02   | movm        | r1, [ds:r2]      | [ds:r1], r2<br />
    // 0x03   | add         | r1, r2           | r1,   imm<br />
    // 0x04   | xor         | r1, r2           | r1,   imm<br />
    // 0x05   | cmp         | r1, r2           | r1,   imm<br />
    // 0x06   | jmpe        | r1               | r2:r1<br />
    // 0x07   | hlt         | N/A              | N/A<br />
    //<br />
    // flags<br />
    // +++++<br />
    //<br />
    // cmp r1, r2 instruction results in:<br />
    //   r1 == r2 =&gt; fl = 0<br />
    //   r1 &lt; r2  =&gt; fl = 0xff<br />
    //   r1 &gt; r2  =&gt; fl = 1<br />
    //<br />
    // jmpe r1<br />
    //   =&gt; if (fl == 0) jmp r1<br />
    //      else nop</p>
<p>    throw &quot;VM.exec not yet implemented&quot;;<br />
  }</p>
<p>};</p>
<p>//--------------------------------------------------------------------------------------------------</p>
<p>try<br />
{<br />
  VM.exec();<br />
}<br />
catch(e)<br />
{<br />
  alert('\nError: ' + e + '\n');<br />
}</p>
<p>//--------------------------------------------------------------------------------------------------<br />
[/code]</p>
<p>We need make a virtual CPU for executing these codes.</p>
<p>[code lang="c"]<br />
#include &lt;stdio.h&gt;</p>
<p>static unsigned char mem[] = {<br />
  0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,<br />
  0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>  0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,<br />
  0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,<br />
  0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,<br />
  0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,<br />
  0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,<br />
  0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,<br />
  0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,<br />
  0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,<br />
  0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,<br />
  0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,<br />
  0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,<br />
  0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,<br />
  0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,<br />
  0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,<br />
  0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,<br />
  0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>  0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,<br />
  0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,<br />
  0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,<br />
  0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,<br />
  0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,<br />
  0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,<br />
  0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,<br />
  0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,<br />
  0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,<br />
  0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,<br />
  0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,<br />
  0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,<br />
  0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,<br />
  0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00<br />
};</p>
<p>#define adr(seg, off) ((seg &lt;&lt; 4) + off)</p>
<p>typedef unsigned char   byte;<br />
typedef unsigned short  word;<br />
typedef unsigned int    dword;</p>
<p>typedef struct _CPU {<br />
  byte ip;<br />
  byte regs[6];<br />
  byte fl;<br />
} _CPU;</p>
<p>_CPU cpu;</p>
<p>enum _REGISTER {<br />
  r0,<br />
  r1,<br />
  r2,<br />
  r3,<br />
  cs,<br />
  ds<br />
};</p>
<p>typedef struct _INSTRUCTION {<br />
  byte opcode;<br />
  byte mod;<br />
  byte operand1;<br />
  byte operand2;<br />
  byte unknown[2];<br />
} _INSTRUCTION, *pInstruction;</p>
<p>_INSTRUCTION ins;</p>
<p>enum _OPCODE {<br />
  JMP,<br />
  MOVR,<br />
  MOVM,<br />
  ADD,<br />
  XOR,<br />
  CMP,<br />
  JMPE,<br />
  HLT<br />
};</p>
<p>void fetchDecode(pInstruction pIns){<br />
  word currentIP    = adr(cpu.regs[cs], cpu.ip);<br />
  pIns-&gt;opcode      = (mem[currentIP] &gt;&gt; 5) &amp; 0x07;<br />
  pIns-&gt;mod         = (mem[currentIP] &gt;&gt; 4) &amp; 0x01;<br />
  pIns-&gt;operand1    = mem[currentIP] &amp; 0x0F;<br />
  pIns-&gt;operand2    = mem[currentIP+1];</p>
<p>  pIns-&gt;unknown[0]  = mem[currentIP];<br />
  pIns-&gt;unknown[1]  = mem[currentIP+1];</p>
<p>  cpu.ip += 2;<br />
}</p>
<p>void exec(pInstruction pIns){</p>
<p>  printf(&quot;IP:%d\t&quot;, cpu.ip);</p>
<p>  switch(pIns-&gt;opcode) {</p>
<p>    case JMP:<br />
      if(!pIns-&gt;mod){<br />
        cpu.ip = cpu.regs[pIns-&gt;operand1];<br />
        printf(&quot;JMP  %d\n&quot;, pIns-&gt;operand1);<br />
      }<br />
      else{<br />
        cpu.regs[cs] = pIns-&gt;operand2;<br />
        cpu.ip = (cpu.regs[cs] &lt;&lt; 4) + cpu.regs[pIns-&gt;operand1];<br />
        printf(&quot;JMP  %d: %d\n&quot;, pIns-&gt;operand2, pIns-&gt;operand1);<br />
      }<br />
      break;</p>
<p>    case MOVR:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] = cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;MOVR %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] = pIns-&gt;operand2;<br />
        printf(&quot;MOVR %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case MOVM:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] = mem[adr(cpu.regs[ds], cpu.regs[pIns-&gt;operand2])];<br />
        printf(&quot;MOVM %d, [DS: %d]\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        mem[adr(cpu.regs[ds], cpu.regs[pIns-&gt;operand1])] = cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;MOVM [DS: %d], %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case ADD:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] += cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;ADD %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] += pIns-&gt;operand2;<br />
        printf(&quot;ADD %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case XOR:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] ^= cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;XOR %d, R%d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] ^= pIns-&gt;operand2;<br />
        printf(&quot;XOR %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case CMP:<br />
      if(!pIns-&gt;mod){<br />
        cpu.fl = cpu.regs[pIns-&gt;operand1] == cpu.regs[pIns-&gt;operand2]? 0x00: (cpu.regs[pIns-&gt;operand1] &lt; cpu.regs[pIns-&gt;operand2]? 0xff: 0x01);<br />
        printf(&quot;CMP  %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.fl = cpu.regs[pIns-&gt;operand1] == pIns-&gt;operand2? 0x00: (cpu.regs[pIns-&gt;operand1] &lt; pIns-&gt;operand2? 0xff: 0x01);<br />
        printf(&quot;CMP %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case JMPE:<br />
      if(!cpu.fl){<br />
        if(!pIns-&gt;mod){<br />
          cpu.ip = adr(cpu.regs[cs], cpu.regs[pIns-&gt;operand1]);<br />
          printf(&quot;JMPE %d\n&quot;, pIns-&gt;operand1);<br />
        }<br />
        else{<br />
          cpu.ip = adr(cpu.regs[cs], adr(cpu.regs[pIns-&gt;operand2], cpu.regs[pIns-&gt;operand1]));<br />
          printf(&quot;JMPE %d: %d\n&quot;, pIns-&gt;operand2, pIns-&gt;operand1);<br />
        }<br />
        break;<br />
      }<br />
      --cpu.ip;<br />
      printf(&quot;JMPE NOP\n&quot;);<br />
      break;</p>
<p>    case HLT:<br />
      pIns-&gt;opcode = HLT;<br />
      printf(&quot;HLT\n&quot;);<br />
      break;</p>
<p>    default:<br />
      pIns-&gt;opcode = HLT;<br />
      printf(&quot;UNKNOW %02Xh, %02Xh\n&quot;, pIns-&gt;unknown[0], pIns-&gt;unknown[1]);<br />
      break;<br />
  };<br />
}</p>
<p>main(){</p>
<p>  cpu.ip = 0x00;</p>
<p>  cpu.regs[r0] = 0x00;<br />
  cpu.regs[r1] = 0x00;<br />
  cpu.regs[r2] = 0x00;<br />
  cpu.regs[r3] = 0x00;<br />
  cpu.regs[cs] = 0x00;<br />
  cpu.regs[ds] = 0x10;</p>
<p>  cpu.fl = 0x00;</p>
<p>  int i = 0;<br />
  while ( ++i &lt; (2&lt;&lt;16) &amp;&amp; ins.opcode != HLT) {<br />
    fetchDecode(&amp;ins);<br />
    exec(&amp;ins);<br />
  }</p>
<p>  FILE *fp = fopen(&quot;mem.dump&quot;, &quot;w&quot;);<br />
  dword dataStart = adr(cpu.regs[ds], 0);<br />
  fwrite((void*)(mem+dataStart), sizeof(mem)-dataStart, 1, fp);<br />
  fclose(fp);</p>
<p>}<br />
[/code]</p>
<p>Execute it:<br />
[code lang="text"]<br />
$ gcc -arch i386 -g stage2_vm.c -o stage2_vm<br />
$ ./stage2_vm<br />
...<br />
IP:22	JMPE NOP<br />
IP:23	CMP 0, 00<br />
IP:25	MOVR 0, 1B<br />
IP:27	JMPE 0<br />
IP:29	HLT</p>
<p>$ strings mem.dump<br />
GET /da75370fe15c4148bd4ceec861fbdaa5.exe HTTP/1.0<br />
h%2w<br />
b#[GUS0<br />
k6oofU0<br />
t\?)+f=<br />
EFg }D<br />
kEmT<br />
`bUZJfa<br />
xvar&gt;7#Vsqyc|<br />
Z//NN<br />
[/code]<br />
/da75370fe15c4148bd4ceec861fbdaa5.exe is the answer of part 2.</p>
<p><strong>Part 3:</strong><br />
The result of part2 are <a href="http://canyoucrackit.co.uk/da75370fe15c4148bd4ceec861fbdaa5.exe" target="_blank">URL</a>, it need cygwin environment for executing, so you need get Windows or wine.<br />
Have a look at which strings it contains.<br />
[code lang="text"]<br />
$ strings da75370fe15c4148bd4ceec861fbdaa5.exe<br />
...<br />
hqDTK7b8K2rvw<br />
keygen.exe<br />
usage: keygen.exe hostname<br />
license.txt<br />
error: license.txt not found<br />
loading stage1 license key(s)...<br />
loading stage2 license key(s)...<br />
error: license.txt invalid<br />
error: gethostbyname() failed<br />
error: connect(&quot;%s&quot;) failed<br />
GET /%s/%x/%x/%x/key.txt HTTP/1.0<br />
...<br />
[/code]<br />
Many useful staffs are shown;<br />
First, rename da75370fe15c4148bd4ceec861fbdaa5.exe to keygen.exe.</p>
<p>usage:<br />
[code lang="bash"]<br />
keygen.exe canyoucrackit.co.uk<br />
[/code]<br />
And, license.txt is necessary.</p>
<p>This is a part of disassembling codes, pick up from IDA Pro 6.1.110530 Evaluation version<br />
[code lang="masm"]<br />
.text:00401120 loc_401120:                             ; CODE XREF: sub_401090+76j<br />
.text:00401120                 mov     [esp+78h+var_70], 18h<br />
.text:00401128                 mov     [esp+78h+hqDTK7b8K2rvw_copy], 0<br />
.text:00401130                 lea     eax, [ebp+license1]<br />
.text:00401133                 mov     [esp+78h+license2], eax<br />
.text:00401136                 call    memset<br />
.text:0040113B                 lea     eax, [ebp+license1]<br />
.text:0040113E                 mov     [esp+78h+var_70], eax<br />
.text:00401142                 mov     [esp+78h+hqDTK7b8K2rvw_copy], offset aS ; &quot;%s&quot;<br />
.text:0040114A                 mov     eax, [ebp+var_4C]<br />
.text:0040114D                 mov     [esp+78h+license2], eax<br />
.text:00401150                 call    fscanf<br />
.text:00401155                 mov     eax, [ebp+var_4C]<br />
.text:00401158                 mov     [esp+78h+license2], eax<br />
.text:0040115B                 call    fclose<br />
.text:00401160                 mov     [ebp+var_4C], 0<br />
.text:00401167                 cmp     [ebp+license1], 'qhcg'               // head 4 chars of license are qhcg<br />
.text:0040116E                 jnz     short loc_4011CF<br />
.text:00401170                 mov     eax, hqDTK7b8K2rvw<br />
.text:00401175                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:00401179                 lea     eax, [ebp+license1]<br />
.text:0040117C                 add     eax, 4<br />
.text:0040117F                 mov     [esp+78h+license2], eax<br />
                                                                            // char *crypt(const char *key, const char *salt);<br />
                                                                            // key are 8 chars、salt are 2 chars<br />
.text:00401182                 call    crypt                                // crypt(&quot;license&quot;, &quot;hq&quot;);<br />
.text:00401187                 mov     edx, eax<br />
.text:00401189                 mov     eax, hqDTK7b8K2rvw<br />
.text:0040118E                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:00401192                 mov     [esp+78h+license2], edx<br />
.text:00401195                 call    strcmp<br />
.text:0040119A                 test    eax, eax<br />
.text:0040119C                 jnz     short loc_4011A5<br />
.text:0040119E                 mov     [ebp+var_C], 1<br />
.text:004011A5<br />
.text:004011A5 loc_4011A5:                             ; CODE XREF: sub_401090+10Cj<br />
.text:004011A5                 mov     [esp+78h+license2], offset aLoadingStage1L ; &quot;loading stage1 license key(s)...\n&quot;<br />
.text:004011AC                 call    printf<br />
.text:004011B1                 mov     eax, [ebp+license3]<br />
.text:004011B4                 mov     [ebp+license3_copy], eax<br />
.text:004011B7                 mov     [esp+78h+license2], offset aLoadingStage2L ; &quot;loading stage2 license key(s)...\n\n&quot;<br />
.text:004011BE                 call    printf<br />
.text:004011C3                 mov     eax, [ebp+license4]<br />
.text:004011C6                 mov     [ebp+license4_copy], eax<br />
.text:004011C9                 mov     eax, [ebp+license5]<br />
.text:004011CC                 mov     [ebp+license5_copy], eax<br />
.text:004011CF<br />
.text:004011CF loc_4011CF:                             ; CODE XREF: sub_401090+DEj<br />
.text:004011CF                 cmp     [ebp+var_C], 0<br />
.text:004011D3                 jnz     short loc_4011EA<br />
.text:004011D5                 mov     [esp+78h+license2], offset aErrorLicense_0 ; &quot;error: license.txt invalid\n&quot;<br />
.text:004011DC                 call    printf<br />
.text:004011E1                 mov     [ebp+var_50], 0FFFFFFFFh<br />
.text:004011E8                 jmp     short loc_401204<br />
.text:004011EA ; ---------------------------------------------------------------------------<br />
.text:004011EA<br />
.text:004011EA loc_4011EA:                             ; CODE XREF: sub_401090+143j<br />
.text:004011EA                 lea     eax, [ebp+license3_copy]<br />
.text:004011ED                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:004011F1                 mov     eax, [ebp+hostname]<br />
.text:004011F4                 add     eax, 4<br />
.text:004011F7                 mov     eax, [eax]<br />
.text:004011F9                 mov     [esp+78h+license2], eax<br />
.text:004011FC                 call    genURL                                  //for generating URL only need license3,4,5<br />
.text:00401201                 mov     [ebp+var_50], eax<br />
.text:00401204<br />
.text:00401204 loc_401204:                             ; CODE XREF: sub_401090+56j<br />
.text:00401204                                         ; sub_401090+8Bj ...<br />
.text:00401204                 mov     eax, [ebp+var_50]<br />
.text:00401207                 leave<br />
.text:00401208                 retn<br />
.text:00401208 sub_401090      endp<br />
[/code]<br />
This is the structure of license.txt<br />
[code lang="text"]<br />
qhcg + 8 chars of crypt + license3(4bytes) + license4(4bytes) + license5(4bytes)<br />
[/code]<br />
Where can we found license3 ~ license5?<br />
This is the hint:<br />
[code lang="text"]<br />
&quot;loading stage1 license key(s)...\n&quot;<br />
&quot;loading stage2 license key(s)...\n\n&quot;<br />
[/code]<br />
It tell us, in part1 has 1 key, and in part2 have two keys.<br />
[code lang="text"]<br />
license3:<br />
In part1, the first op is JMP:<br />
   0:	eb 04                	jmp    0x6<br />
   2:	af                   	scas   %es:(%edi),%eax<br />
   3:	c2 bf a3             	ret    $0xa3bf<br />
So 0x2 0x3 should never be used, it is the answer.<br />
notice: x86 is using Little endian, afc2bfa3 need be written in a3bfc2af.</p>
<p>license4,5:<br />
The firmware in cpu structure of part 2 are never used.<br />
firmware: [0xd2ab1f05, 0xda13f110]<br />
It is the answer.<br />
[/code]<br />
But I dont know where is the hidden license2 in.<br />
[code lang="text"]<br />
Change jnz in .text:0040119C to<br />
jmp can easily solve this problem.<br />
0x75 -&gt; 0xEB<br />
[/code]<br />
I googled license2, cyberwin is the answer.</p>
<p>Finally, the license.txt is<br />
[code lang="text"]<br />
67636871637962657277696EAFC2BFA3051FABD210F113DA<br />
[/code]<br />
save it with HEX.</p>
<p>[code lang="bash"]<br />
$ ./keygen.exe canyoucrackit.co.uk</p>
<p>keygen.exe</p>
<p>loading stage1 license key(s)...<br />
loading stage2 license key(s)...</p>
<p>request:</p>
<p>GET /hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt HTTP/1.0<br />
[/code]<br />
<a href="http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt" target="_blank">http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt</a>を開くと、<br />
[code lang="text"]<br />
Pr0t3ct!on#cyber_security@12*12.2011+<br />
[/code]<br />
This is the final answer.<br />
<a href="http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png"><br />
[frame align="center"]<img src="http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png" alt="" title="cracked" width="525" height="345" class="alignnone size-full wp-image-24" />[/frame]</a><br />
Crackded it!</p>
<p><strong>Reference:</strong><br />
The Mac Hacker's Handbook<br />
http://pastebin.com/GAZ2aCLm<br />
[/tab] </p>
<p>[tab title="简体中文"]<br />
这是我写的关于Can you crack it的解法.<br />
问题出处: http://canyoucrackit.co.uk/<br />
<strong>第1部分:</strong><br />
<a href="http://www.axot.org/wp-content/uploads/2011/12/cyber.png"><br />
[frame align="center"]<img src="http://www.axot.org/wp-content/uploads/2011/12/cyber.png" alt="" title="cyberPart1" width="370" height="130" class="alignnone size-full wp-image-21" /> [/frame]</a><br />
从图片中可以看到共有10x16=160字节的信息、因为是16进制编码的, 乍看之下也没有什么头绪, 首先先来查看下里面含有哪些ASCII文字.<br />
[code lang="bash"]<br />
$ strings raw<br />
\X=AAAAuCX=BBBBu;Z<br />
[/code]<br />
只有AAAA, BBBB. 看不出什么特别的意思.<br />
回到16进制, 可以看到第一个字节是0xEB、0xEB(JMP)这个无条件跳转经常在破解中用到. 难道说这个是2进制可执行文件?<br />
[code lang="asm"]<br />
$ gobjdump -D -b binary -mi386 raw</p>
<p>raw:     file format binary</p>
<p>Disassembly of section .data:</p>
<p>00000000 &lt;.data&gt;:<br />
   0:	eb 04                	jmp    0x6<br />
   2:	af                   	scas   %es:(%edi),%eax<br />
   3:	c2 bf a3             	ret    $0xa3bf<br />
   6:	81 ec 00 01 00 00    	sub    $0x100,%esp<br />
   c:	31 c9                	xor    %ecx,%ecx<br />
   e:	88 0c 0c             	mov    %cl,(%esp,%ecx,1)<br />
  11:	fe c1                	inc    %cl<br />
  13:	75 f9                	jne    0xe<br />
  15:	31 c0                	xor    %eax,%eax<br />
  17:	ba ef be ad de       	mov    $0xdeadbeef,%edx<br />
  1c:	02 04 0c             	add    (%esp,%ecx,1),%al<br />
  1f:	00 d0                	add    %dl,%al<br />
  21:	c1 ca 08             	ror    $0x8,%edx<br />
  24:	8a 1c 0c             	mov    (%esp,%ecx,1),%bl<br />
  27:	8a 3c 04             	mov    (%esp,%eax,1),%bh<br />
  2a:	88 1c 04             	mov    %bl,(%esp,%eax,1)<br />
  2d:	88 3c 0c             	mov    %bh,(%esp,%ecx,1)<br />
  30:	fe c1                	inc    %cl<br />
  32:	75 e8                	jne    0x1c<br />
  34:	e9 5c 00 00 00       	jmp    0x95<br />
  39:	89 e3                	mov    %esp,%ebx<br />
  3b:	81 c3 04 00 00 00    	add    $0x4,%ebx<br />
  41:	5c                   	pop    %esp<br />
  42:	58                   	pop    %eax<br />
  43:	3d 41 41 41 41       	cmp    $0x41414141,%eax<br />
  48:	75 43                	jne    0x8d<br />
  4a:	58                   	pop    %eax<br />
  4b:	3d 42 42 42 42       	cmp    $0x42424242,%eax<br />
  50:	75 3b                	jne    0x8d<br />
  52:	5a                   	pop    %edx<br />
  53:	89 d1                	mov    %edx,%ecx<br />
  55:	89 e6                	mov    %esp,%esi<br />
  57:	89 df                	mov    %ebx,%edi<br />
  59:	29 cf                	sub    %ecx,%edi<br />
  5b:	f3 a4                	rep movsb %ds:(%esi),%es:(%edi)<br />
  5d:	89 de                	mov    %ebx,%esi<br />
  5f:	89 d1                	mov    %edx,%ecx<br />
  61:	89 df                	mov    %ebx,%edi<br />
  63:	29 cf                	sub    %ecx,%edi<br />
  65:	31 c0                	xor    %eax,%eax<br />
  67:	31 db                	xor    %ebx,%ebx<br />
  69:	31 d2                	xor    %edx,%edx<br />
  6b:	fe c0                	inc    %al<br />
  6d:	02 1c 06             	add    (%esi,%eax,1),%bl<br />
  70:	8a 14 06             	mov    (%esi,%eax,1),%dl<br />
  73:	8a 34 1e             	mov    (%esi,%ebx,1),%dh<br />
  76:	88 34 06             	mov    %dh,(%esi,%eax,1)<br />
  79:	88 14 1e             	mov    %dl,(%esi,%ebx,1)<br />
  7c:	00 f2                	add    %dh,%dl<br />
  7e:	30 f6                	xor    %dh,%dh<br />
  80:	8a 1c 16             	mov    (%esi,%edx,1),%bl<br />
  83:	8a 17                	mov    (%edi),%dl<br />
  85:	30 da                	xor    %bl,%dl<br />
  87:	88 17                	mov    %dl,(%edi)<br />
  89:	47                   	inc    %edi<br />
  8a:	49                   	dec    %ecx<br />
  8b:	75 de                	jne    0x6b<br />
  8d:	31 db                	xor    %ebx,%ebx<br />
  8f:	89 d8                	mov    %ebx,%eax<br />
  91:	fe c0                	inc    %al<br />
  93:	cd 80                	int    $0x80<br />
  95:	90                   	nop<br />
  96:	90                   	nop<br />
  97:	e8 9d ff ff ff       	call   0x39<br />
  9c:	41                   	inc    %ecx<br />
  9d:	41                   	inc    %ecx<br />
  9e:	41                   	inc    %ecx<br />
  9f:	41                   	inc    %ecx<br />
[/code]<br />
第一行出现JMP让人感到莫名其妙. 但是从整个代码来看, 基本上能确定是正常的可执行文件片段.<br />
有几个地方在执行的时候会出现问题:<br />
0x97行在调用了0x39的同时把0x9C压入栈中、但是在0x42、0x4A两行都是pop指令的话, 第2次的pop会是没有意义的.<br />
0x9c~0x9f行的内容是0x41414141、也就是ASCIIのAAAA. 在先前的文字搜索的时候还出现了BBBB.<br />
0x43行、比较了EAX和AAAA的值、因为EAX储存的是0x9c~0x9f行のAAAA、其結果必然是真。<br />
但是在下一行, 于BBBB进行比较的时候、EAX的值是不确定的。从这边可以看出0x9f行的后面可能遗漏了部分代码.<br />
把问题的照片下载下来, 看下照片的16进制代码:<br />
[code lang="text"]<br />
$ hexdump -C cyber.png<br />
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|<br />
00000010  00 00 02 e4 00 00 01 04  08 02 00 00 00 ef 6a b6  |..............j.|<br />
00000020  2d 00 00 00 01 73 52 47  42 00 ae ce 1c e9 00 00  |-....sRGB.......|<br />
00000030  00 09 70 48 59 73 00 00  0b 13 00 00 0b 13 01 00  |..pHYs..........|<br />
00000040  9a 9c 18 00 00 00 07 74  49 4d 45 07 db 08 05 0e  |.......tIME.....|<br />
00000050  12 33 7e 39 c1 70 00 00  00 5d 69 54 58 74 43 6f  |.3~9.p...]iTXtCo|<br />
00000060  6d 6d 65 6e 74 00 00 00  00 00 51 6b 4a 43 51 6a  |mment.....QkJCQj|<br />
00000070  49 41 41 41 43 52 32 50  46 74 63 43 41 36 71 32  |IAAACR2PFtcCA6q2|<br />
00000080  65 61 43 38 53 52 2b 38  64 6d 44 2f 7a 4e 7a 4c  |eaC8SR+8dmD/zNzL|<br />
00000090  51 43 2b 74 64 33 74 46  51 34 71 78 38 4f 34 34  |QC+td3tFQ4qx8O44|<br />
000000a0  37 54 44 65 75 5a 77 35  50 2b 30 53 73 62 45 63  |7TDeuZw5P+0SsbEc|<br />
000000b0  59 52 0a 37 38 6a 4b 4c  77 3d 3d 32 ca be f1 00  |YR.78jKLw==2....|<br />
...<br />
[/code]<br />
在文件的头部<br />
[code lang="text"]<br />
QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR.78jKLw==<br />
[/code]<br />
是这样写的. 文字的最后是"==", 这就提醒了我, 这段代码应该是通过Base64进行编码的.<br />
BASE64中对"."是没有定义的、这边"."实际上是换行符0x0A、应该被省略。</p>
<p>解码:<br />
[code lang="text"]<br />
$ echo 'QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR78jKLw==' | base64 -D -o decoded.bin<br />
$ hexdump -C decoded.bin<br />
00000000  42 42 42 42 32 00 00 00  91 d8 f1 6d 70 20 3a ab  |BBBB2......mp :.|<br />
00000010  67 9a 0b c4 91 fb c7 66  0f fc cd cc b4 02 fa d7  |g......f........|<br />
00000020  77 b4 54 38 ab 1f 0e e3  8e d3 0d eb 99 c3 93 fe  |w.T8............|<br />
00000030  d1 2b 1b 11 c6 11 ef c8  ca 2f                    |.+......./|<br />
0000003a<br />
[/code]<br />
BBBB出现了, 把这段代码和先前代码合并后, 执行看下.<br />
[code lang="c"]<br />
#include &lt;stdio.h&gt;<br />
#include &lt;sys/types.h&gt;<br />
#include &lt;sys/mman.h&gt;</p>
<p>main(){</p>
<p>  int i;</p>
<p>  static unsigned char shellcode[] = {<br />
    0xEB,0x04,0xAF,0xC2,0xBF,0xA3,0x81,0xEC,<br />
    0x00,0x01,0x00,0x00,0x31,0xC9,0x88,0x0C,<br />
    0x0C,0xFE,0xC1,0x75,0xF9,0x31,0xC0,0xBA,<br />
    0xEF,0xBE,0xAD,0xDE,0x02,0x04,0x0C,0x00,<br />
    0xD0,0xC1,0xCA,0x08,0x8A,0x1C,0x0C,0x8A,<br />
    0x3C,0x04,0x88,0x1C,0x04,0x88,0x3C,0x0C,<br />
    0xFE,0xC1,0x75,0xE8,0xE9,0x5C,0x00,0x00,<br />
    0x00,0x89,0xE3,0x81,0xC3,0x04,0x00,0x00,<br />
    0x00,0x5C,0x58,0x3D,0x41,0x41,0x41,0x41,<br />
    0x75,0x43,0x58,0x3D,0x42,0x42,0x42,0x42,<br />
    0x75,0x3B,0x5A,0x89,0xD1,0x89,0xE6,0x89,<br />
    0xDF,0x29,0xCF,0xF3,0xA4,0x89,0xDE,0x89,<br />
    0xD1,0x89,0xDF,0x29,0xCF,0x31,0xC0,0x31,<br />
    0xDB,0x31,0xD2,0xFE,0xC0,0x02,0x1C,0x06,<br />
    0x8A,0x14,0x06,0x8A,0x34,0x1E,0x88,0x34,<br />
    0x06,0x88,0x14,0x1E,0x00,0xF2,0x30,0xF6,<br />
    0x8A,0x1C,0x16,0x8A,0x17,0x30,0xDA,0x88,<br />
    0x17,0x47,0x49,0x75,0xDE,0x31,0xDB,0x89,<br />
    0xD8,0xFE,0xC0,0xCD,0x80,0x90,0x90,0xE8,<br />
    0x9D,0xFF,0xFF,0xFF,0x41,0x41,0x41,0x41,<br />
    0x42,0x42,0x42,0x42,0x32,0x00,0x00,0x00,<br />
    0x91,0xD8,0xF1,0x6D,0x70,0x20,0x3A,0xAB,<br />
    0x67,0x9A,0x0B,0xC4,0x91,0xFB,0xC7,0x66,<br />
    0x0F,0xFC,0xCD,0xCC,0xB4,0x02,0xFA,0xD7,<br />
    0x77,0xB4,0x54,0x38,0xAB,0x1F,0x0E,0xE3,<br />
    0x8E,0xD3,0x0D,0xEB,0x99,0xC3,0x93,0xFE,<br />
    0xD1,0x2B,0x1B,0x11,0xC6,0x11,0xEF,0xC8,<br />
    0xCA,0x2F<br />
  };</p>
<p>  /*<br />
   * patch INT 0x80 to INT 3 to throw an exception signal to debugger<br />
   * 0xCD -&gt; 0xCC<br />
   */<br />
  printf(&quot;patching shellcode...\n&quot;);</p>
<p>  for(i = 0; i &lt; sizeof(shellcode); i++){<br />
    if(*(unsigned short*)&amp;shellcode[i] == 0x80CD){<br />
      shellcode[i] = 0xCC;<br />
      printf(&quot;patch done\n&quot;);<br />
      break;<br />
    }<br />
  }</p>
<p>  unsigned int page = ((unsigned int)shellcode)&amp;0xfffff000;</p>
<p>  if(-1 == mprotect((void*)page, 4096, PROT_READ | PROT_WRITE | PROT_EXEC))<br />
    perror(&quot;mprotect error&quot;);</p>
<p>  ((int(*)())shellcode)();</p>
<p>}<br />
[/code]<br />
代码的执行结果在0x87行中的, EDI到EDI-0x32(解码后得到的BBBB后面的那个字节).<br />
[code lang="bash"]<br />
$ gcc -arch i386 -g stage1.c -o stage1<br />
$ gdb stage1<br />
(gdb) r<br />
(gdb) x/s $edi-0x32<br />
0xbffff79a:	 &quot;GET /15b436de1f9107f3778aad525e5d0b20.js HTTP/1.1&quot;<br />
[/code]</p>
<p><strong>第2部分:</strong><br />
第1部分中得到的结果<a href="http://canyoucrackit.co.uk/15b436de1f9107f3778aad525e5d0b20.js" target="_blank">URL</a></p>
<p>[code lang="js"]<br />
//--------------------------------------------------------------------------------------------------<br />
//<br />
// stage 2 of 3<br />
//<br />
// challenge:<br />
//   reveal the solution within VM.mem<br />
//<br />
// disclaimer:<br />
//   tested in ie 9, firefox 6, chrome 14 and v8 shell (http://code.google.com/apis/v8/build.html),<br />
//   other javascript implementations may or may not work.<br />
//<br />
//--------------------------------------------------------------------------------------------------</p>
<p>var VM = {</p>
<p>  cpu: {<br />
    ip: 0x00,</p>
<p>    r0: 0x00,<br />
    r1: 0x00,<br />
    r2: 0x00,<br />
    r3: 0x00,</p>
<p>    cs: 0x00,<br />
    ds: 0x10,</p>
<p>    fl: 0x00,</p>
<p>    firmware: [0xd2ab1f05, 0xda13f110]<br />
  },</p>
<p>  mem: [<br />
    0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,<br />
    0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>    0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,<br />
    0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,<br />
    0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,<br />
    0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,<br />
    0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,<br />
    0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,<br />
    0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,<br />
    0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,<br />
    0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,<br />
    0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,<br />
    0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,<br />
    0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,<br />
    0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,<br />
    0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,<br />
    0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,<br />
    0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>    0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,<br />
    0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,<br />
    0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,<br />
    0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,<br />
    0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,<br />
    0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,<br />
    0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,<br />
    0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,<br />
    0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,<br />
    0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,<br />
    0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,<br />
    0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,<br />
    0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,<br />
    0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00<br />
  ],</p>
<p>  exec: function()<br />
  {<br />
    // virtual machine architecture<br />
    // ++++++++++++++++++++++++++++<br />
    //<br />
    // segmented memory model with 16-byte segment size (notation seg:offset)<br />
    //<br />
    // 4 general-purpose registers (r0-r3)<br />
    // 2 segment registers (cs, ds equiv. to r4, r5)<br />
    // 1 flags register (fl)<br />
    //<br />
    // instruction encoding<br />
    // ++++++++++++++++++++<br />
    //<br />
    //           byte 1               byte 2 (optional)<br />
    // bits      [ 7 6 5 4 3 2 1 0 ]  [ 7 6 5 4 3 2 1 0 ]<br />
    // opcode      - - -<br />
    // mod               -<br />
    // operand1            - - - -<br />
    // operand2                         - - - - - - - -<br />
    //<br />
    // operand1 is always a register index<br />
    // operand2 is optional, depending upon the instruction set specified below<br />
    // the value of mod alters the meaning of any operand2<br />
    //   0: operand2 = reg ix<br />
    //   1: operand2 = fixed immediate value or target segment (depending on instruction)<br />
    //<br />
    // instruction set<br />
    // +++++++++++++++<br />
    //<br />
    // Notes:<br />
    //   * r1, r2 =&gt; operand 1 is register 1, operand 2 is register 2<br />
    //   * movr r1, r2 =&gt; move contents of register r2 into register r1<br />
    //<br />
    // opcode | instruction | operands (mod 0) | operands (mod 1)<br />
    // -------+-------------+------------------+-----------------<br />
    // 0x00   | jmp         | r1               | r2:r1<br />
    // 0x01   | movr        | r1, r2           | rx,   imm<br />
    // 0x02   | movm        | r1, [ds:r2]      | [ds:r1], r2<br />
    // 0x03   | add         | r1, r2           | r1,   imm<br />
    // 0x04   | xor         | r1, r2           | r1,   imm<br />
    // 0x05   | cmp         | r1, r2           | r1,   imm<br />
    // 0x06   | jmpe        | r1               | r2:r1<br />
    // 0x07   | hlt         | N/A              | N/A<br />
    //<br />
    // flags<br />
    // +++++<br />
    //<br />
    // cmp r1, r2 instruction results in:<br />
    //   r1 == r2 =&gt; fl = 0<br />
    //   r1 &lt; r2  =&gt; fl = 0xff<br />
    //   r1 &gt; r2  =&gt; fl = 1<br />
    //<br />
    // jmpe r1<br />
    //   =&gt; if (fl == 0) jmp r1<br />
    //      else nop</p>
<p>    throw &quot;VM.exec not yet implemented&quot;;<br />
  }</p>
<p>};</p>
<p>//--------------------------------------------------------------------------------------------------</p>
<p>try<br />
{<br />
  VM.exec();<br />
}<br />
catch(e)<br />
{<br />
  alert('\nError: ' + e + '\n');<br />
}</p>
<p>//--------------------------------------------------------------------------------------------------<br />
[/code]<br />
问题已经写的很清楚了, 设计一个虚拟CPU, 执行2进制代码后的的结果便是答案。</p>
<p>[code lang="c"]<br />
#include &lt;stdio.h&gt;</p>
<p>static unsigned char mem[] = {<br />
  0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,<br />
  0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>  0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,<br />
  0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,<br />
  0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,<br />
  0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,<br />
  0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,<br />
  0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,<br />
  0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,<br />
  0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,<br />
  0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,<br />
  0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,<br />
  0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,<br />
  0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,<br />
  0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,<br />
  0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,<br />
  0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,<br />
  0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>  0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,<br />
  0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,<br />
  0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,<br />
  0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,<br />
  0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,<br />
  0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,<br />
  0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,<br />
  0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,<br />
  0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,<br />
  0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,<br />
  0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,<br />
  0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,<br />
  0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,<br />
  0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00<br />
};</p>
<p>#define adr(seg, off) ((seg &lt;&lt; 4) + off)</p>
<p>typedef unsigned char   byte;<br />
typedef unsigned short  word;<br />
typedef unsigned int    dword;</p>
<p>typedef struct _CPU {<br />
  byte ip;<br />
  byte regs[6];<br />
  byte fl;<br />
} _CPU;</p>
<p>_CPU cpu;</p>
<p>enum _REGISTER {<br />
  r0,<br />
  r1,<br />
  r2,<br />
  r3,<br />
  cs,<br />
  ds<br />
};</p>
<p>typedef struct _INSTRUCTION {<br />
  byte opcode;<br />
  byte mod;<br />
  byte operand1;<br />
  byte operand2;<br />
  byte unknown[2];<br />
} _INSTRUCTION, *pInstruction;</p>
<p>_INSTRUCTION ins;</p>
<p>enum _OPCODE {<br />
  JMP,<br />
  MOVR,<br />
  MOVM,<br />
  ADD,<br />
  XOR,<br />
  CMP,<br />
  JMPE,<br />
  HLT<br />
};</p>
<p>void fetchDecode(pInstruction pIns){<br />
  word currentIP    = adr(cpu.regs[cs], cpu.ip);<br />
  pIns-&gt;opcode      = (mem[currentIP] &gt;&gt; 5) &amp; 0x07;<br />
  pIns-&gt;mod         = (mem[currentIP] &gt;&gt; 4) &amp; 0x01;<br />
  pIns-&gt;operand1    = mem[currentIP] &amp; 0x0F;<br />
  pIns-&gt;operand2    = mem[currentIP+1];</p>
<p>  pIns-&gt;unknown[0]  = mem[currentIP];<br />
  pIns-&gt;unknown[1]  = mem[currentIP+1];</p>
<p>  cpu.ip += 2;<br />
}</p>
<p>void exec(pInstruction pIns){</p>
<p>  printf(&quot;IP:%d\t&quot;, cpu.ip);</p>
<p>  switch(pIns-&gt;opcode) {</p>
<p>    case JMP:<br />
      if(!pIns-&gt;mod){<br />
        cpu.ip = cpu.regs[pIns-&gt;operand1];<br />
        printf(&quot;JMP  %d\n&quot;, pIns-&gt;operand1);<br />
      }<br />
      else{<br />
        cpu.regs[cs] = pIns-&gt;operand2;<br />
        cpu.ip = (cpu.regs[cs] &lt;&lt; 4) + cpu.regs[pIns-&gt;operand1];<br />
        printf(&quot;JMP  %d: %d\n&quot;, pIns-&gt;operand2, pIns-&gt;operand1);<br />
      }<br />
      break;</p>
<p>    case MOVR:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] = cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;MOVR %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] = pIns-&gt;operand2;<br />
        printf(&quot;MOVR %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case MOVM:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] = mem[adr(cpu.regs[ds], cpu.regs[pIns-&gt;operand2])];<br />
        printf(&quot;MOVM %d, [DS: %d]\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        mem[adr(cpu.regs[ds], cpu.regs[pIns-&gt;operand1])] = cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;MOVM [DS: %d], %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case ADD:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] += cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;ADD %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] += pIns-&gt;operand2;<br />
        printf(&quot;ADD %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case XOR:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] ^= cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;XOR %d, R%d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] ^= pIns-&gt;operand2;<br />
        printf(&quot;XOR %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case CMP:<br />
      if(!pIns-&gt;mod){<br />
        cpu.fl = cpu.regs[pIns-&gt;operand1] == cpu.regs[pIns-&gt;operand2]? 0x00: (cpu.regs[pIns-&gt;operand1] &lt; cpu.regs[pIns-&gt;operand2]? 0xff: 0x01);<br />
        printf(&quot;CMP  %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.fl = cpu.regs[pIns-&gt;operand1] == pIns-&gt;operand2? 0x00: (cpu.regs[pIns-&gt;operand1] &lt; pIns-&gt;operand2? 0xff: 0x01);<br />
        printf(&quot;CMP %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case JMPE:<br />
      if(!cpu.fl){<br />
        if(!pIns-&gt;mod){<br />
          cpu.ip = adr(cpu.regs[cs], cpu.regs[pIns-&gt;operand1]);<br />
          printf(&quot;JMPE %d\n&quot;, pIns-&gt;operand1);<br />
        }<br />
        else{<br />
          cpu.ip = adr(cpu.regs[cs], adr(cpu.regs[pIns-&gt;operand2], cpu.regs[pIns-&gt;operand1]));<br />
          printf(&quot;JMPE %d: %d\n&quot;, pIns-&gt;operand2, pIns-&gt;operand1);<br />
        }<br />
        break;<br />
      }<br />
      --cpu.ip;<br />
      printf(&quot;JMPE NOP\n&quot;);<br />
      break;</p>
<p>    case HLT:<br />
      pIns-&gt;opcode = HLT;<br />
      printf(&quot;HLT\n&quot;);<br />
      break;</p>
<p>    default:<br />
      pIns-&gt;opcode = HLT;<br />
      printf(&quot;UNKNOW %02Xh, %02Xh\n&quot;, pIns-&gt;unknown[0], pIns-&gt;unknown[1]);<br />
      break;<br />
  };<br />
}</p>
<p>main(){</p>
<p>  cpu.ip = 0x00;</p>
<p>  cpu.regs[r0] = 0x00;<br />
  cpu.regs[r1] = 0x00;<br />
  cpu.regs[r2] = 0x00;<br />
  cpu.regs[r3] = 0x00;<br />
  cpu.regs[cs] = 0x00;<br />
  cpu.regs[ds] = 0x10;</p>
<p>  cpu.fl = 0x00;</p>
<p>  int i = 0;<br />
  while ( ++i &lt; (2&lt;&lt;16) &amp;&amp; ins.opcode != HLT) {<br />
    fetchDecode(&amp;ins);<br />
    exec(&amp;ins);<br />
  }</p>
<p>  FILE *fp = fopen(&quot;mem.dump&quot;, &quot;w&quot;);<br />
  dword dataStart = adr(cpu.regs[ds], 0);<br />
  fwrite((void*)(mem+dataStart), sizeof(mem)-dataStart, 1, fp);<br />
  fclose(fp);</p>
<p>}<br />
[/code]</p>
<p>执行:<br />
[code lang="text"]<br />
$ gcc -arch i386 -g stage2_vm.c -o stage2_vm<br />
$ ./stage2_vm<br />
...<br />
IP:22	JMPE NOP<br />
IP:23	CMP 0, 00<br />
IP:25	MOVR 0, 1B<br />
IP:27	JMPE 0<br />
IP:29	HLT</p>
<p>$ strings mem.dump<br />
GET /da75370fe15c4148bd4ceec861fbdaa5.exe HTTP/1.0<br />
h%2w<br />
b#[GUS0<br />
k6oofU0<br />
t\?)+f=<br />
EFg }D<br />
kEmT<br />
`bUZJfa<br />
xvar&gt;7#Vsqyc|<br />
Z//NN<br />
[/code]<br />
/da75370fe15c4148bd4ceec861fbdaa5.exe 是第2部分的答案</p>
<p><strong>第3部分</strong><br />
第2部分取得的<a href="http://canyoucrackit.co.uk/da75370fe15c4148bd4ceec861fbdaa5.exe" target="_blank">URL</a>需要cygwin环境的支持、因此要在Windows或者wine中执行。<br />
在执行之前先搜索下代码中包含了哪些文字<br />
[code lang="text"]<br />
$ strings da75370fe15c4148bd4ceec861fbdaa5.exe<br />
...<br />
hqDTK7b8K2rvw<br />
keygen.exe<br />
usage: keygen.exe hostname<br />
license.txt<br />
error: license.txt not found<br />
loading stage1 license key(s)...<br />
loading stage2 license key(s)...<br />
error: license.txt invalid<br />
error: gethostbyname() failed<br />
error: connect(&quot;%s&quot;) failed<br />
GET /%s/%x/%x/%x/key.txt HTTP/1.0<br />
...<br />
[/code]<br />
这次有很多有意义的结果.<br />
首先把da75370fe15c4148bd4ceec861fbdaa5.exe重命名为keygen.exe。</p>
<p>使用方法:<br />
[code lang="bash"]<br />
keygen.exe canyoucrackit.co.uk<br />
[/code]<br />
另外需要license.txt这个文件才能执行.</p>
<p>下面这段是反汇编的结果, 取自IDA Pro 6.1.110530 Evaluation version<br />
[code lang="masm"]<br />
.text:00401120 loc_401120:                             ; CODE XREF: sub_401090+76j<br />
.text:00401120                 mov     [esp+78h+var_70], 18h<br />
.text:00401128                 mov     [esp+78h+hqDTK7b8K2rvw_copy], 0<br />
.text:00401130                 lea     eax, [ebp+license1]<br />
.text:00401133                 mov     [esp+78h+license2], eax<br />
.text:00401136                 call    memset<br />
.text:0040113B                 lea     eax, [ebp+license1]<br />
.text:0040113E                 mov     [esp+78h+var_70], eax<br />
.text:00401142                 mov     [esp+78h+hqDTK7b8K2rvw_copy], offset aS ; &quot;%s&quot;<br />
.text:0040114A                 mov     eax, [ebp+var_4C]<br />
.text:0040114D                 mov     [esp+78h+license2], eax<br />
.text:00401150                 call    fscanf<br />
.text:00401155                 mov     eax, [ebp+var_4C]<br />
.text:00401158                 mov     [esp+78h+license2], eax<br />
.text:0040115B                 call    fclose<br />
.text:00401160                 mov     [ebp+var_4C], 0<br />
.text:00401167                 cmp     [ebp+license1], 'qhcg'               // license开始4个字是qhcg<br />
.text:0040116E                 jnz     short loc_4011CF<br />
.text:00401170                 mov     eax, hqDTK7b8K2rvw<br />
.text:00401175                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:00401179                 lea     eax, [ebp+license1]<br />
.text:0040117C                 add     eax, 4<br />
.text:0040117F                 mov     [esp+78h+license2], eax<br />
                                                                            // char *crypt(const char *key, const char *salt);<br />
                                                                            // key:8字、salt:2字<br />
.text:00401182                 call    crypt                                // crypt(&quot;license第5个字以后&quot;, &quot;hq&quot;);<br />
.text:00401187                 mov     edx, eax<br />
.text:00401189                 mov     eax, hqDTK7b8K2rvw<br />
.text:0040118E                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:00401192                 mov     [esp+78h+license2], edx<br />
.text:00401195                 call    strcmp<br />
.text:0040119A                 test    eax, eax<br />
.text:0040119C                 jnz     short loc_4011A5<br />
.text:0040119E                 mov     [ebp+var_C], 1<br />
.text:004011A5<br />
.text:004011A5 loc_4011A5:                             ; CODE XREF: sub_401090+10Cj<br />
.text:004011A5                 mov     [esp+78h+license2], offset aLoadingStage1L ; &quot;loading stage1 license key(s)...\n&quot;<br />
.text:004011AC                 call    printf<br />
.text:004011B1                 mov     eax, [ebp+license3]<br />
.text:004011B4                 mov     [ebp+license3_copy], eax<br />
.text:004011B7                 mov     [esp+78h+license2], offset aLoadingStage2L ; &quot;loading stage2 license key(s)...\n\n&quot;<br />
.text:004011BE                 call    printf<br />
.text:004011C3                 mov     eax, [ebp+license4]<br />
.text:004011C6                 mov     [ebp+license4_copy], eax<br />
.text:004011C9                 mov     eax, [ebp+license5]<br />
.text:004011CC                 mov     [ebp+license5_copy], eax<br />
.text:004011CF<br />
.text:004011CF loc_4011CF:                             ; CODE XREF: sub_401090+DEj<br />
.text:004011CF                 cmp     [ebp+var_C], 0<br />
.text:004011D3                 jnz     short loc_4011EA<br />
.text:004011D5                 mov     [esp+78h+license2], offset aErrorLicense_0 ; &quot;error: license.txt invalid\n&quot;<br />
.text:004011DC                 call    printf<br />
.text:004011E1                 mov     [ebp+var_50], 0FFFFFFFFh<br />
.text:004011E8                 jmp     short loc_401204<br />
.text:004011EA ; ---------------------------------------------------------------------------<br />
.text:004011EA<br />
.text:004011EA loc_4011EA:                             ; CODE XREF: sub_401090+143j<br />
.text:004011EA                 lea     eax, [ebp+license3_copy]<br />
.text:004011ED                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:004011F1                 mov     eax, [ebp+hostname]<br />
.text:004011F4                 add     eax, 4<br />
.text:004011F7                 mov     eax, [eax]<br />
.text:004011F9                 mov     [esp+78h+license2], eax<br />
.text:004011FC                 call    genURL                                  //生成URL需要license的3,4,5部分<br />
.text:00401201                 mov     [ebp+var_50], eax<br />
.text:00401204<br />
.text:00401204 loc_401204:                             ; CODE XREF: sub_401090+56j<br />
.text:00401204                                         ; sub_401090+8Bj ...<br />
.text:00401204                 mov     eax, [ebp+var_50]<br />
.text:00401207                 leave<br />
.text:00401208                 retn<br />
.text:00401208 sub_401090      endp<br />
[/code]<br />
总结这段代码, license的构成应该是:<br />
[code lang="text"]<br />
qhcg + crypt用的8字符的密匙(可省略) + license3(4字节) + license4(4字节) + license5(4字节)<br />
[/code]<br />
license3 ~ license5在哪边能找到呢?<br />
这里有一段提示:<br />
[code lang="text"]<br />
&quot;loading stage1 license key(s)...\n&quot;<br />
&quot;loading stage2 license key(s)...\n\n&quot;<br />
[/code]<br />
也就是说、第1部分中有1个密匙、第2部分中有2个密匙<br />
[code lang="text"]<br />
license3:<br />
第1部分中代码开始部分就JMP了, 这边值得怀疑<br />
   0:	eb 04                	jmp    0x6<br />
   2:	af                   	scas   %es:(%edi),%eax<br />
   3:	c2 bf a3             	ret    $0xa3bf<br />
JMP后面的4字节afc2bfa3就是答案.<br />
注意: x86是小尾序、afc2bfa3 应该写成 a3bfc2af。</p>
<p>license4,5:<br />
CPU的结构体中定义的firmware实际上并没有使用<br />
firmware: [0xd2ab1f05, 0xda13f110]<br />
这就是答案了<br />
[/code]<br />
license2如果不知道的话<br />
[code lang="text"]<br />
.text:0040119C的jnz<br />
改成jmp就行了<br />
0x75 -&gt; 0xEB<br />
[/code]<br />
google后发现, license2的答案是cyberwin。</p>
<p>license.txt的内容:<br />
[code lang="text"]<br />
67636871637962657277696EAFC2BFA3051FABD210F113DA<br />
[/code]<br />
用16进制保存.</p>
<p>[code lang="bash"]<br />
$ ./keygen.exe canyoucrackit.co.uk</p>
<p>keygen.exe</p>
<p>loading stage1 license key(s)...<br />
loading stage2 license key(s)...</p>
<p>request:</p>
<p>GET /hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt HTTP/1.0<br />
[/code]<br />
打开<a href="http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt" target="_blank">http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt</a><br />
[code lang="text"]<br />
Pr0t3ct!on#cyber_security@12*12.2011+<br />
[/code]<br />
这就是最终的答案<br />
<a href="http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png"><br />
[frame align="center"]<img src="http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png" alt="" title="cracked" width="525" height="345" class="alignnone size-full wp-image-24" />[/frame]</a><br />
成功!!!</p>
<p><strong>参考引用:</strong><br />
The Mac Hacker's Handbook<br />
http://pastebin.com/GAZ2aCLm<br />
[/tab]</p>
<p>[tab title="日本語"]<br />
Blogの更新も久しぶりだね、今回のテーマは、イギリスの政府通信本部GCHQからの求職問題です。<br />
問題はここ: http://canyoucrackit.co.uk/<br />
<strong>Part 1:</strong><br />
<a href="http://www.axot.org/wp-content/uploads/2011/12/cyber.png"><br />
[frame align="center"]<img src="http://www.axot.org/wp-content/uploads/2011/12/cyber.png" alt="" title="cyberPart1" width="370" height="130" class="alignnone size-full wp-image-21" /> [/frame]</a><br />
目に見える生データは10x16=160バイトの情報です、そのままじゃ考えにくいので、その中に何かの文字を入っているかを確認する。<br />
[code lang="bash"]<br />
$ strings raw<br />
\X=AAAAuCX=BBBBu;Z<br />
[/code]<br />
AAAA, BBBBしか無い、それはヒントにならない!<br />
ちょっと、最初のバイトは0xEBだ、0xEB(JMP)はクラッキングによく使うよね! もしかして、実行できるBinaryファイルなの? 確認しよう!<br />
[code lang="asm"]<br />
$ gobjdump -D -b binary -mi386 raw</p>
<p>raw:     file format binary</p>
<p>Disassembly of section .data:</p>
<p>00000000 &lt;.data&gt;:<br />
   0:	eb 04                	jmp    0x6<br />
   2:	af                   	scas   %es:(%edi),%eax<br />
   3:	c2 bf a3             	ret    $0xa3bf<br />
   6:	81 ec 00 01 00 00    	sub    $0x100,%esp<br />
   c:	31 c9                	xor    %ecx,%ecx<br />
   e:	88 0c 0c             	mov    %cl,(%esp,%ecx,1)<br />
  11:	fe c1                	inc    %cl<br />
  13:	75 f9                	jne    0xe<br />
  15:	31 c0                	xor    %eax,%eax<br />
  17:	ba ef be ad de       	mov    $0xdeadbeef,%edx<br />
  1c:	02 04 0c             	add    (%esp,%ecx,1),%al<br />
  1f:	00 d0                	add    %dl,%al<br />
  21:	c1 ca 08             	ror    $0x8,%edx<br />
  24:	8a 1c 0c             	mov    (%esp,%ecx,1),%bl<br />
  27:	8a 3c 04             	mov    (%esp,%eax,1),%bh<br />
  2a:	88 1c 04             	mov    %bl,(%esp,%eax,1)<br />
  2d:	88 3c 0c             	mov    %bh,(%esp,%ecx,1)<br />
  30:	fe c1                	inc    %cl<br />
  32:	75 e8                	jne    0x1c<br />
  34:	e9 5c 00 00 00       	jmp    0x95<br />
  39:	89 e3                	mov    %esp,%ebx<br />
  3b:	81 c3 04 00 00 00    	add    $0x4,%ebx<br />
  41:	5c                   	pop    %esp<br />
  42:	58                   	pop    %eax<br />
  43:	3d 41 41 41 41       	cmp    $0x41414141,%eax<br />
  48:	75 43                	jne    0x8d<br />
  4a:	58                   	pop    %eax<br />
  4b:	3d 42 42 42 42       	cmp    $0x42424242,%eax<br />
  50:	75 3b                	jne    0x8d<br />
  52:	5a                   	pop    %edx<br />
  53:	89 d1                	mov    %edx,%ecx<br />
  55:	89 e6                	mov    %esp,%esi<br />
  57:	89 df                	mov    %ebx,%edi<br />
  59:	29 cf                	sub    %ecx,%edi<br />
  5b:	f3 a4                	rep movsb %ds:(%esi),%es:(%edi)<br />
  5d:	89 de                	mov    %ebx,%esi<br />
  5f:	89 d1                	mov    %edx,%ecx<br />
  61:	89 df                	mov    %ebx,%edi<br />
  63:	29 cf                	sub    %ecx,%edi<br />
  65:	31 c0                	xor    %eax,%eax<br />
  67:	31 db                	xor    %ebx,%ebx<br />
  69:	31 d2                	xor    %edx,%edx<br />
  6b:	fe c0                	inc    %al<br />
  6d:	02 1c 06             	add    (%esi,%eax,1),%bl<br />
  70:	8a 14 06             	mov    (%esi,%eax,1),%dl<br />
  73:	8a 34 1e             	mov    (%esi,%ebx,1),%dh<br />
  76:	88 34 06             	mov    %dh,(%esi,%eax,1)<br />
  79:	88 14 1e             	mov    %dl,(%esi,%ebx,1)<br />
  7c:	00 f2                	add    %dh,%dl<br />
  7e:	30 f6                	xor    %dh,%dh<br />
  80:	8a 1c 16             	mov    (%esi,%edx,1),%bl<br />
  83:	8a 17                	mov    (%edi),%dl<br />
  85:	30 da                	xor    %bl,%dl<br />
  87:	88 17                	mov    %dl,(%edi)<br />
  89:	47                   	inc    %edi<br />
  8a:	49                   	dec    %ecx<br />
  8b:	75 de                	jne    0x6b<br />
  8d:	31 db                	xor    %ebx,%ebx<br />
  8f:	89 d8                	mov    %ebx,%eax<br />
  91:	fe c0                	inc    %al<br />
  93:	cd 80                	int    $0x80<br />
  95:	90                   	nop<br />
  96:	90                   	nop<br />
  97:	e8 9d ff ff ff       	call   0x39<br />
  9c:	41                   	inc    %ecx<br />
  9d:	41                   	inc    %ecx<br />
  9e:	41                   	inc    %ecx<br />
  9f:	41                   	inc    %ecx<br />
[/code]<br />
なんで最初からJMPしているかがよく分からないが、コード全体は基本OPしかないので、実行できそうな感じ。<br />
ただ、0x97行のところから、0x39行にCALLしている間に、0x9C行をstackにpushしているのに、0x42行、0x4A行二回連続POPするとはあり得ない。<br />
0x9c~0x9f行は0x41414141になっているけど、それはASCIIのAAAAだね、先文字列を検索するときに、BBBBも出ていたよ。<br />
0x43行に見たら、EAXとAAAAをCMPしている、EAXは0x9c~0x9f行のAAAAを格納しているので、結果がtrueのことが分かったね。<br />
問題は、その次の行がBBBBとCMPしているのに、EAXは何かが格納しているのは分からない。即ち、0x9f行の後ろが何かのデータが抜いている。<br />
問題の写真をダウンロードして、HEXコードを見ていたら、<br />
[code lang="text"]<br />
$ hexdump -C cyber.png<br />
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|<br />
00000010  00 00 02 e4 00 00 01 04  08 02 00 00 00 ef 6a b6  |..............j.|<br />
00000020  2d 00 00 00 01 73 52 47  42 00 ae ce 1c e9 00 00  |-....sRGB.......|<br />
00000030  00 09 70 48 59 73 00 00  0b 13 00 00 0b 13 01 00  |..pHYs..........|<br />
00000040  9a 9c 18 00 00 00 07 74  49 4d 45 07 db 08 05 0e  |.......tIME.....|<br />
00000050  12 33 7e 39 c1 70 00 00  00 5d 69 54 58 74 43 6f  |.3~9.p...]iTXtCo|<br />
00000060  6d 6d 65 6e 74 00 00 00  00 00 51 6b 4a 43 51 6a  |mment.....QkJCQj|<br />
00000070  49 41 41 41 43 52 32 50  46 74 63 43 41 36 71 32  |IAAACR2PFtcCA6q2|<br />
00000080  65 61 43 38 53 52 2b 38  64 6d 44 2f 7a 4e 7a 4c  |eaC8SR+8dmD/zNzL|<br />
00000090  51 43 2b 74 64 33 74 46  51 34 71 78 38 4f 34 34  |QC+td3tFQ4qx8O44|<br />
000000a0  37 54 44 65 75 5a 77 35  50 2b 30 53 73 62 45 63  |7TDeuZw5P+0SsbEc|<br />
000000b0  59 52 0a 37 38 6a 4b 4c  77 3d 3d 32 ca be f1 00  |YR.78jKLw==2....|<br />
...<br />
[/code]<br />
最初の当たりに<br />
[code lang="text"]<br />
QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR.78jKLw==<br />
[/code]<br />
が書いている。後ろが"=="になっていることは、もしかして、Base64でエンコードしているのかを疑ったいる。<br />
BASE64では"."が定義していないが、ここの"."は実際に改行記号の0x0Aなので、要らない。</p>
<p>Decode:<br />
[code lang="text"]<br />
$ echo 'QkJCQjIAAACR2PFtcCA6q2eaC8SR+8dmD/zNzLQC+td3tFQ4qx8O447TDeuZw5P+0SsbEcYR78jKLw==' | base64 -D -o decoded.bin<br />
$ hexdump -C decoded.bin<br />
00000000  42 42 42 42 32 00 00 00  91 d8 f1 6d 70 20 3a ab  |BBBB2......mp :.|<br />
00000010  67 9a 0b c4 91 fb c7 66  0f fc cd cc b4 02 fa d7  |g......f........|<br />
00000020  77 b4 54 38 ab 1f 0e e3  8e d3 0d eb 99 c3 93 fe  |w.T8............|<br />
00000030  d1 2b 1b 11 c6 11 ef c8  ca 2f                    |.+......./|<br />
0000003a<br />
[/code]<br />
Woo! BBBBが出てきたぞ! それを前のコードを合併して、実行してみよう!<br />
[code lang="c"]<br />
#include &lt;stdio.h&gt;<br />
#include &lt;sys/types.h&gt;<br />
#include &lt;sys/mman.h&gt;</p>
<p>main(){</p>
<p>  int i;</p>
<p>  static unsigned char shellcode[] = {<br />
    0xEB,0x04,0xAF,0xC2,0xBF,0xA3,0x81,0xEC,<br />
    0x00,0x01,0x00,0x00,0x31,0xC9,0x88,0x0C,<br />
    0x0C,0xFE,0xC1,0x75,0xF9,0x31,0xC0,0xBA,<br />
    0xEF,0xBE,0xAD,0xDE,0x02,0x04,0x0C,0x00,<br />
    0xD0,0xC1,0xCA,0x08,0x8A,0x1C,0x0C,0x8A,<br />
    0x3C,0x04,0x88,0x1C,0x04,0x88,0x3C,0x0C,<br />
    0xFE,0xC1,0x75,0xE8,0xE9,0x5C,0x00,0x00,<br />
    0x00,0x89,0xE3,0x81,0xC3,0x04,0x00,0x00,<br />
    0x00,0x5C,0x58,0x3D,0x41,0x41,0x41,0x41,<br />
    0x75,0x43,0x58,0x3D,0x42,0x42,0x42,0x42,<br />
    0x75,0x3B,0x5A,0x89,0xD1,0x89,0xE6,0x89,<br />
    0xDF,0x29,0xCF,0xF3,0xA4,0x89,0xDE,0x89,<br />
    0xD1,0x89,0xDF,0x29,0xCF,0x31,0xC0,0x31,<br />
    0xDB,0x31,0xD2,0xFE,0xC0,0x02,0x1C,0x06,<br />
    0x8A,0x14,0x06,0x8A,0x34,0x1E,0x88,0x34,<br />
    0x06,0x88,0x14,0x1E,0x00,0xF2,0x30,0xF6,<br />
    0x8A,0x1C,0x16,0x8A,0x17,0x30,0xDA,0x88,<br />
    0x17,0x47,0x49,0x75,0xDE,0x31,0xDB,0x89,<br />
    0xD8,0xFE,0xC0,0xCD,0x80,0x90,0x90,0xE8,<br />
    0x9D,0xFF,0xFF,0xFF,0x41,0x41,0x41,0x41,<br />
    0x42,0x42,0x42,0x42,0x32,0x00,0x00,0x00,<br />
    0x91,0xD8,0xF1,0x6D,0x70,0x20,0x3A,0xAB,<br />
    0x67,0x9A,0x0B,0xC4,0x91,0xFB,0xC7,0x66,<br />
    0x0F,0xFC,0xCD,0xCC,0xB4,0x02,0xFA,0xD7,<br />
    0x77,0xB4,0x54,0x38,0xAB,0x1F,0x0E,0xE3,<br />
    0x8E,0xD3,0x0D,0xEB,0x99,0xC3,0x93,0xFE,<br />
    0xD1,0x2B,0x1B,0x11,0xC6,0x11,0xEF,0xC8,<br />
    0xCA,0x2F<br />
  };</p>
<p>  /*<br />
   * patch INT 0x80 to INT 3 to throw an exception signal to debugger<br />
   * 0xCD -&gt; 0xCC<br />
   */<br />
  printf(&quot;patching shellcode...\n&quot;);</p>
<p>  for(i = 0; i &lt; sizeof(shellcode); i++){<br />
    if(*(unsigned short*)&amp;shellcode[i] == 0x80CD){<br />
      shellcode[i] = 0xCC;<br />
      printf(&quot;patch done\n&quot;);<br />
      break;<br />
    }<br />
  }</p>
<p>  unsigned int page = ((unsigned int)shellcode)&amp;0xfffff000;</p>
<p>  if(-1 == mprotect((void*)page, 4096, PROT_READ | PROT_WRITE | PROT_EXEC))<br />
    perror(&quot;mprotect error&quot;);</p>
<p>  ((int(*)())shellcode)();</p>
<p>}<br />
[/code]<br />
結果は0x87行あたりに、EDIに格納しているアドレスから、EDI-(新しい取ったデータのBBBBの後ろの1バイト0x32)に保存している。<br />
[code lang="bash"]<br />
$ gcc -arch i386 -g stage1.c -o stage1<br />
$ gdb stage1<br />
(gdb) r<br />
(gdb) x/s $edi-0x32<br />
0xbffff79a:	 &quot;GET /15b436de1f9107f3778aad525e5d0b20.js HTTP/1.1&quot;<br />
[/code]</p>
<p><strong>Part 2:</strong><br />
part1で取った<a href="http://canyoucrackit.co.uk/15b436de1f9107f3778aad525e5d0b20.js" target="_blank">URL</a></p>
<p>[code lang="js"]<br />
//--------------------------------------------------------------------------------------------------<br />
//<br />
// stage 2 of 3<br />
//<br />
// challenge:<br />
//   reveal the solution within VM.mem<br />
//<br />
// disclaimer:<br />
//   tested in ie 9, firefox 6, chrome 14 and v8 shell (http://code.google.com/apis/v8/build.html),<br />
//   other javascript implementations may or may not work.<br />
//<br />
//--------------------------------------------------------------------------------------------------</p>
<p>var VM = {</p>
<p>  cpu: {<br />
    ip: 0x00,</p>
<p>    r0: 0x00,<br />
    r1: 0x00,<br />
    r2: 0x00,<br />
    r3: 0x00,</p>
<p>    cs: 0x00,<br />
    ds: 0x10,</p>
<p>    fl: 0x00,</p>
<p>    firmware: [0xd2ab1f05, 0xda13f110]<br />
  },</p>
<p>  mem: [<br />
    0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,<br />
    0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>    0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,<br />
    0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,<br />
    0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,<br />
    0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,<br />
    0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,<br />
    0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,<br />
    0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,<br />
    0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,<br />
    0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,<br />
    0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,<br />
    0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,<br />
    0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,<br />
    0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,<br />
    0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,<br />
    0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,<br />
    0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>    0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,<br />
    0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,<br />
    0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,<br />
    0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,<br />
    0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,<br />
    0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,<br />
    0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,<br />
    0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,<br />
    0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,<br />
    0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,<br />
    0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,<br />
    0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,<br />
    0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,<br />
    0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00<br />
  ],</p>
<p>  exec: function()<br />
  {<br />
    // virtual machine architecture<br />
    // ++++++++++++++++++++++++++++<br />
    //<br />
    // segmented memory model with 16-byte segment size (notation seg:offset)<br />
    //<br />
    // 4 general-purpose registers (r0-r3)<br />
    // 2 segment registers (cs, ds equiv. to r4, r5)<br />
    // 1 flags register (fl)<br />
    //<br />
    // instruction encoding<br />
    // ++++++++++++++++++++<br />
    //<br />
    //           byte 1               byte 2 (optional)<br />
    // bits      [ 7 6 5 4 3 2 1 0 ]  [ 7 6 5 4 3 2 1 0 ]<br />
    // opcode      - - -<br />
    // mod               -<br />
    // operand1            - - - -<br />
    // operand2                         - - - - - - - -<br />
    //<br />
    // operand1 is always a register index<br />
    // operand2 is optional, depending upon the instruction set specified below<br />
    // the value of mod alters the meaning of any operand2<br />
    //   0: operand2 = reg ix<br />
    //   1: operand2 = fixed immediate value or target segment (depending on instruction)<br />
    //<br />
    // instruction set<br />
    // +++++++++++++++<br />
    //<br />
    // Notes:<br />
    //   * r1, r2 =&gt; operand 1 is register 1, operand 2 is register 2<br />
    //   * movr r1, r2 =&gt; move contents of register r2 into register r1<br />
    //<br />
    // opcode | instruction | operands (mod 0) | operands (mod 1)<br />
    // -------+-------------+------------------+-----------------<br />
    // 0x00   | jmp         | r1               | r2:r1<br />
    // 0x01   | movr        | r1, r2           | rx,   imm<br />
    // 0x02   | movm        | r1, [ds:r2]      | [ds:r1], r2<br />
    // 0x03   | add         | r1, r2           | r1,   imm<br />
    // 0x04   | xor         | r1, r2           | r1,   imm<br />
    // 0x05   | cmp         | r1, r2           | r1,   imm<br />
    // 0x06   | jmpe        | r1               | r2:r1<br />
    // 0x07   | hlt         | N/A              | N/A<br />
    //<br />
    // flags<br />
    // +++++<br />
    //<br />
    // cmp r1, r2 instruction results in:<br />
    //   r1 == r2 =&gt; fl = 0<br />
    //   r1 &lt; r2  =&gt; fl = 0xff<br />
    //   r1 &gt; r2  =&gt; fl = 1<br />
    //<br />
    // jmpe r1<br />
    //   =&gt; if (fl == 0) jmp r1<br />
    //      else nop</p>
<p>    throw &quot;VM.exec not yet implemented&quot;;<br />
  }</p>
<p>};</p>
<p>//--------------------------------------------------------------------------------------------------</p>
<p>try<br />
{<br />
  VM.exec();<br />
}<br />
catch(e)<br />
{<br />
  alert('\nError: ' + e + '\n');<br />
}</p>
<p>//--------------------------------------------------------------------------------------------------<br />
[/code]</p>
<p>問題の主旨ははっきり分かる、仮想CPUを作って、バイナリコードを実行し結果を得られる。<br />
低いレベルのプログラミングになるね、CS,DSなどを復習したら、出来ると思う。</p>
<p>[code lang="c"]<br />
#include &lt;stdio.h&gt;</p>
<p>static unsigned char mem[] = {<br />
  0x31, 0x04, 0x33, 0xaa, 0x40, 0x02, 0x80, 0x03, 0x52, 0x00, 0x72, 0x01, 0x73, 0x01, 0xb2, 0x50,<br />
  0x30, 0x14, 0xc0, 0x01, 0x80, 0x00, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>  0x98, 0xab, 0xd9, 0xa1, 0x9f, 0xa7, 0x83, 0x83, 0xf2, 0xb1, 0x34, 0xb6, 0xe4, 0xb7, 0xca, 0xb8,<br />
  0xc9, 0xb8, 0x0e, 0xbd, 0x7d, 0x0f, 0xc0, 0xf1, 0xd9, 0x03, 0xc5, 0x3a, 0xc6, 0xc7, 0xc8, 0xc9,<br />
  0xca, 0xcb, 0xcc, 0xcd, 0xce, 0xcf, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9,<br />
  0xda, 0xdb, 0xa9, 0xcd, 0xdf, 0xdf, 0xe0, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,<br />
  0x26, 0xeb, 0xec, 0xed, 0xee, 0xef, 0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9,<br />
  0x7d, 0x1f, 0x15, 0x60, 0x4d, 0x4d, 0x52, 0x7d, 0x0e, 0x27, 0x6d, 0x10, 0x6d, 0x5a, 0x06, 0x56,<br />
  0x47, 0x14, 0x42, 0x0e, 0xb6, 0xb2, 0xb2, 0xe6, 0xeb, 0xb4, 0x83, 0x8e, 0xd7, 0xe5, 0xd4, 0xd9,<br />
  0xc3, 0xf0, 0x80, 0x95, 0xf1, 0x82, 0x82, 0x9a, 0xbd, 0x95, 0xa4, 0x8d, 0x9a, 0x2b, 0x30, 0x69,<br />
  0x4a, 0x69, 0x65, 0x55, 0x1c, 0x7b, 0x69, 0x1c, 0x6e, 0x04, 0x74, 0x35, 0x21, 0x26, 0x2f, 0x60,<br />
  0x03, 0x4e, 0x37, 0x1e, 0x33, 0x54, 0x39, 0xe6, 0xba, 0xb4, 0xa2, 0xad, 0xa4, 0xc5, 0x95, 0xc8,<br />
  0xc1, 0xe4, 0x8a, 0xec, 0xe7, 0x92, 0x8b, 0xe8, 0x81, 0xf0, 0xad, 0x98, 0xa4, 0xd0, 0xc0, 0x8d,<br />
  0xac, 0x22, 0x52, 0x65, 0x7e, 0x27, 0x2b, 0x5a, 0x12, 0x61, 0x0a, 0x01, 0x7a, 0x6b, 0x1d, 0x67,<br />
  0x75, 0x70, 0x6c, 0x1b, 0x11, 0x25, 0x25, 0x70, 0x7f, 0x7e, 0x67, 0x63, 0x30, 0x3c, 0x6d, 0x6a,<br />
  0x01, 0x51, 0x59, 0x5f, 0x56, 0x13, 0x10, 0x43, 0x19, 0x18, 0xe5, 0xe0, 0xbe, 0xbf, 0xbd, 0xe9,<br />
  0xf0, 0xf1, 0xf9, 0xfa, 0xab, 0x8f, 0xc1, 0xdf, 0xcf, 0x8d, 0xf8, 0xe7, 0xe2, 0xe9, 0x93, 0x8e,<br />
  0xec, 0xf5, 0xc8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,</p>
<p>  0x37, 0x7a, 0x07, 0x11, 0x1f, 0x1d, 0x68, 0x25, 0x32, 0x77, 0x1e, 0x62, 0x23, 0x5b, 0x47, 0x55,<br />
  0x53, 0x30, 0x11, 0x42, 0xf6, 0xf1, 0xb1, 0xe6, 0xc3, 0xcc, 0xf8, 0xc5, 0xe4, 0xcc, 0xc0, 0xd3,<br />
  0x85, 0xfd, 0x9a, 0xe3, 0xe6, 0x81, 0xb5, 0xbb, 0xd7, 0xcd, 0x87, 0xa3, 0xd3, 0x6b, 0x36, 0x6f,<br />
  0x6f, 0x66, 0x55, 0x30, 0x16, 0x45, 0x5e, 0x09, 0x74, 0x5c, 0x3f, 0x29, 0x2b, 0x66, 0x3d, 0x0d,<br />
  0x02, 0x30, 0x28, 0x35, 0x15, 0x09, 0x15, 0xdd, 0xec, 0xb8, 0xe2, 0xfb, 0xd8, 0xcb, 0xd8, 0xd1,<br />
  0x8b, 0xd5, 0x82, 0xd9, 0x9a, 0xf1, 0x92, 0xab, 0xe8, 0xa6, 0xd6, 0xd0, 0x8c, 0xaa, 0xd2, 0x94,<br />
  0xcf, 0x45, 0x46, 0x67, 0x20, 0x7d, 0x44, 0x14, 0x6b, 0x45, 0x6d, 0x54, 0x03, 0x17, 0x60, 0x62,<br />
  0x55, 0x5a, 0x4a, 0x66, 0x61, 0x11, 0x57, 0x68, 0x75, 0x05, 0x62, 0x36, 0x7d, 0x02, 0x10, 0x4b,<br />
  0x08, 0x22, 0x42, 0x32, 0xba, 0xe2, 0xb9, 0xe2, 0xd6, 0xb9, 0xff, 0xc3, 0xe9, 0x8a, 0x8f, 0xc1,<br />
  0x8f, 0xe1, 0xb8, 0xa4, 0x96, 0xf1, 0x8f, 0x81, 0xb1, 0x8d, 0x89, 0xcc, 0xd4, 0x78, 0x76, 0x61,<br />
  0x72, 0x3e, 0x37, 0x23, 0x56, 0x73, 0x71, 0x79, 0x63, 0x7c, 0x08, 0x11, 0x20, 0x69, 0x7a, 0x14,<br />
  0x68, 0x05, 0x21, 0x1e, 0x32, 0x27, 0x59, 0xb7, 0xcf, 0xab, 0xdd, 0xd5, 0xcc, 0x97, 0x93, 0xf2,<br />
  0xe7, 0xc0, 0xeb, 0xff, 0xe9, 0xa3, 0xbf, 0xa1, 0xab, 0x8b, 0xbb, 0x9e, 0x9e, 0x8c, 0xa0, 0xc1,<br />
  0x9b, 0x5a, 0x2f, 0x2f, 0x4e, 0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,<br />
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00<br />
};</p>
<p>#define adr(seg, off) ((seg &lt;&lt; 4) + off)</p>
<p>typedef unsigned char   byte;<br />
typedef unsigned short  word;<br />
typedef unsigned int    dword;</p>
<p>typedef struct _CPU {<br />
  byte ip;<br />
  byte regs[6];<br />
  byte fl;<br />
} _CPU;</p>
<p>_CPU cpu;</p>
<p>enum _REGISTER {<br />
  r0,<br />
  r1,<br />
  r2,<br />
  r3,<br />
  cs,<br />
  ds<br />
};</p>
<p>typedef struct _INSTRUCTION {<br />
  byte opcode;<br />
  byte mod;<br />
  byte operand1;<br />
  byte operand2;<br />
  byte unknown[2];<br />
} _INSTRUCTION, *pInstruction;</p>
<p>_INSTRUCTION ins;</p>
<p>enum _OPCODE {<br />
  JMP,<br />
  MOVR,<br />
  MOVM,<br />
  ADD,<br />
  XOR,<br />
  CMP,<br />
  JMPE,<br />
  HLT<br />
};</p>
<p>void fetchDecode(pInstruction pIns){<br />
  word currentIP    = adr(cpu.regs[cs], cpu.ip);<br />
  pIns-&gt;opcode      = (mem[currentIP] &gt;&gt; 5) &amp; 0x07;<br />
  pIns-&gt;mod         = (mem[currentIP] &gt;&gt; 4) &amp; 0x01;<br />
  pIns-&gt;operand1    = mem[currentIP] &amp; 0x0F;<br />
  pIns-&gt;operand2    = mem[currentIP+1];</p>
<p>  pIns-&gt;unknown[0]  = mem[currentIP];<br />
  pIns-&gt;unknown[1]  = mem[currentIP+1];</p>
<p>  cpu.ip += 2;<br />
}</p>
<p>void exec(pInstruction pIns){</p>
<p>  printf(&quot;IP:%d\t&quot;, cpu.ip);</p>
<p>  switch(pIns-&gt;opcode) {</p>
<p>    case JMP:<br />
      if(!pIns-&gt;mod){<br />
        cpu.ip = cpu.regs[pIns-&gt;operand1];<br />
        printf(&quot;JMP  %d\n&quot;, pIns-&gt;operand1);<br />
      }<br />
      else{<br />
        cpu.regs[cs] = pIns-&gt;operand2;<br />
        cpu.ip = (cpu.regs[cs] &lt;&lt; 4) + cpu.regs[pIns-&gt;operand1];<br />
        printf(&quot;JMP  %d: %d\n&quot;, pIns-&gt;operand2, pIns-&gt;operand1);<br />
      }<br />
      break;</p>
<p>    case MOVR:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] = cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;MOVR %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] = pIns-&gt;operand2;<br />
        printf(&quot;MOVR %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case MOVM:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] = mem[adr(cpu.regs[ds], cpu.regs[pIns-&gt;operand2])];<br />
        printf(&quot;MOVM %d, [DS: %d]\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        mem[adr(cpu.regs[ds], cpu.regs[pIns-&gt;operand1])] = cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;MOVM [DS: %d], %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case ADD:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] += cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;ADD %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] += pIns-&gt;operand2;<br />
        printf(&quot;ADD %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case XOR:<br />
      if(!pIns-&gt;mod){<br />
        cpu.regs[pIns-&gt;operand1] ^= cpu.regs[pIns-&gt;operand2];<br />
        printf(&quot;XOR %d, R%d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.regs[pIns-&gt;operand1] ^= pIns-&gt;operand2;<br />
        printf(&quot;XOR %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case CMP:<br />
      if(!pIns-&gt;mod){<br />
        cpu.fl = cpu.regs[pIns-&gt;operand1] == cpu.regs[pIns-&gt;operand2]? 0x00: (cpu.regs[pIns-&gt;operand1] &lt; cpu.regs[pIns-&gt;operand2]? 0xff: 0x01);<br />
        printf(&quot;CMP  %d, %d\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      else{<br />
        cpu.fl = cpu.regs[pIns-&gt;operand1] == pIns-&gt;operand2? 0x00: (cpu.regs[pIns-&gt;operand1] &lt; pIns-&gt;operand2? 0xff: 0x01);<br />
        printf(&quot;CMP %d, %02X\n&quot;, pIns-&gt;operand1, pIns-&gt;operand2);<br />
      }<br />
      break;</p>
<p>    case JMPE:<br />
      if(!cpu.fl){<br />
        if(!pIns-&gt;mod){<br />
          cpu.ip = adr(cpu.regs[cs], cpu.regs[pIns-&gt;operand1]);<br />
          printf(&quot;JMPE %d\n&quot;, pIns-&gt;operand1);<br />
        }<br />
        else{<br />
          cpu.ip = adr(cpu.regs[cs], adr(cpu.regs[pIns-&gt;operand2], cpu.regs[pIns-&gt;operand1]));<br />
          printf(&quot;JMPE %d: %d\n&quot;, pIns-&gt;operand2, pIns-&gt;operand1);<br />
        }<br />
        break;<br />
      }<br />
      --cpu.ip;<br />
      printf(&quot;JMPE NOP\n&quot;);<br />
      break;</p>
<p>    case HLT:<br />
      pIns-&gt;opcode = HLT;<br />
      printf(&quot;HLT\n&quot;);<br />
      break;</p>
<p>    default:<br />
      pIns-&gt;opcode = HLT;<br />
      printf(&quot;UNKNOW %02Xh, %02Xh\n&quot;, pIns-&gt;unknown[0], pIns-&gt;unknown[1]);<br />
      break;<br />
  };<br />
}</p>
<p>main(){</p>
<p>  cpu.ip = 0x00;</p>
<p>  cpu.regs[r0] = 0x00;<br />
  cpu.regs[r1] = 0x00;<br />
  cpu.regs[r2] = 0x00;<br />
  cpu.regs[r3] = 0x00;<br />
  cpu.regs[cs] = 0x00;<br />
  cpu.regs[ds] = 0x10;</p>
<p>  cpu.fl = 0x00;</p>
<p>  int i = 0;<br />
  while ( ++i &lt; (2&lt;&lt;16) &amp;&amp; ins.opcode != HLT) {<br />
    fetchDecode(&amp;ins);<br />
    exec(&amp;ins);<br />
  }</p>
<p>  FILE *fp = fopen(&quot;mem.dump&quot;, &quot;w&quot;);<br />
  dword dataStart = adr(cpu.regs[ds], 0);<br />
  fwrite((void*)(mem+dataStart), sizeof(mem)-dataStart, 1, fp);<br />
  fclose(fp);</p>
<p>}<br />
[/code]</p>
<p>実行してみる:<br />
[code lang="text"]<br />
$ gcc -arch i386 -g stage2_vm.c -o stage2_vm<br />
$ ./stage2_vm<br />
...<br />
IP:22	JMPE NOP<br />
IP:23	CMP 0, 00<br />
IP:25	MOVR 0, 1B<br />
IP:27	JMPE 0<br />
IP:29	HLT</p>
<p>$ strings mem.dump<br />
GET /da75370fe15c4148bd4ceec861fbdaa5.exe HTTP/1.0<br />
h%2w<br />
b#[GUS0<br />
k6oofU0<br />
t\?)+f=<br />
EFg }D<br />
kEmT<br />
`bUZJfa<br />
xvar&gt;7#Vsqyc|<br />
Z//NN<br />
[/code]<br />
/da75370fe15c4148bd4ceec861fbdaa5.exe はPart 2で得られた結果!!</p>
<p><strong>Part 3:</strong><br />
part2で取った<a href="http://canyoucrackit.co.uk/da75370fe15c4148bd4ceec861fbdaa5.exe" target="_blank">URL</a>はcygwin環境が必要なので、Windowsもしくはwineで実行しよう。<br />
実行する前に文字検索するね<br />
[code lang="text"]<br />
$ strings da75370fe15c4148bd4ceec861fbdaa5.exe<br />
...<br />
hqDTK7b8K2rvw<br />
keygen.exe<br />
usage: keygen.exe hostname<br />
license.txt<br />
error: license.txt not found<br />
loading stage1 license key(s)...<br />
loading stage2 license key(s)...<br />
error: license.txt invalid<br />
error: gethostbyname() failed<br />
error: connect(&quot;%s&quot;) failed<br />
GET /%s/%x/%x/%x/key.txt HTTP/1.0<br />
...<br />
[/code]<br />
お!、結構情報入ってるじゃん。<br />
まずda75370fe15c4148bd4ceec861fbdaa5.exeをkeygen.exeにrenameする。</p>
<p>使い方は:<br />
[code lang="bash"]<br />
keygen.exe canyoucrackit.co.uk<br />
[/code]<br />
後、license.txtというファイルが用意せんとだめよね。</p>
<p>Disassemblyしたコードの抜粹です, IDA Pro 6.1.110530 Evaluation versionより<br />
[code lang="masm"]<br />
.text:00401120 loc_401120:                             ; CODE XREF: sub_401090+76j<br />
.text:00401120                 mov     [esp+78h+var_70], 18h<br />
.text:00401128                 mov     [esp+78h+hqDTK7b8K2rvw_copy], 0<br />
.text:00401130                 lea     eax, [ebp+license1]<br />
.text:00401133                 mov     [esp+78h+license2], eax<br />
.text:00401136                 call    memset<br />
.text:0040113B                 lea     eax, [ebp+license1]<br />
.text:0040113E                 mov     [esp+78h+var_70], eax<br />
.text:00401142                 mov     [esp+78h+hqDTK7b8K2rvw_copy], offset aS ; &quot;%s&quot;<br />
.text:0040114A                 mov     eax, [ebp+var_4C]<br />
.text:0040114D                 mov     [esp+78h+license2], eax<br />
.text:00401150                 call    fscanf<br />
.text:00401155                 mov     eax, [ebp+var_4C]<br />
.text:00401158                 mov     [esp+78h+license2], eax<br />
.text:0040115B                 call    fclose<br />
.text:00401160                 mov     [ebp+var_4C], 0<br />
.text:00401167                 cmp     [ebp+license1], 'qhcg'               // license先頭の4文字がqhcg<br />
.text:0040116E                 jnz     short loc_4011CF<br />
.text:00401170                 mov     eax, hqDTK7b8K2rvw<br />
.text:00401175                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:00401179                 lea     eax, [ebp+license1]<br />
.text:0040117C                 add     eax, 4<br />
.text:0040117F                 mov     [esp+78h+license2], eax<br />
                                                                            // char *crypt(const char *key, const char *salt);<br />
                                                                            // keyは8文字、saltは2文字<br />
.text:00401182                 call    crypt                                // crypt(&quot;license5文字以後&quot;, &quot;hq&quot;);<br />
.text:00401187                 mov     edx, eax<br />
.text:00401189                 mov     eax, hqDTK7b8K2rvw<br />
.text:0040118E                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:00401192                 mov     [esp+78h+license2], edx<br />
.text:00401195                 call    strcmp<br />
.text:0040119A                 test    eax, eax<br />
.text:0040119C                 jnz     short loc_4011A5<br />
.text:0040119E                 mov     [ebp+var_C], 1<br />
.text:004011A5<br />
.text:004011A5 loc_4011A5:                             ; CODE XREF: sub_401090+10Cj<br />
.text:004011A5                 mov     [esp+78h+license2], offset aLoadingStage1L ; &quot;loading stage1 license key(s)...\n&quot;<br />
.text:004011AC                 call    printf<br />
.text:004011B1                 mov     eax, [ebp+license3]<br />
.text:004011B4                 mov     [ebp+license3_copy], eax<br />
.text:004011B7                 mov     [esp+78h+license2], offset aLoadingStage2L ; &quot;loading stage2 license key(s)...\n\n&quot;<br />
.text:004011BE                 call    printf<br />
.text:004011C3                 mov     eax, [ebp+license4]<br />
.text:004011C6                 mov     [ebp+license4_copy], eax<br />
.text:004011C9                 mov     eax, [ebp+license5]<br />
.text:004011CC                 mov     [ebp+license5_copy], eax<br />
.text:004011CF<br />
.text:004011CF loc_4011CF:                             ; CODE XREF: sub_401090+DEj<br />
.text:004011CF                 cmp     [ebp+var_C], 0<br />
.text:004011D3                 jnz     short loc_4011EA<br />
.text:004011D5                 mov     [esp+78h+license2], offset aErrorLicense_0 ; &quot;error: license.txt invalid\n&quot;<br />
.text:004011DC                 call    printf<br />
.text:004011E1                 mov     [ebp+var_50], 0FFFFFFFFh<br />
.text:004011E8                 jmp     short loc_401204<br />
.text:004011EA ; ---------------------------------------------------------------------------<br />
.text:004011EA<br />
.text:004011EA loc_4011EA:                             ; CODE XREF: sub_401090+143j<br />
.text:004011EA                 lea     eax, [ebp+license3_copy]<br />
.text:004011ED                 mov     [esp+78h+hqDTK7b8K2rvw_copy], eax<br />
.text:004011F1                 mov     eax, [ebp+hostname]<br />
.text:004011F4                 add     eax, 4<br />
.text:004011F7                 mov     eax, [eax]<br />
.text:004011F9                 mov     [esp+78h+license2], eax<br />
.text:004011FC                 call    genURL                                  //URL生成するにはlicenseの3,4,5だけで出来る<br />
.text:00401201                 mov     [ebp+var_50], eax<br />
.text:00401204<br />
.text:00401204 loc_401204:                             ; CODE XREF: sub_401090+56j<br />
.text:00401204                                         ; sub_401090+8Bj ...<br />
.text:00401204                 mov     eax, [ebp+var_50]<br />
.text:00401207                 leave<br />
.text:00401208                 retn<br />
.text:00401208 sub_401090      endp<br />
[/code]<br />
まとめてすると、licenseと構成は<br />
[code lang="text"]<br />
qhcg + crypt用8文字のキー(無くてもおk) + license3(4バイト) + license4(4バイト) + license5(4バイト)<br />
[/code]<br />
license3 ~ license5はどこで探せんるんだ?<br />
ヒントは<br />
[code lang="text"]<br />
&quot;loading stage1 license key(s)...\n&quot;<br />
&quot;loading stage2 license key(s)...\n\n&quot;<br />
[/code]<br />
即ち、part1のところから1つと、part2からキー2つがどこかに隠していると考えられる。<br />
これは運で言うものか、よく分からんだけど、答えとしては<br />
[code lang="text"]<br />
license3:<br />
part1の最初がJMPしたよね? そこがヒントにならん?<br />
   0:	eb 04                	jmp    0x6<br />
   2:	af                   	scas   %es:(%edi),%eax<br />
   3:	c2 bf a3             	ret    $0xa3bf<br />
ここの afc2bfa3 が答え!<br />
注意: x86はLittle endianのため、afc2bfa3 は a3 bf c2 afで書くね。</p>
<p>license4,5:<br />
cpu構造体の中に定義したfirmwareは実際使ってないじゃない?<br />
firmware: [0xd2ab1f05, 0xda13f110]<br />
それが答え!<br />
[/code]<br />
license2はどこかに隠しているのは分からないが、分からなかったら、<br />
[code lang="text"]<br />
.text:0040119Cのjnz<br />
をjmpにするだけてできる。<br />
0x75 -&gt; 0xEB<br />
[/code]<br />
ネットで検索すると、license2はcyberwinが答えになってる。分かる方は是非教えてください。<br />
最終的にlicense.txtの内容を<br />
[code lang="text"]<br />
67636871637962657277696EAFC2BFA3051FABD210F113DA<br />
[/code]<br />
HEXで保存するね。</p>
<p>[code lang="bash"]<br />
$ ./keygen.exe canyoucrackit.co.uk</p>
<p>keygen.exe</p>
<p>loading stage1 license key(s)...<br />
loading stage2 license key(s)...</p>
<p>request:</p>
<p>GET /hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt HTTP/1.0<br />
[/code]<br />
<a href="http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt" target="_blank">http://canyoucrackit.co.uk/hqDTK7b8K2rvw/a3bfc2af/d2ab1f05/da13f110/key.txt</a>を開くと、<br />
[code lang="text"]<br />
Pr0t3ct!on#cyber_security@12*12.2011+<br />
[/code]<br />
これが最終の答えだ! 入力してみると<br />
<a href="http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png"><br />
[frame align="center"]<img src="http://www.axot.org/wp-content/uploads/2011/12/Screen-Shot-2011-12-05-at-23.19.26-.png" alt="" title="cracked" width="525" height="345" class="alignnone size-full wp-image-24" />[/frame]</a><br />
成功!!!</p>
<p><strong>参考引用:</strong><br />
The Mac Hacker's Handbook<br />
http://pastebin.com/GAZ2aCLm<br />
[/tab]</p>
<p>[/tabs]</p>

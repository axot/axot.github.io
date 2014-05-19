---
layout: post
status: publish
published: true
title: How to resolve _rb_Digest_MD5_Finish error in Ruby 1.9.x
author: axot
author_login: axot
author_email: im.axot@gmail.com
author_url: http://www.axot.org
excerpt: ! "When I am setting up Metasploit for Mac OSX, ruby 1.9.3 throw out a _rb_Digest_MD5_Finish
  error.\r\nIt seems only happend when you use RVM to manage rubies.\r\n"
wordpress_id: 36
wordpress_url: http://www.axot.org/?p=36
date: !binary |-
  MjAxMi0wNS0wMSAwMzo1MDo1MCArMDkwMA==
date_gmt: !binary |-
  MjAxMi0wNC0zMCAxODo1MDo1MCArMDkwMA==
categories:
- Misc
tags:
- Metasploit
- RVM
- Mac OSX
- Ruby 1.9.3
comments: []
---
When I am setting up Metasploit for Mac OSX, ruby 1.9.3 throw out a `_rb_Digest_MD5_Finish` error.
It seems only happend when you use RVM to manage rubies.

The Makefile in each subdirectory of `$HOME/.rvm/src/ruby-1.9.*/ext/digest` need be patched.
I don't know how to use RVM to install a custom Ruby version, so I made a simple shell script to do that.
`ruby1.9.x_patch.sh`(test passed on OSX 10.7.3 x86_64 version):
``` bash
#!/bin/sh

sed -i -e 's/sha1init.c sha1ossl.c$/sha1init.c sha1ossl.c sha1.c/g; s/sha1init.o sha1ossl.o$/sha1init.o sha1ossl.o sha1.o/g' Makefile
make clean
make

sed -i -e 's/sha2init.c sha2ossl.c$/sha2init.c sha2ossl.c sha2.c/g; s/sha2init.o sha2ossl.o$/sha2init.o sha2ossl.o sha2.o/g' Makefile
make clean
make

sed -i -e 's/md5init.c md5ossl.c$/md5init.c md5ossl.c md5.c/g; s/md5init.o md5ossl.o$/md5init.o md5ossl.o md5.o/g' Makefile
make clean
make

sed -i -e 's/rmd160init.c rmd160ossl.c$/rmd160init.c rmd160ossl.c rmd160.c/g; s/rmd160init.o rmd160ossl.o$/rmd160init.o rmd160ossl.o rmd160.o/g' Makefile
make clean
make

cp ../../../.ext/x86_64-darwin*/digest/*.bundle ../../../../../rubies/ruby-1.9.*/lib/ruby/1.9.*/x86_64-darwin*/digest/
echo Done
```

Usage example:
``` bash
rvm cleanup all
rvm reinstall 1.9.3
rvm reload
curl -L http://www.axot.org/wp-content/uploads/2012/05/ruby1.9.x_patch.sh | sh
rvm use 1.9.3
# test something whatever u want to
# for metasploit:
# msfrpcd -P password -U username
```

Downloads: [ruby1.9.x_patch](http://www.axot.org/wp-content/uploads/2012/05/ruby1.9.x_patch.sh)

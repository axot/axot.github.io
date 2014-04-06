---
layout: post
status: publish
published: true
title: ! 'How to pass through new state packets[NetGear WNR854T] '
author: axot
author_login: axot
author_email: im.axot@gmail.com
author_url: http://www.axot.org
excerpt: ! "Sometimes you may want add a static routing for accessing another network.\r\nWhen
  you done the static routing table, you found the ip routing was working fine, but
  the connection can't be established. The problem caused by firewall rule.\r\n\r\n"
wordpress_id: 6
wordpress_url: http://www.axot.org/?p=6
date: !binary |-
  MjAxMS0wNi0yNyAxNzoyNzozNSArMDkwMA==
date_gmt: !binary |-
  MjAxMS0wNi0yNyAxNzoyNzozNSArMDkwMA==
categories:
- Network
tags:
- Network
- Router
- WNR854T
- static table
- iptables
comments:
- id: 41
  author: dennis
  author_email: shellbomber@gmail.com
  author_url: http://blog.hot-root.com
  date: !binary |-
    MjAxMi0wMS0xNiAyMTozNTozMyArMDkwMA==
  date_gmt: !binary |-
    MjAxMi0wMS0xNiAxMjozNTozMyArMDkwMA==
  content: ! "any new firmware from the wnr854t. i think im really outdatet. running
    Feroceon rev 0 (v5l)\r\nNetgear WNR854T with Kernel 3.0.3.  maybe there is a new
    version for this router.?"
- id: 42
  author: axot
  author_email: im.axot@gmail.com
  author_url: http://www.axot.org
  date: !binary |-
    MjAxMi0wMS0xOCAwMDo0MDo1MyArMDkwMA==
  date_gmt: !binary |-
    MjAxMi0wMS0xNyAxNTo0MDo1MyArMDkwMA==
  content: ! 'you got 3.0.3 kernel? I''m using the old one "Linux WNR854TA 2.4.27-vrs1
    #562 Thu Mar 5 11:07:21 CST 2009 armv5EJl GNU/Linux"'
- id: 116
  author: Circ
  author_email: circ@vip.qq.com
  author_url: ''
  date: !binary |-
    MjAxMi0wOC0xOCAxOTowMjowMCArMDkwMA==
  date_gmt: !binary |-
    MjAxMi0wOC0xOCAxMDowMjowMCArMDkwMA==
  content: 老A兄，如果你有进博客中，你联系我一下QQ 82797266， 我是H，急事找你
---
<p>Sometimes you may want add a static routing for accessing another network.<br />
When you done the static routing table, you found the ip routing was working fine, but the connection can't be established. The problem caused by firewall rule.</p>
<p><a id="more"></a><a id="more-6"></a></p>
<hr/>
#update1: I made a new firmware based on 1.4.38, the iptables rule will load automatically. @2012.01.12<br />
<a href='http://www.axot.org/wp-content/uploads/2011/06/WNR854T_axot.img_.zip'>WNR854T custom firmware</a></p>
<hr/>
<p>Here I want show you how to fix the problem in the case of NetGear WNR854T.</p>
<p>go to: http://www.routerlogin.net/cmd.htm<br />
then run: 'iptables -L -n --line-numbers' for the print whole iptables rules.</p>
<p>the result(possible):</p>
<p>[code lang="bash"]<br />
Chain INPUT (policy ACCEPT)<br />
num  target     prot opt source               destination<br />
1    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0          udp spt:520 dpt:520<br />
2    ACCEPT     tcp  --  192.168.0.96/27      0.0.0.0/0          tcp dpt:81<br />
3    ACCEPT     icmp --  0.0.0.0/0            192.168.0.93       icmp type 8<br />
4    ACCEPT     all  --  192.168.0.96/27      0.0.0.0/0<br />
5    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0          state RELATED,ESTABLISHED<br />
6    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0          udp dpt:520<br />
7    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0          udp dpt:68<br />
8    DROP       all  --  0.0.0.0/0            0.0.0.0/0          state NEW,INVALID</p>
<p>Chain FORWARD (policy ACCEPT)<br />
num  target     prot opt source               destination<br />
1    PORT_FW    all  --  0.0.0.0/0            0.0.0.0/0<br />
2    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0          state RELATED,ESTABLISHED<br />
3    DROP       all  --  0.0.0.0/0            0.0.0.0/0          state NEW,INVALID</p>
<p>Chain OUTPUT (policy ACCEPT)<br />
num  target     prot opt source               destination</p>
<p>Chain PORT_FW (1 references)<br />
num  target     prot opt source               destination<br />
...<br />
[/code]</p>
<p>In index 8 of Chain INPUT and index 3 of Chain FORWARD, New state will be dropped by.<br />
So, we need modify these rules</p>
<p>like:</p>
<p>[code lang="bash"]<br />
iptables -R INPUT 8 -i eth0 -m state --state INVALID -j DROP<br />
iptables -R FORWARD 3 -i eth0 -m state --state INVALID -j DROP<br />
iptables -A INPUT -i eth0 -m state --state NEW -j ACCEPT<br />
iptables -A FORWARD -i eth0 -m state --state NEW -j ACCEPT<br />
[/code]</p>
<p>Change the number(8, 3) in your case.</p>
<p>the new rule table like this:</p>
<p>[code lang="bash"]<br />
Chain INPUT (policy ACCEPT)<br />
num  target     prot opt source               destination<br />
1    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0          udp spt:520 dpt:520<br />
2    ACCEPT     tcp  --  192.168.0.96/27      0.0.0.0/0          tcp dpt:81<br />
3    ACCEPT     icmp --  0.0.0.0/0            192.168.0.93       icmp type 8<br />
4    ACCEPT     all  --  192.168.0.96/27      0.0.0.0/0<br />
5    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0          state RELATED,ESTABLISHED<br />
6    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0          udp dpt:520<br />
7    ACCEPT     udp  --  0.0.0.0/0            0.0.0.0/0          udp dpt:68<br />
8    DROP       all  --  0.0.0.0/0            0.0.0.0/0          state INVALID<br />
9    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0          state NEW</p>
<p>Chain FORWARD (policy ACCEPT)<br />
num  target     prot opt source               destination<br />
1    PORT_FW    all  --  0.0.0.0/0            0.0.0.0/0<br />
2    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0          state RELATED,ESTABLISHED<br />
3    DROP       all  --  0.0.0.0/0            0.0.0.0/0          state INVALID<br />
4    ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0          state NEW</p>
<p>Chain OUTPUT (policy ACCEPT)<br />
num  target     prot opt source               destination</p>
<p>Chain PORT_FW (1 references)<br />
num  target     prot opt source               destination<br />
...<br />
[/code]</p>
<p>now, test the connection via ping or anything you like. :-)</p>
<p>Special thanks to Masaki わふー.</p>

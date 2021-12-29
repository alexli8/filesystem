# lsof 命令

### 1.介绍

lsof是一个列出当前系统打开文件的工具。在linux环境下，任何事物都以文件的形式存在，通过文件不仅仅可以访问常规数据，还可以访问网络连接和硬件。所以如传输控制协议 (TCP) 和用户数据报协议 (UDP) 套接字等，系统在后台都为该应用程序分配了一个文件描述符，无论这个文件的本质如何，该文件描述符为应用程序与基础操作系统之间的交互提供了通用接口。因为应用程序打开文件的描述符列表提供了大量关于这个应用程序本身的信息，因此通过lsof工具能够查看这个列表对系统监测以及排错将是很有帮助的。

用于查看你进程开打的文件，打开文件的进程，进程打开的端口(TCP、UDP)。找回/恢复删除的文件。是十分方便的系统监视工具，因为 lsof 需要访问核心内存和各种文件，所以需要root用户执行。

lsof打开的文件可以是：
* 1.普通文件
* 2.目录
* 3.网络文件系统的文件
* 4.字符或设备文件
* 5.(函数)共享库
* 6.管道，命名管道
* 7.符号链接
* 8.网络文件（例如：NFS file、网络socket，unix域名socket）
* 9.还有其它类型的文件，等等

### 2.命令参数

|参数|含义|
|-|-|
-a |列出打开文件存在的进程
-c<进程名> |列出指定进程所打开的文件
-g  |列出GID号进程详情
-d<文件号> |列出占用该文件号的进程
+d<目录>  |列出目录下被打开的文件
+D<目录>  |递归列出目录下被打开的文件
-n<目录>  |列出使用NFS的文件
-i<条件>  |列出符合条件的进程。（4、6、协议、:端口、 @ip ）
-p<进程号> |列出指定进程号所打开的文件
-u  |列出UID号进程详情
-h |显示帮助信息
-v |显示版本信息


### 3.使用实例

#### (1)直接使用
在测试服务上执行:

```
[root@node14 ~]# lsof
```

可以看到以下输出:

```
COMMAND     PID   TID    USER   FD      TYPE             DEVICE  SIZE/OFF       NODE NAME
systemd       1          root  cwd       DIR              253,0       276        512 /
systemd       1          root  rtd       DIR              253,0       276        512 /
systemd       1          root  txt       REG              253,0   1628608    8390884 /usr/lib/systemd/systemd
systemd       1          root  mem       REG              253,0     20064  109053708 /usr/lib64/libuuid.so.1.3.0
systemd       1          root  mem       REG              253,0    265576  109054619 /usr/lib64/libblkid.so.1.1.0
systemd       1          root  mem       REG              253,0     90248  109053698 /usr/lib64/libz.so.1.2.7
systemd       1          root  mem       REG              253,0    157424  109053704 /usr/lib64/liblzma.so.5.2.2
systemd       1          root  mem       REG              253,0     23968  109053758 /usr/lib64/libcap-ng.so.0.0.0
systemd       1          root  mem       REG              253,0     19896  109053740 /usr/lib64/libattr.so.1.1.0
systemd       1          root  mem       REG              253,0     19248  109053046 /usr/lib64/libdl-2.17.so
systemd       1          root  mem       REG              253,0    402384  109053687 /usr/lib64/libpcre.so.1.2.0
systemd       1          root  mem       REG              253,0   2156240  109053040 /usr/lib64/libc-2.17.so
systemd       1          root  mem       REG              253,0    142144  109053066 /usr/lib64/libpthread-2.17.so
systemd       1          root  mem       REG              253,0     88776  109052420 /usr/lib64/libgcc_s-4.8.5-20150702.so.1
systemd       1          root  mem       REG              253,0     43712  109053070 /usr/lib64/librt-2.17.so
systemd       1          root  mem       REG              253,0    277792  109055500 /usr/lib64/libmount.so.1.1.0
systemd       1          root  mem       REG              253,0     91800  109053900 /usr/lib64/libkmod.so.2.2.10
systemd       1          root  mem       REG              253,0    127184  109053760 /usr/lib64/libaudit.so.1.0.0
systemd       1          root  mem       REG              253,0     61680  109055528 /usr/lib64/libpam.so.0.83.1
systemd       1          root  mem       REG              253,0     20048  109053744 /usr/lib64/libcap.so.2.22
systemd       1          root  mem       REG              253,0    155744  109053696 /usr/lib64/libselinux.so.1
systemd       1          root  mem       REG              253,0    163312  109053033 /usr/lib64/ld-2.17.so
systemd       1          root    0u      CHR                1,3       0t0       1028 /dev/null
systemd       1          root    1u      CHR                1,3       0t0       1028 /dev/null
systemd       1          root    2u      CHR                1,3       0t0       1028 /dev/null
systemd       1          root    3u  a_inode               0,10         0       7802 [timerfd]
systemd       1          root    4u  a_inode               0,10         0       7802 [eventpoll]
systemd       1          root    5u  a_inode               0,10         0       7802 [signalfd]
systemd       1          root    6r      DIR               0,22         0      13324 /sys/fs/cgroup/systemd
systemd       1          root    7u  a_inode               0,10         0       7802 [timerfd]
systemd       1          root    8u  netlink                          0t0        262 KOBJECT_UEVENT
systemd       1          root    9r      REG                0,3         0      13649 /proc/1/mountinfo
systemd       1          root   10r  a_inode               0,10         0       7802 inotify
systemd       1          root   11r      REG                0,3         0 4026532067 /proc/swaps
systemd       1          root   12u     unix 0xffffa001ffa30880       0t0        263 /run/systemd/private
systemd       1          root   14r  a_inode               0,10         0       7802 inotify
systemd       1          root   19u  netlink                          0t0        268 AUDIT
systemd       1          root   20u  netlink                          0t0      41225 KOBJECT_UEVENT
systemd       1          root   21u     FIFO               0,20       0t0      41226 /run/dmeventd-server
systemd       1          root   22u     FIFO               0,20       0t0      41227 /run/dmeventd-client
systemd       1          root   23u     unix 0xffff9feafeff0000       0t0      13656 /run/systemd/notify
systemd       1          root   24u     unix 0xffff9feb0a3b8000       0t0      41228 /run/systemd/shutdownd
systemd       1          root   25u     unix 0xffff9feafeff0440       0t0      13658 /run/systemd/cgroups-agent

```

#### 输出说明

|信息|含义|
|-| -|
COMMAND|进程的名称
PID|进程标识符
PPID|父进程标识符（需要指定-R参数）
USER|进程所有者
PGID|进程所属组
FD|文件描述符，应用程序通过文件描述符识别该文件。如cwd、txt等
TYPE|文件类型，如DIR、REG等，常见的文件类型
DEVICE|指定磁盘的名称
SIZE|文件的大小
NODE|索引节点（文件在磁盘上的标识）
NAME|打开文件的确切名称

以下是fd的类型
* （1）cwd：表示current work dirctory，即：应用程序的当前工作目录，这是该应用程序启动的目录，除非它本身对这个目录进行更改
* （2）txt ：该类型的文件是程序代码，如应用程序二进制文件本身或共享库，如上列表中显示的 /sbin/init 程序
* （3）lnn：library references (AIX);
* （4）er：FD information error (see NAME column);
* （5）jld：jail directory (FreeBSD);
* （6）ltx：shared library text (code and data);
* （7）mxx ：hex memory-mapped type number xx.
* （8）m86：DOS Merge mapped file;
* （9）mem：memory-mapped file;
* （10）mmap：memory-mapped device;
* （11）pd：parent directory;
* （12）rtd：root directory;
* （13）tr：kernel trace file (OpenBSD);
* （14）v86  VP/ix mapped file;
* （15）0：表示标准输出
* （16）1：表示标准输入
* （17）2：表示标准错误

一般在标准输出、标准错误、标准输入后还跟着文件状态模式：r、w、u等

* （1）u：表示该文件被打开并处于读取/写入模式
* （2）r：表示该文件被打开并处于只读模式
* （3）w：表示该文件被打开并处于
* （4）空格：表示该文件的状态模式为unknow，且没有锁定
* （5）-：表示该文件的状态模式为unknow，且被锁定

同时在文件状态模式后面，还跟着相关的锁

* （1）N：for a Solaris NFS lock of unknown type;
* （2）r：for read lock on part of the file;
* （3）R：for a read lock on the entire file;
* （4）w：for a write lock on part of the file;（文件的部分写锁）
* （5）W：for a write lock on the entire file;（整个文件的写锁）
* （6）u：for a read and write lock of any length;
* （7）U：for a lock of unknown type;
* （8）x：for an SCO OpenServer Xenix lock on part      of the file;
* （9）X：for an SCO OpenServer Xenix lock on the      entire file;
* （10）space：if there is no lock.

TYPE：文件类型，如DIR、REG等，常见的文件类型

* （1）DIR：表示目录
* （2）CHR：表示字符类型
* （3）BLK：块设备类型
* （4）UNIX： UNIX 域套接字
* （5）FIFO：先进先出 (FIFO) 队列
* （6）IPv4：网际协议 (IP) 套接字


#### (2)查看谁正在使用某个文件，也就是说查找某个文件相关的进程

在测试服务上执行:

```
[root@node14 ~]# lsof /bin/bash
```

可以看到以下输出:

```
COMMAND   PID USER  FD   TYPE DEVICE SIZE/OFF     NODE NAME
bash    10217 root txt    REG  253,0   964536 33555607 /usr/bin/bash

```

#### (3)递归查看某个目录的文件信息

在测试服务上执行:

```
[root@node14 ~]# lsof test/test3
```


#### (4)列出某个用户打开的文件信息

在测试服务上执行:

```
[root@node14 ~]# lsof -u username
```


#### (5)列出某个程序进程所打开的文件信息

在测试服务上执行:

```
[root@node14 ~]# lsof -c mysql

```


#### (6)根据文件描述范围列出文件信息

在测试服务上执行:

```
[root@node14 ~]# lsof -d 2-3
```



#### (7)列出某个用户的所有活跃的网络端口

在测试服务上执行:

```
[root@node14 ~]# lsof -a -u test -i
```


#### (8)列出所有tcp 网络连接信息
在测试服务上执行:

```
[root@node14 ~]# lsof -i tcp
```


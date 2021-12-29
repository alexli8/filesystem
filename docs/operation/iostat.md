# iostat命令

### 1.介绍

iostat工具将对系统的磁盘操作活动进行监视。通过iostat可以查看CPU、网卡、tty设备、磁盘、CD-ROM 等等设备的活动情况, 负载信息。同vmstat一样，iostat也有一个弱点，就是它不能对某个进程进行深入分析，仅对系统的整体情况进行分析。iostat属于sysstat软件包。可以用yum install sysstat 直接安装。

#### 利用iostat分析集群状态发现瓶颈非常有帮助，尤其是实例3.(8)

### 2.命令参数

|参数|含义|
|-|-|
-C |显示CPU使用情况
-d |显示磁盘使用情况
-k |以 KB 为单位显示
-m |以 M 为单位显示
-N |显示磁盘阵列(LVM) 信息
-n |显示NFS 使用情况
-p[磁盘] |显示磁盘和分区的情况
-t |显示终端和CPU的信息
-x |显示详细信息
-V |显示版本信息

### 3.使用实例

#### (1)显示所有设备负载情况

在测试服务上执行:

```
[root@node14 ~]# iostat
```

可以看到以下输出:

```
Linux 3.10.0-1160.25.1.el7_lustre.x86_64 (node13.domain.cn)     12/29/2021      _x86_64_        (48 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.01    0.00    0.00    0.00    0.00   99.99

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               0.34         0.17        16.18     557647   51658971
sdc               0.00         0.00         0.00      10341       2048
dm-0              0.38         0.17        16.18     533120   51641796
dm-1              0.00         0.00         0.00       3236          0
dm-2              0.00         0.00         0.00       6458       2048

```

#### 输出说明
分别对CPU和disk属性进行说明

|信息|含义|
|-| -|
%user|CPU处在用户模式下的时间百分比。
%nice|CPU处在带NICE值的用户模式下的时间百分比。
%system|CPU处在系统模式下的时间百分比。
%iowait|CPU等待输入输出完成时间的百分比。
%steal|管理程序维护另一个虚拟处理器时，虚拟CPU的无意识等待时间百分比。
%idle|CPU空闲时间百分比。

#### 如果%iowait的值过高，表示硬盘存在I/O瓶颈，%idle值高，表示CPU较空闲，如果%idle值高但系统响应慢时，有可能是CPU等待分配内存，此时应加大内存容量。%idle值如果持续低于10，那么系统的CPU处理能力相对较低，表明系统中最需要解决的资源是CPU。


|信息|含义|
|-| -|
rrqm/s|每秒进行 merge 的读操作数目。即 rmerge/s
wrqm/s|  每秒进行 merge 的写操作数目。即 wmerge/s
r/s|  每秒完成的读 I/O 设备次数。即 rio/s
w/s|  每秒完成的写 I/O 设备次数。即 wio/s
rsec/s|  每秒读扇区数。即 rsect/s
wsec/s|  每秒写扇区数。即 wsect/s
rkB/s|  每秒读K字节数。是 rsect/s 的一半，因为每扇区大小为512字节。
wkB/s|  每秒写K字节数。是 wsect/s 的一半。
avgrq-sz|  平均每次设备I/O操作的数据大小 (扇区)。
avgqu-sz|  平均I/O队列长度。
await|  平均每次设备I/O操作的等待时间 (毫秒)。
svctm| 平均每次设备I/O操作的服务时间 (毫秒)。
%util|  一秒中有百分之多少的时间用于 I/O 操作，即被io消耗的cpu百分比

#### 如果 %util 接近 100%，说明产生的I/O请求太多，I/O系统已经满负荷，该磁盘可能存在瓶颈。如果 svctm 比较接近 await，说明 I/O 几乎没有等待时间；如果 await 远大于 svctm，说明I/O 队列太长，io响应太慢，则需要进行必要优化。如果avgqu-sz比较大，也表示有当量io在等待。

#### (2)定时显示所有信息

在测试服务上执行:

```
[root@node14 ~]# iostat 2 3
```

这个命令表示每隔2妙刷新显示，共显示3次，可以看到以下输出:

```
Linux 3.10.0-1160.25.1.el7_lustre.x86_64 (node13.domain.cn)     12/29/2021      _x86_64_        (48 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.01    0.00    0.00    0.00    0.00   99.99

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               0.34         0.17        16.18     557647   51671222
sdc               0.00         0.00         0.00      10341       2048
dm-0              0.38         0.17        16.17     533120   51654047
dm-1              0.00         0.00         0.00       3236          0
dm-2              0.00         0.00         0.00       6458       2048

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.00    0.00    0.00    0.00    0.00  100.00

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               0.00         0.00         0.00          0          0
sdc               0.00         0.00         0.00          0          0
dm-0              0.00         0.00         0.00          0          0
dm-1              0.00         0.00         0.00          0          0
dm-2              0.00         0.00         0.00          0          0

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.01    0.00    0.01    0.01    0.00   99.97

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               4.50         0.00       176.50          0        353
sdc               0.00         0.00         0.00          0          0
dm-0              6.00         0.00       176.50          0        353
dm-1              0.00         0.00         0.00          0          0
dm-2              0.00         0.00         0.00          0          0

```

#### (3)显示指定磁盘信息

在测试服务上执行:

```
[root@node14 ~]# iostat -d sdb1
```

可以看到以下输出:

```
Linux 3.10.0-1160.25.1.el7_lustre.x86_64 (node13.domain.cn)     12/29/2021      _x86_64_        (48 CPU)

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb1              0.00         0.00         0.00       3624          0

```

#### (4)显示tty和CPU信息

在测试服务上执行:

```
[root@node14 ~]# iostat -t
```

可以看到以下输出:

```
Linux 3.10.0-1160.25.1.el7_lustre.x86_64 (node13.domain.cn)     12/29/2021      _x86_64_        (48 CPU)

12/29/2021 02:55:32 PM
avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.01    0.00    0.00    0.00    0.00   99.99

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               0.34         0.17        16.18     557647   51674249
sdc               0.00         0.00         0.00      10341       2048
dm-0              0.38         0.17        16.17     533120   51657074
dm-1              0.00         0.00         0.00       3236          0
dm-2              0.00         0.00         0.00       6458       2048

```

#### (5)查看TPS和吞吐量信息

在测试服务上执行:

```
[root@node14 ~]# iostat -d -k 1 1
```

可以看到以下输出:

```
Linux 3.10.0-1160.25.1.el7_lustre.x86_64 (node13.domain.cn)     12/29/2021      _x86_64_        (48 CPU)

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               0.34         0.17        16.18     557647   51675954
sdc               0.00         0.00         0.00      10341       2048
dm-0              0.38         0.17        16.17     533120   51658779
dm-1              0.00         0.00         0.00       3236          0
dm-2              0.00         0.00         0.00       6458       2048


```

#### 输出说明
|信息|含义|
|-| -|
tps|该设备每秒的传输次数（Indicate the number of transfers per second that were issued to the device.）。“一次传输”意思是“一次I/O请求”。多个逻辑请求可能会被合并为“一次I/O请求”。“一次传输”请求的大小是未知的。
kB_read/s|每秒从设备（drive expressed）读取的数据量；
kB_wrtn/s|每秒向设备（drive expressed）写入的数据量；
kB_read|读取的总数据量；
kB_wrtn|写入的总数量数据量；

这些单位都为Kilobytes。上面的例子中，我们可以看到磁盘sda以及它的各个分区的统计数据，因为是瞬间值，所以总TPS并不严格等于各个分区TPS的总和。

#### (6)查看设备使用率（%util）、响应时间（await）

在测试服务上执行:

```
[root@node14 ~]# iostat -d -x -k 1 1
```

可以看到以下输出:

```
Linux 3.10.0-1160.25.1.el7_lustre.x86_64 (node13.domain.cn)     12/29/2021      _x86_64_        (48 CPU)

Device:         rrqm/s   wrqm/s     r/s     w/s    rkB/s    wkB/s avgrq-sz avgqu-sz   await r_await w_await  svctm  %util
sdb               0.00     0.05    0.01    0.33     0.17    16.18    97.52     0.00    0.19    3.67    0.10   0.08   0.00
sdc               0.00     0.00    0.00    0.00     0.00     0.00    32.65     0.00    0.48    0.49    0.00   0.33   0.00
dm-0              0.00     0.00    0.01    0.37     0.17    16.17    85.55     0.00    0.18    3.65    0.10   0.32   0.01
dm-1              0.00     0.00    0.00    0.00     0.00     0.00    49.78     0.00    4.66    4.66    0.00   3.55   0.00
dm-2              0.00     0.00    0.00    0.00     0.00     0.00    26.09     0.00    1.01    1.02    0.00   0.79   0.00

```

#### 输出说明
|信息|含义|
|-| -|
rrqm/s|  每秒进行 merge 的读操作数目.即 delta(rmerge)/s
wrqm/s| 每秒进行 merge 的写操作数目.即 delta(wmerge)/s
r/s|  每秒完成的读 I/O 设备次数.即 delta(rio)/s
w/s|  每秒完成的写 I/O 设备次数.即 delta(wio)/s
rsec/s|  每秒读扇区数.即 delta(rsect)/s
wsec/s| 每秒写扇区数.即 delta(wsect)/s
rkB/s|  每秒读K字节数.是 rsect/s 的一半,因为每扇区大小为512字节.(需要计算)
wkB/s|  每秒写K字节数.是 wsect/s 的一半.(需要计算)
avgrq-sz|平均每次设备I/O操作的数据大小 (扇区).delta(rsect+wsect)/delta(rio+wio)
avgqu-sz|平均I/O队列长度.即 delta(aveq)/s/1000 (因为aveq的单位为毫秒).
await|  平均每次设备I/O操作的等待时间 (毫秒).即 delta(ruse+wuse)/delta(rio+wio)
svctm| 平均每次设备I/O操作的服务时间 (毫秒).即 delta(use)/delta(rio+wio)
%util| 一秒中有百分之多少的时间用于 I/O 操作,或者说一秒中有多少时间 I/O 队列是非空的，即 delta(use)/s/1000 (因为use的单位为毫秒)

即 delta(use)/s/1000 (因为use的单位为毫秒)

#### 如果 %util 接近 100%，说明产生的I/O请求太多，I/O系统已经满负荷，该磁盘可能存在瓶颈。idle小于70% IO压力就较大了，一般读取速度有较多的wait。同时可以结合vmstat 查看查看b参数(等待资源的进程数)和wa参数(IO等待所占用的CPU时间的百分比，高过30%时IO压力高)。另外 await 的参数也要多和 svctm 来参考。差的过高就一定有 IO 的问题。avgqu-sz 也是个做 IO 调优时需要注意的地方，这个就是直接每次操作的数据的大小，如果次数多，但数据拿的小的话，其实 IO 也会很小。如果数据拿的大，才IO 的数据会高。也可以通过 avgqu-sz × ( r/s or w/s ) = rsec/s or wsec/s。也就是讲，读定速度是这个来决定的。

#### svctm 一般要小于 await (因为同时等待的请求的等待时间被重复计算了)，svctm 的大小一般和磁盘性能有关，CPU/内存的负荷也会对其有影响，请求过多也会间接导致 svctm 的增加。await 的大小一般取决于服务时间(svctm) 以及 I/O 队列的长度和 I/O 请求的发出模式。如果 svctm 比较接近 await，说明 I/O 几乎没有等待时间；如果 await 远大于 svctm，说明 I/O 队列太长，应用得到的响应时间变慢，如果响应时间超过了用户可以容许的范围，这时可以考虑更换更快的磁盘，调整内核 elevator 算法，优化应用，或者升级 CPU。

队列长度(avgqu-sz)也可作为衡量系统 I/O 负荷的指标，但由于 avgqu-sz 是按照单位时间的平均值，所以不能反映瞬间的 I/O 洪水。

#### 形象的比喻：
* r/s+w/s 类似于交款人的总数
* 平均队列长度(avgqu-sz)类似于单位时间里平均排队人的个数
* 平均服务时间(svctm)类似于收银员的收款速度
* 平均等待时间(await)类似于平均每人的等待时间
* 平均I/O数据(avgrq-sz)类似于平均每人所买的东西多少
* I/O 操作率 (%util)类似于收款台前有人排队的时间比例
* 设备IO操作:总IO(io)/s = r/s(读) +w/s(写) =1.46 + 25.28=26.74

平均每次设备I/O操作只需要0.36毫秒完成,现在却需要10.57毫秒完成，因为发出的 请求太多(每秒26.74个)，假如请求时同时发出的，可以这样计算平均等待时间:
平均等待时间=单个I/O服务器时间*(1+2+...+请求总数-1)/请求总数，每秒发出的I/0请求很多,但是平均队列就4,表示这些请求比较均匀,大部分处理还是比较及时。
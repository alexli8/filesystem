## openZFS 文件系统
openZFS文件系统是由 Sun™ 开发使用存储池方法的新技术ZFS文件系统的一个开源版分支。 这就是说只有在需要存储数据的时候空间才会被使用。 它也为保护数据最大完整性而设计的，支持数据快照， 多份拷贝和数据校验。增加了被称为 RAID-Z 的新的数据复制类型。RAID-Z 是种类似于 RAID5类型, 但被设计成防止写入漏洞。


### 单个磁盘存储池
在单个磁盘上创建一个简单， 非冗余的 ZFS， 使用 zpool 命令：

```
# zpool create example /dev/da0
```

可以通过 df 的输出查看新的存储池：

```
# df
Filesystem  1K-blocks    Used    Avail Capacity  Mounted on
/dev/ad0s1a   2026030  235230  1628718    13%    /
devfs               1       1        0   100%    /dev
/dev/ad0s1d  54098308 1032846 48737598     2%    /usr
example      17547136       0 17547136     0%    /example
```

这份输出清楚的表明了 example 存储池不仅创建成功而且被 挂载 了。 我们能像访问普通的文件系统那样访问它， 就像以下例子中演示的那样，用户能够在上面创建文件并浏览：


```
# cd /example
# ls
# touch testfile
# ls -al
total 4
drwxr-xr-x   2 root  wheel    3 Aug 29 23:15 .
drwxr-xr-x  21 root  wheel  512 Aug 29 23:12 ..
-rw-r--r--   1 root  wheel    0 Aug 29 23:15 testfile
```
在这个存储池上创建一个文件系统，并启用压缩：

```
# zfs create example/compressed
# zfs set compression=gzip example/compressed
```
现在 example/compressed 是一个启用了压缩的 ZFS 文件系统了。 可以尝试复制一些大的文件到 /example/compressed。

使用这个命令可以禁用压缩：
```
# zfs set compression=off example/compressed
```
使用如下的命令卸载这个文件系统，并用 df 工具确认：
```
# zfs umount example/compressed
# df
Filesystem  1K-blocks    Used    Avail Capacity  Mounted on
/dev/ad0s1a   2026030  235232  1628716    13%    /
devfs               1       1        0   100%    /dev
/dev/ad0s1d  54098308 1032864 48737580     2%    /usr
example      17547008       0 17547008     0%    /example
```
重新挂在这个文件系统使之能被访问， 并用 df 确认：

```
# zfs mount example/compressed
# df
Filesystem         1K-blocks    Used    Avail Capacity  Mounted on
/dev/ad0s1a          2026030  235234  1628714    13%    /
devfs                      1       1        0   100%    /dev
/dev/ad0s1d         54098308 1032864 48737580     2%    /usr
example             17547008       0 17547008     0%    /example
example/compressed  17547008       0 17547008     0%    /example/compressed
```
存储池与文件系统也可通过 mount 的输出查看：
```
# mount
/dev/ad0s1a on / (ufs, local)
devfs on /dev (devfs, local)
/dev/ad0s1d on /usr (ufs, local, soft-updates)
example on /example (zfs, local)
example/data on /example/data (zfs, local)
example/compressed on /example/compressed (zfs, local)
```
如前面所提到的，ZFS 文件系统，在创建之后就能像普通的文件系统那样使用。然而， 还有很多其他的特性是可用的。在下面的例子中， 我们将创建一个新的文件系统，data。 并要在上面存储些重要的文件， 所以文件系统需要被设置成把每一个数据块都保存两份拷贝：
```
# zfs create example/data
# zfs set copies=2 example/data
```
现在可以再次使用 df 查看数据和空间的使用状况：
```
# df
Filesystem         1K-blocks    Used    Avail Capacity  Mounted on
/dev/ad0s1a          2026030  235234  1628714    13%    /
devfs                      1       1        0   100%    /dev
/dev/ad0s1d         54098308 1032864 48737580     2%    /usr
example             17547008       0 17547008     0%    /example
example/compressed  17547008       0 17547008     0%    /example/compressed
example/data        17547008       0 17547008     0%    /example/data
```
请注意存储池上的每一个文件系统都有着相同数量的可用空间。 这就是我们在这些例子中使用 df 的原因， 是为了文件系统都是从相同的存储池取得它们所需的空间。 ZFS 去掉了诸如卷和分区此类的概念， 并允许多个文件系统占用同一个存储池。 不再需要文件系统与存储池的时候能像这样销毁它们：
```
# zfs destroy example/compressed
# zfs destroy example/data
# zpool destroy example
```
磁盘无法避免的会坏掉和停止运转。 当这块磁盘坏掉的时候，上面的数据都将丢失。 一个避免因磁盘损坏而丢失数据的方法是使用 RAID。ZFS 在它的存储池设计中支持这样的特性， 这便是下一节将探讨的。

### ZFS RAID-Z

正如前文中所提到的，这一章节将假设存在 3 个 SCSI 设备， da0， da1 和 da2 (或者 ad0 和超出此例使用了 IDE 磁盘)。 使用如下的命令创建一个 RAID-Z 存储池:
```
# zpool create storage raidz da0 da1 da2
```
注意: 推荐在一个 RAID-Z 配置中使用的磁盘数量为 3 至 9 块。 如果你要求在单独的一个存储池中使用 10 块或更多的磁盘， 请考虑分拆成更小 RAID-z 组。 如果你只有 2 块磁盘， 并仍然需要冗余， 请考虑使用 ZFS 的 mirror 特性。zpool storage 至此就创建好了。 如需配给更多的磁盘设备则把它们加这个列表的后面。 在存储池上创建一个叫 home 的文件系统， 用户的文件最终都将被保存在上面：
```
# zfs create storage/home
```
像前文中提到的那样，用户的目录与文件也可启用压缩并保存多份拷贝， 可通过如下的命令完成：
```
# zfs set copies=2 storage/home
# zfs set compression=gzip storage/home
```
把用户的数据都拷贝过来并创建一个符号链接， 让他们开始使用这个新的目录：
```
# cp -rp /home/* /storage/home
# rm -rf /home /usr/home
# ln -s /storage/home /home
# ln -s /storage/home /usr/home
```
现在用户的数据应该都保存在新创建的 /storage/home 上了。 测试添加一个新用户并以这个身份登录。

尝试创建一个可日后用来回退的快照：
```
# zfs snapshot storage/home@08-30-08
```
请注意快照选项将只会抓取一个真实的文件系统， 而不是某个用户目录或文件。@ 字符为文件系统名或卷名的分隔符。 当用户目录被损坏时，可用如下命令恢复：
```
# zfs rollback storage/home@08-30-08
```
获得所有可用快照的列表，可使用 ls 命令查看文件系统的 .zfs/snapshot 目录。例如，执行如下命令来查看之前抓取的快照：
```
# ls /storage/home/.zfs/snapshot
```
可以编写一个脚本来每月定期抓取用户数据的快照，久而久之， 快照可能消耗掉大量的磁盘空间。 之前创建的快照可用以下命令删除：
```
# zfs destroy storage/home@08-30-08
```
在所有这些测试之后，我们没有理由再把 /store/home 这样放置了。让它称为真正的 /home 文件系统：
```
# zfs set mountpoint=/home storage/home
```
使用 df 和 mount 命令将显示现在系统把我们的文件系统真正当作了 /home：
```
# mount
/dev/ad0s1a on / (ufs, local)
devfs on /dev (devfs, local)
/dev/ad0s1d on /usr (ufs, local, soft-updates)
storage on /storage (zfs, local)
storage/home on /home (zfs, local)
# df
Filesystem   1K-blocks    Used    Avail Capacity  Mounted on
/dev/ad0s1a    2026030  235240  1628708    13%    /
devfs                1       1        0   100%    /dev
/dev/ad0s1d   54098308 1032826 48737618     2%    /usr
storage       26320512       0 26320512     0%    /storage
storage/home  26320512       0 26320512     0%    /home
```
这样就基本完成了 RAID-Z 的配置了。使用夜间 periodic(8) 获取有关文件系统创建之类的状态更新， 执行如下的命令：
```
# echo 'daily_status_zfs_enable="YES"' >> /etc/periodic.conf
```
### 修复 RAID-Z
每一种软 RAID 都有监测它们 状态 的方法。 ZFS 也不例外。 可以使用如下的命令查看 RAID-Z 设备：
```
# zpool status -x
```
如果所有的存储池处于健康状态并且一切正常的话， 将返回如下信息：
```
all pools are healthy
```
如果存在问题，可能是一个磁盘设备下线了， 那么返回的存储池的状态将看上去是类似这个样子的：
```
  pool: storage
 state: DEGRADED
status: One or more devices has been taken offline by the administrator.
	Sufficient replicas exist for the pool to continue functioning in a
	degraded state.
action: Online the device using 'zpool online' or replace the device with
	'zpool replace'.
 scrub: none requested
config:

	NAME        STATE     READ WRITE CKSUM
	storage     DEGRADED     0     0     0
	  raidz1    DEGRADED     0     0     0
	    da0     ONLINE       0     0     0
	    da1     OFFLINE      0     0     0
	    da2     ONLINE       0     0     0

errors: No known data errors
```
在这个例子中，这是由管理员把此设备下线后的状态。 可以使用如下的命令将磁盘下线：
```
# zpool offline storage da1
```
现在切断系统电源之后就可以替换下 da1 了。 当系统再次上线时，使用如下的命令替换磁盘：
```
# zpool replace storage da1
```
至此可用不带 -x 标志的命令再次检查状态：
```
# zpool status storage
 pool: storage
 state: ONLINE
 scrub: resilver completed with 0 errors on Sat Aug 30 19:44:11 2008
config:

	NAME        STATE     READ WRITE CKSUM
	storage     ONLINE       0     0     0
	  raidz1    ONLINE       0     0     0
	    da0     ONLINE       0     0     0
	    da1     ONLINE       0     0     0
	    da2     ONLINE       0     0     0

errors: No known data errors
```
在这个例子中，一切都显示正常。

### 数据校验
正如前面所提到的，ZFS 使用 校验和(checksum) 来检查存储数据的完整性。 这时在文件系统创建时自动启用的，可使用以下的命令禁用：
```
# zfs set checksum=off storage/home
```
这不是个明智的选择，因为校验和 不仅非常有用而且只需占用少量的存储空间。 并且启用它们也不会明显的消耗过多资源。 启用后就可以让 ZFS 使用校验和校验来检查数据的完整。 这个过程通常称为 “scrubbing”。 可以使用以下的命令检查 storage 存储池里数据的完整性：
```
# zpool scrub storage
```
这个过程需花费相当长的时间，取决于存储的数据量。 而且 I/O 非常密集， 所以在任何时间只能执行一个这样的操作。 在 scrub 完成之后，状态就会被更新， 可使用如下的命令查看：
```
# zpool status storage
 pool: storage
 state: ONLINE
 scrub: scrub completed with 0 errors on Sat Aug 30 19:57:37 2008
config:

	NAME        STATE     READ WRITE CKSUM
	storage     ONLINE       0     0     0
	  raidz1    ONLINE       0     0     0
	    da0     ONLINE       0     0     0
	    da1     ONLINE       0     0     0
	    da2     ONLINE       0     0     0

errors: No known data errors
```
这个例子中完成时间非常的清楚。 这个特性可以帮助我们在很长的一段时间内确保数据的完整。
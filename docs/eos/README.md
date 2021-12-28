## EOS

### 准备工作 
首先安装docker
```
# yum install docker
# systemctl start docker
```

### 在docker里运行EOS
```
# git clone https://gitlab.cern.ch/eos/eos-docker.git
# cd eos-docker
# scripts/start_services.sh -i gitlab-registry.cern.ch/dss/eos:4.8.39 -n 6
```
要启动一个具有 6 个存储服务器 (FST)、1 个命名空间服务器 (MGM)、1 个消息传递程序 (MQ)、1 个客户端和 1 个 Kerberos KDC 容器的小型实例，只需使用 start_services 脚本即可。

要提供的参数是要与 -i 一起使用的映像的名称以及带有 -n 标志的 FST 容器的数量（默认为 6）。

容器将驻留在同一个网络上，了解并配置为开箱即用。

使用在 MGM 容器中运行的 eos shell CLI 连接到 EOS。

```
# docker exec -i eos-mgm1 eos
# EOS Console [root://localhost] |/> whoami
whoami
Virtual Identity: uid=0 (2,99,3,0) gid=0 (99,4,0) [authz:sss] sudo* host=localhost
# EOS Console [root://localhost] |/> version
version
EOS_INSTANCE=eosdockertest
EOS_SERVER_VERSION=4.8.39 EOS_SERVER_RELEASE=1
EOS_CLIENT_VERSION=4.8.39 EOS_CLIENT_RELEASE=1
# EOS Console [root://localhost] |/> node ls
node ls
┌──────────┬─────────────────────────────────────┬────────────────┬──────────┬────────────┬──────┬──────────┬────────┬────────┬────────────────┬─────┐
│type      │                             hostport│          geotag│    status│      status│  txgw│ gw-queued│  gw-ntx│ gw-rate│  heartbeatdelta│ nofs│
└──────────┴─────────────────────────────────────┴────────────────┴──────────┴────────────┴──────┴──────────┴────────┴────────┴────────────────┴─────┘
 nodesview  eos-fst1.eoscluster.cern.ch:1095      docker-test     online           on    off          0       10      120                2     1
 nodesview  eos-fst2.eoscluster.cern.ch:1095      docker-test     online           on    off          0       10      120                2     1
 nodesview  eos-fst3.eoscluster.cern.ch:1095      docker-test     online           on    off          0       10      120                2     1
 nodesview  eos-fst4.eoscluster.cern.ch:1095      docker-test     online           on    off          0       10      120                2     1
 nodesview  eos-fst5.eoscluster.cern.ch:1095      docker-test     online           on    off          0       10      120                2     1
 nodesview  eos-fst6.eoscluster.cern.ch:1095      docker-test     online           on    off          0       10      120                2
 ```
 可以使用 FUSE 和 KRB5 身份验证将 EOS 挂载到客户端容器。

 ```
 # docker exec -i eos-cli1 env EOS_MGM_URL=root://eos-mgm1.eoscluster.cern.ch eos # fuse mount /eos
# docker exec -it eos-cli1 bash

.... trying to create ... /eos
===> Mountpoint   : /eos
===> Fuse-Options : max_readahead=131072,max_write=4194304,fsname=eos-mgm1.eoscluster.cern.ch,url=root://eos-mgm1.eoscluster.cern.ch//eos/
===> fuse readahead        : 1
===> fuse readahead-window : 1048576
===> fuse debug            : 0
===> fuse low-level debug  : 0
===> fuse log-level        : 5
===> fuse write-cache      : 1
===> fuse write-cache-size : 67108864
===> fuse rm level protect : 1
===> fuse lazy-open-ro     : 0
===> fuse lazy-open-rw     : 1
==== fuse multi-threading  : true
info: successfully mounted EOS [root://eos-mgm1.eoscluster.cern.ch] under /eos
# [root@testmachine eos-docker]# docker exec -it eos-cli1 bash
# ls -la /eos/
total 4
drwxrwxr-x.  1 root root    0 Jan  1  1970 .
drwxr-xr-x. 18 root root 4096 Mar 14 10:16 ..
drwxrwxr-x.  1 root root    0 Jan  1  1970 dockertest
```

### 数据删除
可以使用 shutdown_services 脚本从系统中删除这些 EOS 容器。
```
# scripts/shutdown_services.sh
```

### 镜像仓库
可以获得每个自动构建和每个版本的图像，发布映像标有发布版本，常规图像使用其原始管道的构建 ID 进行标记。Docker 镜像可以从项目的注册表中访问。 
```
# docker pull gitlab-registry.cern.ch/dss/eos:<tag>
# docker pull gitlab-registry.cern.ch/dss/eos:206970
```
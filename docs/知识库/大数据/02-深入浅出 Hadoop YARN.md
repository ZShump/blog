# 深入浅出 Hadoop YARN

## **一. Hadoop Yarn 是什么**
在古老的 Hadoop1.0 中，MapReduce 的 JobTracker 负责了太多的工作，包括资源调度，管理众多的 TaskTracker 等工作。这自然是不合理的，于是 Hadoop 在 1.0 到 2.0 的升级过程中，便将 JobTracker 的资源调度工作独立了出来，而这一改动，直接让 Hadoop 成为大数据中最稳固的那一块基石。，**而这个独立出来的资源管理框架，就是 Yarn** 。

在详细介绍 Yarn 之前，我们先简单聊聊 Yarn ，Yarn 的全称是 ** Yet Another Resource Negotiator**，意思是“_另一种资源调度器_”，这种命名和“有间客栈”这种可谓是异曲同工之妙。这里多说一句，以前 Java 有一个项目编译工具，叫做 Ant，他的命名也是类似的，叫做 “Another Neat Tool”的缩写，翻译过来是”另一种整理工具“。

既然都叫做资源调度器了，那么自然，它的功能也是负责资源管理和调度的，接下来，我们就深入到 Yarn 这个东西内部一探究竟吧。

## **二. Yarn 架构**
  


<img src="/images/bigdata/1691549935269-18b168b0-6f86-4e80-9e47-2a777c4aae6a.gif" width="1440" title="" crop="0,0,1,1" id="u1cb0fda3" class="ne-image">

  
我们主要围绕上面这张图展开，不过在介绍图中内容时，需要先了解 Yarn 中的 Container 的概念，然后会介绍图中一个个组件，最后看看提交一个程序的流程。

## **2.1 Container**
容器（Container）这个东西是 Yarn 对资源做的一层抽象。就像我们平时开发过程中，经常需要对底层一些东西进行封装，只提供给上层一个调用接口一样，Yarn 对资源的管理也是用到了这种思想。

  


<img src="/images/bigdata/1691549935284-92a22f29-c461-438e-abbd-e38f294651d1.webp" width="986" title="" crop="0,0,1,1" id="u6a9a39bc" class="ne-image">

  


如上所示，Yarn 将CPU核数，内存这些计算资源都封装成为一个个的容器（Container）。需要注意两点：

+ 容器由 NodeManager 启动和管理，并被它所监控。
+ 容器被 ResourceManager 进行调度。

NodeManager 和 ResourceManager 这两个组件会在下面讲到。

## **2.2 三个主要组件**
再看最上面的图，我们能直观发现的两个主要的组件是 ResourceManager 和 NodeManager ，但其实还有一个 ApplicationMaster 在图中没有直观显示。我们分别来看这三个组件。

## **ResourceManager**
我们先来说说上图中最中央的那个 ResourceManager（RM）。从名字上我们就能知道这个组件是负责资源管理的，整个系统有且只有一个 RM ，来负责资源的调度。它也包含了两个主要的组件：定时调用器(Scheduler)以及应用管理器(ApplicationManager)。

1. 定时调度器(Scheduler)：从本质上来说，定时调度器就是一种策略，或者说一种算法。当 Client 提交一个任务的时候，它会根据所需要的资源以及当前集群的资源状况进行分配。注意，它只负责向应用程序分配资源，并不做监控以及应用程序的状态跟踪。
2. 应用管理器(ApplicationManager)：同样，听名字就能大概知道它是干嘛的。应用管理器就是负责管理 Client 用户提交的应用。上面不是说到定时调度器（Scheduler）不对用户提交的程序监控嘛，其实啊，监控应用的工作正是由应用管理器（ApplicationManager）完成的。

## **ApplicationMaster**
每当 Client 提交一个 Application 时候，就会新建一个 ApplicationMaster 。由这个 ApplicationMaster 去与 ResourceManager 申请容器资源，获得资源后会将要运行的程序发送到容器上启动，然后进行分布式计算。

这里可能有些难以理解，为什么是把运行程序发送到容器上去运行？如果以传统的思路来看，是程序运行着不动，然后数据进进出出不停流转。但当数据量大的时候就没法这么玩了，因为海量数据移动成本太大，时间太长。但是中国有一句老话**山不过来，我就过去。**大数据分布式计算就是这种思想，既然大数据难以移动，那我就把容易移动的应用程序发布到各个节点进行计算呗，这就是大数据分布式计算的思路。

## **NodeManager**
NodeManager 是 ResourceManager 在每台机器的上代理，负责容器的管理，并监控他们的资源使用情况（cpu，内存，磁盘及网络等），以及向 ResourceManager/Scheduler 提供这些资源使用报告。

## **三. 提交一个 Application 到 Yarn 的流程**
  


<img src="/images/bigdata/1691549935297-4a713c8d-2871-4315-884d-f6e8287e1897.webp" width="720" title="" crop="0,0,1,1" id="u50afe983" class="ne-image">

  


这张图简单地标明了提交一个程序所经历的流程，接下来我们来具体说说每一步的过程。

1. Client 向 Yarn 提交 Application，这里我们假设是一个 MapReduce 作业。
2. ResourceManager 向 NodeManager 通信，为该 Application 分配第一个容器。并在这个容器中运行这个应用程序对应的 ApplicationMaster。
3. ApplicationMaster 启动以后，对 作业（也就是 Application） 进行拆分，拆分 task 出来，这些 task 可以运行在一个或多个容器中。然后向 ResourceManager 申请要运行程序的容器，并定时向 ResourceManager 发送心跳。
4. 申请到容器后，ApplicationMaster 会去和容器对应的 NodeManager 通信，而后将作业分发到对应的 NodeManager 中的容器去运行，这里会将拆分后的 MapReduce 进行分发，对应容器中运行的可能是 Map 任务，也可能是 Reduce 任务。
5. 容器中运行的任务会向 ApplicationMaster 发送心跳，汇报自身情况。当程序运行完成后， ApplicationMaster 再向 ResourceManager 注销并释放容器资源。

以上就是一个作业的大体运行流程。

## **为什么会有 Yarn ？**
上面说了这么多，最后我们来聊聊为什么会有 Yarn 吧。

直接的原因呢，就是因为 Hadoop1.0 中架构的缺陷，在 MapReduce 中，jobTracker 担负起了太多的责任了，接收任务是它，资源调度是它，监控 TaskTracker 运行情况还是它。这样实现的好处是比较简单，但相对的，就容易出现一些问题，比如常见的单点故障问题。

要解决这些问题，只能将 jobTracker 进行拆分，将其中部分功能拆解出来。彼时业内已经有了一部分的资源管理框架，比如 mesos，于是照着这个思路，就开发出了 Yarn。这里多说个冷知识，其实 Spark 早期是为了推广 mesos 而产生的，这也是它名字的由来，不过后来反正是 Spark 火起来了。。。

闲话不多说，其实 Hadoop 能有今天这个地位，Yarn 可以说是功不可没。因为有了 Yarn ，更多计算框架可以接入到 Hdfs 中，而不单单是 MapReduce，到现在我们都知道，MapReduce 早已经被 Spark 等计算框架赶超，而 Hdfs 却依然屹立不倒。究其原因，正式因为 Yarn 的包容，使得其他计算框架能专注于计算性能的提升。Hdfs 可能不是最优秀的大数据存储系统，但却是应用最广泛的大数据存储系统，Yarn 功不可没。

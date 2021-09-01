# Hugo 搭建过程



记录基于`Hugo`静态博客建站工具 和`LoveIt`主题的个人博客过程，作为备忘。`VS Code`作为博客编辑、站点部署集成环境，站点维护仍然采用`Github Pages`。

由于 LoveIt 原作者已长期未维护，[HEIGE-PCloud](https://github.com/HEIGE-PCloud) 基于 LoveIt 的新主题[DoIt](https://github.com/HEIGE-PCloud/DoIt)主题，并维持着更新。致敬∠(°ゝ°)。

DoIt 的安装配置同 LoveIt，因此此文档仍然可参考。

<!--more-->

[toc]

## 准备工作

* 安装 VS Code；
* 安装 Git；

## Hugo 安装

### 下载 Hugo


Hugo 包括基础版本和支持自定义样式`scss`的 **extended**版本。

为了提高可用性，应对未来可能的自定义需求，我决定安装 **Hugo extended** 版本。

从 [Hugo Release](https://github.com/gohugoio/hugo/releases)下载适合版本的压缩包，我的是Windows_x64。解压缩到想要安装的目录。解压出来，只有简单的一个主程序。可见，相对于 Hexo 依赖于 Node.js 及一大堆 npm 包，Hugo 的确非常的简洁。

{{< image src="https://i.loli.net/2021/07/26/y4JH3CWGFpcY1gk.png" width="300" caption="Hugo 安装路径" >}}

### 添加环境变量

将 Hugo 的主程序路径添加到系统环境变量中，这样在命令行终端中才能调用主程序执行一系列命令，之后我们就能直接在VS Code的终端中执行命令。我的安装路径为：

```code
D:\Dev\hugo_0.86.0\
```

首先打开 资源管理器/我的电脑，然后在左侧导航栏，右键点击 **此电脑**，在弹出菜单中，打开 **属性**。

{{< image src="https://i.loli.net/2021/07/26/gokF32DmiMHhyq5.png" width="300" caption="我的电脑->属性" >}}

依次在弹出窗口中点击 **高级系统设置**。

<div align="center"><img src="https://i.loli.net/2021/07/26/5Lx9IckVh4rQtYe.png" alt="Blog-by-Hugo-and-LoveIt_20210726152730_2021-07-26-15-27-32" width="500" align="center"/></div>

在弹出窗口中点击**环境变量**。
<div align="center"><img src="https://i.loli.net/2021/07/26/2EiRPBO5IQnpH83.png" alt="Blog-by-Hugo-and-LoveIt_20210726152841_2021-07-26-15-28-42" width="300" align="center"/></div>

双击 **path** 变量，点击 **添加**，将 Hugo 主程序路径填入，点击 **确定**以保存修改。

<div align="center"><img src="https://i.loli.net/2021/07/26/2dwpveRYOnK7aHS.png" alt="Blog-by-Hugo-and-LoveIt_20210726153824_2021-07-26-15-38-26" width="600" align="center"/></div>

### 验证配置是否成功

VS Code 中 ``Ctrl+Shift+` ``，打开终端，输入 `hugo version`，若能如下图所示，无错返回版本号，则环境配置成功。

<div align="center"><img src="https://i.loli.net/2021/07/26/XPCsuZNlqvgVTJr.png" alt="Blog-by-Hugo-and-LoveIt_20210726154557_2021-07-26-15-45-58" width="500" align="center"/></div>

### 建立站点

打开终端，进入想将站点源文件放置的路径，执行以下命令，其中站点名指定站点工程源文件夹的名字，按照自己的需求随便取即可，和实际的网站 url不是一个东西。执行命令后，会按指定的站点名创建站点文件夹，并在文件夹下自动初始化生成路径结构以及相关的站点文件。

```bash
// 其中，hugo.wlcheng.github.io 换成自己的站点文件夹名字即可
hugo new site hugo.wlcheng.github.io
cd hugo.wlcheng.github.io
```

输出结果如下截图：
<div align="center"><img src="https://i.loli.net/2021/07/26/cTfDLsoFmJ1ZyWd.png" alt="Blog-by-Hugo-and-LoveIt_20210726160101_2021-07-26-16-01-03" width="500" align="center"/></div>

生成的站点目录结构：

<div align="center"><img src="https://i.loli.net/2021/07/26/Ij85BKNOtrqQM1A.png" alt="Blog-by-Hugo-and-LoveIt_20210726161024_2021-07-26-16-10-26" width="500" align="center"/></div>

## LoveIt 主题

在Hugo 的主题商城扫了一圈，最后选了 LoveIt这一款主题。从 LoveIt的官方网站上逛了一圈，观感很棒。真可谓官方介绍的“一款**简洁**、**优雅**且**高效**的Hugo博客主题”。

### 安装主题

LoveIt 主题的仓库地址是 https://github.com/dillonzq/LoveIt 。

补充：DoIt 主体仓库地址是 https://github.com/HEIGE-PCloud/DoIt 。

可以直接下载最新版主题压缩包，将其解压到站点目录下的 themes文件夹中。

也可以直接用 git 克隆到该目录下，在站点目录下执行以下命令：

``` bash
git clone https://github.com/dillonzq/LoveIt.git themes/LoveIt 
```

### 配置主题

替换站点配置文件 `/config.toml` 内容为：

```toml
baseURL = "http://wlchengg.github.io/"
# [en, zh-cn, fr, ...] 设置默认的语言
defaultContentLanguage = "zh-cn"
# 网站语言, 仅在这里 CN 大写
languageCode = "zh-CN"
# 是否包括中日韩文字
hasCJKLanguage = true
# 网站标题
title = "Wlcheng's Life"

# 更改使用 Hugo 构建网站时使用的默认主题
theme = "LoveIt"

[params]
  # LoveIt 主题版本
  version = "0.2.X"

[menu]
  [[menu.main]]
    identifier = "posts"
    # 你可以在名称 (允许 HTML 格式) 之前添加其他信息, 例如图标
    pre = ""
    # 你可以在名称 (允许 HTML 格式) 之后添加其他信息, 例如图标
    post = ""
    name = "文章"
    url = "/posts/"
    # 当你将鼠标悬停在此菜单链接上时, 将显示的标题
    title = ""
    weight = 1
  [[menu.main]]
    identifier = "tags"
    pre = ""
    post = ""
    name = "标签"
    url = "/tags/"
    title = ""
    weight = 2
  [[menu.main]]
    identifier = "categories"
    pre = ""
    post = ""
    name = "分类"
    url = "/categories/"
    title = ""
    weight = 3

# Hugo 解析文档的配置
[markup]
  # 语法高亮设置 (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    # false 是必要的设置 (https://github.com/dillonzq/LoveIt/issues/158)
    noClasses = false
```

### 创建文章

## 参考

[主题文档 - 基本概念 —— Dillon —— LoveIt](https://hugoloveit.com/zh-cn/theme-documentation-basics/)

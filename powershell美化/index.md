# PowerShell美化


记录新版 PowerShell 的美化过程。

TODO: 美化后的样子

待续...

<!--more-->

### 开始

### 安装 Windows Terminal

可以在微软商店 (Microsoft Store) 搜索 `Windows Terminal` 安装。

商城搜索结果会有多种版本的Windows Terminal (以下将简称为Terminal)，不知选哪个的话，可直接点击此处链接 [Windows Terminal - 微软商店](https://www.microsoft.com/store/productId/9N0DX20HK701)，然后点击`获取`，弹出框中同意`打开`电脑的微软商城，跳转到软件主页后，直接`安装`即可。安装过程无需做任何选项与设置，就像在手机上的软件商城中搜索软件进行安装一样简单。

当然，如果想体验最新功能，可以去官方Github发布页获取最新预览版本：[Windows Terminal - Github](https://github.com/microsoft/terminal/releases)

安装完后的 Windows Terminal，可以在系统开始菜单找到并打开。先看一下美化前的样子。

<div align="center"><img src="https://i.loli.net/2021/08/19/bTVWEIBykK74J3Y.png" alt="20210819220235" width="600" align="center"/></div>

朴实无华，看着其实也还不错。

可以看到Terminal的多窗口是标签化管理的，大为方便软件内的切换。而菜单栏上右侧的 `+`号可以快速开启一个默认类型的窗口。`﹀`下拉菜单可以选择各类终端窗口。

然后看一下终端显示的内容。因为要美化的是PowerShell，我便打开了一个Windows PowerShell窗口，键入命令 `$PSVersionTable`后回车，可以看到当前PowerShell的版本号为`5.1`，仍然是老版本。之后我们要将其换成 **开源跨平台的船新版本**。请看下文~

### 安装 PowerShell

船新版本在哪里？当然看准官方发布渠道，我选了最新预览版：[PowerShell](https://github.com/PowerShell/PowerShell/releases/tag/v7.2.0-preview.8)

可以观察到，曾经的PowerShell 全名为 `Windows PowerShell`，但是现在去掉了前面的`Windows`，只留`PowerShell`一词；另外发布页的 `Assets`中也确实提供了各种平台的版本。这无疑是名副其实的跨平台了。

言归正传，从上面官方发布页中，我选择了 `7.2.0-preview-win-x64` 版本的`msi`安装包。

<div align="center"><img src="https://i.loli.net/2021/08/19/KvypYTghufJCE4H.png" alt="20210819231541" width="600" align="center"/></div>

#### 添加 PowerShell 到 Terminal

打开 Terminal，点开菜单栏右侧下拉菜单，点击`设置`；或者直接按快捷键 `Ctrl + ,`，调出设置界面，按照下图步骤添加我们安装的 PowerShell 到Terminal中：

<div align="center"><img src="https://i.loli.net/2021/08/19/6aWpghFBPXd4Djk.png" alt="20210819233300" width="600" align="center"/></div>

注意添加完后，点击`保存`。

Terminal无需重启即可即时更新配置，从下拉菜单中看到 PowerShell 7 已经添加成功。

<div align="center"><img src="https://i.loli.net/2021/08/19/6JEc9fpPvhRx5Mk.png" alt="20210819233953" width="600" align="center"/></div>

下面开始我们的美化之路。

### 美化 PowerShell

#### 安装 on-my-posh

#### 选择主题

#### 选择字体

选择了[Go Mono](https://www.programmingfonts.org/#go-mono)

#### 设置背景图

### VS Code 集成 PowerShell

### 参考

- [PowerShell 美化 - j3rry](https://www.edgeless.top/PowerShell%E7%BE%8E%E5%8C%96/)
- [Nerd Fonts](https://www.nerdfonts.com/font-downloads)
- [oh-my-push 文档](https://ohmyposh.dev/docs/pwsh)
- [Using Visual Studio Code for PowerShell Development - Microsoft](https://docs.microsoft.com/en-us/powershell/scripting/dev-cross-plat/vscode/using-vscode?view=powershell-7.2#adding-your-own-powershell-paths-to-the-session-menu)


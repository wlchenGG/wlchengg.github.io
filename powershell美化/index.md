# PowerShell美化


记录新版 PowerShell 美化过程。

<!--more-->

### 安装 Windows Terminal

可以在微软商店 (Microsoft Store) 搜索 `Windows Terminal` 安装。

商城搜索结果会有多种版本的Windows Terminal (以下将简称为Terminal)，不知选哪个的话，可直接点击此处链接 [Windows Terminal - 微软商店](https://www.microsoft.com/store/productId/9N0DX20HK701)，然后点击`获取`，弹出框中同意`打开`电脑的微软商城，跳转到软件主页后，直接`安装`即可。安装过程无需做任何选项与设置，就像在手机上的软件商城中搜索软件进行安装一样简单。

当然，如果想体验最新功能，可以去官方Github发布页获取最新预览版本：[Windows Terminal - Github](https://github.com/microsoft/terminal/releases)

安装完后的 Windows Terminal，可以在系统开始菜单找到并打开。先看一下美化前的样子。

{{< image src="https://i.loli.net/2021/08/19/bTVWEIBykK74J3Y.png" width="600" caption="美化之前的PowerShell" >}}

朴实无华，看着其实也还不错。

可以看到Terminal的多窗口是标签化管理的，大为方便软件内的切换。而菜单栏上右侧的 `+`号可以快速开启一个默认类型的窗口。`﹀`下拉菜单可以选择各类终端窗口。

然后看一下终端显示的内容。因为要美化的是PowerShell，我便打开了一个Windows PowerShell窗口，键入命令 `$PSVersionTable`后回车，可以看到当前PowerShell的版本号为`5.1`，仍然是老版本。之后我们要将其换成 **开源跨平台的船新版本**。请看下文~

### 安装 PowerShell

船新版本在哪里？当然看准官方发布渠道，我选了最新预览版：[PowerShell](https://github.com/PowerShell/PowerShell/releases/tag/v7.2.0-preview.8)

可以观察到，曾经的PowerShell 全名为 `Windows PowerShell`，但是现在去掉了前面的`Windows`，只留`PowerShell`一词；另外发布页的 `Assets`中也确实提供了各种平台的版本。这无疑是名副其实的跨平台了。

言归正传，从上面官方发布页中，我选择了 `7.2.0-preview-win-x64` 版本的`msi`安装包。下载下来安装包后，直接双击运行，会经历以下步骤，最后还有一个对话框点击`install`即可。

这个船新版本的船新 Logo 灰常 Cyber 的说。

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

打开 Terminal，然后打开一个 PowerShell 窗口。

命令行中执行以下命令安装 oh-my-posh 模块

```powershell
Install-Module oh-my-posh -Scope CurrentUser
```

#### 设置主题

安装完成后，执行 `Get-PoshThemes` 命令，将以各自主题的样式列出支持的主题。

<div align="center"><img src="https://i.loli.net/2021/08/20/fcC8YDQwJAvxX62.png" alt="Snipaste_2021-08-20_00-51-01" width="600" align="center"/></div>

其中有一些乱码，这实际是一些图标，需要安装字体包来提供图标支持，具体方法后续给出。

先进行主题设置。选择主题可以从以上命令的返回结果中选择自己中意的，然后执行以下命令就能进行安装：

```powershell
Set-PoshPrompt -Theme 主题名字
```

我们需要配置 PowerShell 的启动脚本，以使主题永久生效。执行以下命令打开脚本文件。若提示文件不存在，则同意创建。

```powershell
notepad $Profile
```

然后在打开的脚本文件中输入以下命令：

```powershell
Import-Module oh-my-posh
Set-PoshPrompt -Theme agnosterplus # 此处将agnosterplus替换为自己选主题名即可
```

<div align="center"><img src="https://i.loli.net/2021/08/20/dR6Zeak38JIFb2U.png" alt="20210820015214" width="600" align="center"/></div>

之后重启即可看到效果。

#### 设置字体

为了对主题所需的图标符号提供支持，需要 Nerd Fonts 类字体，可以到字体集合主页[Nerd Fonts](https://www.nerdfonts.com/font-downloads) 挑选喜欢的字体，可以预览字体效果。选好后直接下载字体文件即可。

<div align="center"><img src="https://i.loli.net/2021/08/20/lsOcpUwBy4xd2bL.png" alt="20210820011124" width="600" align="center"/></div>

经过一番查看，我最终凭感觉选择了[Go Mono](https://www.programmingfonts.org/#go-mono)。

将下载的压缩包直接解压缩后，是一套字体文件，由于不需要其他用途，此处只安装正体的字体。选择不带`Bold`（加粗）不带`Italic`（斜体）的`Windows Compatible`字体文件，直接双击安装。

<div align="center"><img src="https://i.loli.net/2021/08/20/gBME3FHYmD6aPky.png" alt="20210820011818" width="600" align="center"/></div>

弹出的对话窗口，展示了字体样式，直接点击左上角`安装`即可。

<div align="center"><img src="https://i.loli.net/2021/08/20/ZAouMcT3qRtKXn8.png" alt="20210820011909" width="600" align="center"/></div>

字体已经安装好，接下来在 Terminal 下按`Ctrl + ,`打开设置，从左侧`配置文件`中选择到自己新建的PowerShell，我的是 PowerShell 7 ，然后右侧选择`外观`选项卡，找到`字体`下拉菜单，选择自己所选的字体名字即可，我的为 `GoMono NF`。

<div align="center"><img src="https://i.loli.net/2021/08/20/K8gvdt7i9XWmbfz.png" alt="20210820013609" width="600" align="center"/></div>

字体名可以从系统`字体设置`查看到，`开始`->`设置`->搜索`字体设置`->搜索字体关键字'GoMono'。可以看到我的字体名为`GoMono NF`。记住这个字体名，之后 VS Code 的终端 PowerShell 配置中会再次用到。

<div align="center"><img src="https://i.loli.net/2021/08/20/WPJMpFvmrCzB6G1.png" alt="20210820013917" width="600" align="center"/></div>

#### 设置背景图

只需打开 Terminal 的设置，从左侧`配置文件`中选择到自己新建的PowerShell，然后右侧选择`外观`选项卡，找到`背景图像`设置项，`浏览`选择图片。选好图片后，下面会多出一些针对背景图的设置，包括模糊、透明、位置等，可以自行调整。

<div align="center"><img src="https://i.loli.net/2021/08/20/ycigkn2EKq3uSW6.png" alt="20210820015908" width="600" align="center"/></div>

### VS Code 集成 PowerShell

VS Code 内按快捷键 `` Ctrl + Shift + ` ``，则在编辑窗口下面会打开一个（默认CMD）终端窗口。VS Code中已经自动集成了 CMD 和 Windows PowerShell。但我需要：1. 将新版的 PowerShell Preview 集成进来；2. 将其设置为默认打开；3. 更改终端字体，以提供主题包支持。

首先`Ctrl + ,`打开设置，然后搜索`Terminal`，找到`Terminal > Integrated > Profiles: Windows`的项，点击下面的`在settings.json中编辑`。

<div align="center"><img src="https://i.loli.net/2021/08/20/vsoxaMFq5CWVApl.png" alt="20210820202923" width="600" align="center"/></div>

之后在打开的`settings.json`文件下，在`terminal.integrated.profiles.windows`项内按照以下红色框中代码的格式添加自己的 PowerShell 条目，其中的`PowerShell 7 pre`替换为自拟名字即可，`path`项内的路径替换为自己的 PowerShell 安装路径。然后**保存**并关闭文件。

<div align="center"><img src="https://i.loli.net/2021/08/20/tEZuRs32vFoNljz.png" alt="20210820202519" width="600" align="center"/></div>

通过以上操作，我们已经为终端窗口添加了新的 PowerShell。接下来将其设置为默认打开。

仍然`Ctrl + ,`打开设置，搜索`Terminal`，找到`Terminal > Integrated > Default Profile: Windows`项，下拉选项中选择我们上一步添加的 PowerShell 的名字`PowerShell 7 pre`。

<div align="center"><img src="https://i.loli.net/2021/08/20/JMjS9P6tqgGo15E.png" alt="20210820202020" width="600" align="center"/></div>

在设置页，搜索`Terminal Font`，找到`Terminal > Integrated > Font Family`项，将其值设置为我们前面安装的字体文件名 `GoMono NF`，由于我选的这款字体本身字号挺大，所以我还将字号改为了 `12`。

<div align="center"><img src="https://i.loli.net/2021/08/20/V4LHzeAhtSMnEFc.png" alt="20210820200321" width="600" align="center"/></div>

经过以上配置，最终的效果如下图。

<div align="center"><img src="https://i.loli.net/2021/08/20/a81uBoP3XWL2J9m.png" alt="20210820201644" width="600" align="center"/></div>

### 参考

- [PowerShell 美化 - j3rry](https://www.edgeless.top/PowerShell%E7%BE%8E%E5%8C%96/)
- [Nerd Fonts](https://www.nerdfonts.com/font-downloads)
- [oh-my-push 文档](https://ohmyposh.dev/docs/pwsh)
- [Using Visual Studio Code for PowerShell Development - Microsoft](https://docs.microsoft.com/en-us/powershell/scripting/dev-cross-plat/vscode/using-vscode?view=powershell-7.2#adding-your-own-powershell-paths-to-the-session-menu)
- [VS Code Integrated Terminal](https://code.visualstudio.com/docs/editor/integrated-terminal#_configuring-profiles)


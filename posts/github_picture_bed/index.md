# Github 图床 PicGo 使用


用 Github 仓库作为自用图床；用 PicGo 直接在 Typora 和 VS Code 中一键上传图床、粘贴图链。

<!--more-->

## 搭建Github图床

Github仓库支持`1G`存储容量。

### 创建Github仓库

在Github主页点击`New Repository`开始创建仓库。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506185400.png" alt="20220506185400" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

基本设置：`仓库名`，`描述`，仓库类型`public`，勾选`Add a README file`，其他保持默认即可。然后点击`Create repo`。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506190127.png" alt="20220506190127" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

然后网页会自动跳转到我们刚刚创建的仓库主页。我们要在这个仓库下面创建一个文件夹用于以后存放图片（当然不创建文件夹，直接将图片上传到仓库个目录也可以）。点击`Add file`下的`Create new file`。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506192016.png" alt="20220506192016" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

跳转到以下页面，我们按照图中方式依次输入`foldername`，`/`，`filename`，名字自己任取就行。因为这里不支持只创建文件夹，因此需要给出一个文件名。点击`Commit new file`提交更改。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506192200.png" alt="20220506192200" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

### 创建repo token

token 用于给后面我们用 PicGo 访问仓库并上传图片赋予权限。

首先在自己的头像下点击`Settings`。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506193458.png" alt="20220506193458" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

在左侧边栏往下找到并打开`Developer settings`

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506194000.png" alt="20220506194000" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

如下图，点击左侧边栏`Personal access token`，然后点击`Generate new token`

<div align="center" ><img src="https://img2.wlcheng.cc/images/image-20220506232019743.png" alt="image-20220506232019743" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

此步因为要赋予权限，因此会弹出窗口验证账号密码，填入后`Confirm password`即可。
然后就会到以下的 token 设置界面，按照图中所述进行创建即可。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506195204.png" alt="20220506195204" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

成功生成token后，马上复制下来，之后配置PicGo会用到。

<div align="center" ><img src="https://img2.wlcheng.cc/images/image-20220506232149655.png" alt="image-20220506232149655" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

通过以上过程，我们的图床算是搭建完毕了，接下来就要利用 PicGo 实现从本地上传图片，并获取图片链接。

## 配置PicGo

官方网站：[PicGo](https://molunerfinn.com/PicGo/)。此处下载稳定版本的 [PicGo](https://mirror.ghproxy.com/https://github.com/Molunerfinn/PicGo/releases/download/v2.3.0/PicGo-Setup-2.3.0-x64.exe)。下载后，按下图安装即可

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506200746.png" alt="20220506200746" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

启动后，直接左键单击托盘图标，打开PicGo设置界面

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506200941.png" alt="20220506200941" width="120" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

如下图，左侧展开`图床设置`，点击`Github图床`，右侧填入相关设置信息。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506201703.png" alt="20220506201703" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

以上填写各项的说明：

对于`仓库名`，`分支名`，`存储路径`这几项，我们已经通过前面的步骤创建了，打开如下的仓库主页面，就可以知道。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506202323.png" alt="20220506202323" width="90%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

而对于`token`，我们前面创建并已经复制了的，粘贴进来就可以。

对于自定义域名，

我们上传图片的Github官方链接是：
`https://raw.githubusercontent.com/用户名/仓库名@分支名`，可以直接通过此链接进行访问。但因为网速问题，我们往往通过 CDN 内容服务器进行访问，相当于是在全球各地建立内容缓存服务器，在访问内容时，能从就近的服务器上快速获取到内容。

使用 jsDilivr 作为 CDN 为 Github 提供加速。只需要按照以下格式填入上面的`自定义域名`框中就行：

❌`https://cdn.jsdelivr.net/gh/用户名/仓库名@分支名`

但是，由于`cdn.jsdelivr.net`遭到 DNS 污染 ([Luminous’ Home](https://luotianyi.vc/6295.html))，暂将`自定义域名`更换为：

⭕`https://fastly.jsdelivr.net/gh/用户名/仓库名@分支名`

或者其他备用：

> CloudFlare：`test1.jsdelivr.net`
> 
> CloudFlare：`testingcf.jsdelivr.net`
> 
> Fastly：`fastly.jsdelivr.net`
> 
> GCORE：`gcore.jsdelivr.net`

<font color=#FF0000>那么对于我的设置，我这里应该填入的是：</font>
`https://fastly.jsdelivr.net/gh/wlchenGG/myPictureBed@main`

填好以上信息后，点击确定即可设置成功。

我们可以测试一下，在上传区，改为 Github图床，然后上传一张图片，稍作等待，提示上传成功后，将自动复制创建好的链接（这个链接默认为markdown的，后续我们会自定义一下）。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506205131.png" alt="20220506205131" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

以下是我测试生成的默认markdown格式链接，你可以将其放入markdown文件中测试一下，是一张可正常访问的图片，说明能够正常上传。

`![](https://fastly.jsdelivr.net/gh/wlchenGG/myPictureBed@main/images/wallpaper19.jpg)`

## 配置Typora

打开Typora，按照下图设置。其中第7步选择自己安装PicGo的位置。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506220821.png" alt="20220506220821" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div>

测试一下，在Typora编辑界面，粘贴或者拖入图片时，将自动以Markdown格式插入图片，从链接可以看出图像已经上传。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506224317.png" alt="20220506224317" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

我们手头已经有很多文档，图片都是本地保存的怎么办呢。只需要完成以上设置后，通过以下选项，就可以将当前文档中的所有本地图片上传到图床中，并会自动将文档中的图片链接全部替换为图床链接。

<div align="center" ><img src="https://img2.wlcheng.cc/images/image-20220506230959338.png" alt="image-20220506230959338" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

## 自定义链接格式控制图片样式（可选）

打开PicGo，按照以下步骤设置

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506205704.png" alt="20220506205704" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

其中，自定义链接的格式（这是一段HTML代码，我们用来美化图片的显示样式。
我们给出如下几种，自行选择所需，将其粘贴到上图4的框中即可。

<style>
table th:first-of-type {
    width: 16%;
}
table th:nth-of-type(2) {
    width: 16%;
}
table th:nth-of-type(3) {
    width: 68%;
}
</style>

| 美化方式 | 效果图  | 链接格式  |
|:---:|:---:|---|
| 控制大小 | <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120"/></div> | `<div align="center" ><img src="$url" alt="$fileName" width="75%"/></div>`  |
| 圆角处理 | <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120" style="border-radius:10px;"/></div>  | `<div align="center" ><img src="$url" alt="$fileName" width="75%" style="border-radius:10px;"/></div>` |
| 图片阴影 | <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);"/></div>  | `<div align="center" ><img src="$url" alt="$fileName" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);"/></div>` |
| 阴影+圆角| <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div> | `<div align="center" ><img src="$url" alt="$fileName" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>` |
| 阴影+标题 | <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div>  | `<div align="center" ><img src="$url" alt="$fileName" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div>` |
| 圆角+标题| <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120" style="border-radius:10px;"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div> | `<div align="center" ><img src="$url" alt="$fileName" width="75%" style="border-radius:10px;"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div>` |
| 阴影+圆角+标题 | <div align="center" ><img src="https://img2.wlcheng.cc/images/wallpaper19.jpg" alt="wallpaper19" width="120" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div> | `<div align="center" ><img src="$url" alt="$fileName" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">此处插入标题</div></div>` |

其中，

`width="75%"`：控制图片大小，百分比是占整个文档宽度的比例（方便适配不同网页大小），也可以直接写成`width="300"`等整数用来控制图片的绝对大小。

`border-radius:10px;`：用来控制圆角大小。

`此处插入标题`：为图片设置标题。

配置完以上自定义链接格式后，如下图，在PicGo上传界面，选定`custom`，之后就可以退出PicGo了。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220506220650.png" alt="20220506220650" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

在Typora中，同样是拖入或者粘贴图片时，就会获取以上设置的链接到剪切板中，只需要粘贴到Typora中即可。

这里有一个问题是，Typora 粘贴图片时，始终会默认粘贴Markdown格式的图片链接，如前一小节所示。因此，我们要将Typora自动生成的删除，然后将剪切板中的自定义格式链接粘贴进去即可。如下图所示：

<div align="center" ><img src="https://img2.wlcheng.cc/images/image-20220506231341704.png" alt="image-20220506231341704" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

## 配置VS Code

### 安装 Pic-Go 插件

在 VS Code 中，安装 Pic-Go 插件，安装完成后，如下图所示填入图床配置信息：

<div align="center" ><img src="https://img2.wlcheng.cc/images/20241030162158.png" alt="20241030162158" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

### 测试图床

在任意打开的 Markdown 文件中，**先复制了图片**，然后在要插入图片位置按 `Ctrl + Alt + P`，VS Code 右下角弹窗显示上传成功，当前光标位置生成了图片链接，且能正常显示，则说明配置成功。

**注意：** 在插入图片时，不要选定 Markdown 文件中的内容，否则 Pic-Go 会处理选定的内容，而不是已经复制到剪切板中的图片。


**参考：**

[1] [从零开始免费搭建自己的博客 (五)——Typora + PicGo + GitHub/Gitee 图床](https://yushuaigee.gitee.io/2021/01/14/%E4%BB%8E%E9%9B%B6%E5%BC%80%E5%A7%8B%E5%85%8D%E8%B4%B9%E6%90%AD%E5%BB%BA%E8%87%AA%E5%B7%B1%E7%9A%84%E5%8D%9A%E5%AE%A2(%E4%BA%94)%E2%80%94%E2%80%94Typora%20+%20PicGo%20+%20GitHub%20Gitee%E5%9B%BE%E5%BA%8A/)

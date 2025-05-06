# Matlab 2021a 安装与激活


本文记录安装 Matlab 2021a 的安装过程，以及光天化日下的激活方法。

<!--more-->

{{< admonition type=information title="安装包下载" open=true >}}
- Matlab R2021a 安装包：
  
  [MathWorks 官方下载](https://ww2.mathworks.cn/products/new_products/release2021a.html) 或转自 [Robot-G](https://blog.csdn.net/GGY1102/article/details/121733746) 的 [阿里云盘](https://www.aliyundrive.com/s/BYPHMoAiLqq)

- Matlab910Win 破解工具包：
  
  https://wlcheng.lanzouo.com/iAPxr0qkwoha 密码:fcaz

{{< /admonition >}}


## R2021a安装流程


右键装载`Matlab910R2021a_Win64.iso`镜像文件：

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404091149.png" alt="20220404091149" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

打开安装程序`setup.exe`

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404091400.png" alt="20220404091400" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404091716.png" alt="20220404091716" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

在`高级选项`中选择`我有文件安装密钥`

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/1649035568(1).jpg" alt="1649035568(1)" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

点选`是`接收许可协议条款，点击`下一步`

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404092934.png" alt="20220404092934" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

输入安装密钥`09806-07443-53955-64350-21751-41297`，点击`下一步`。

{{< admonition type=information title="密钥" open=true >}}
如果是`standalone`方式，个人使用，填写密钥：09806-07443-53955-64350-21751-41297

如果是`Server`方式，作为服务器或集群节点，填写密钥：40236-45817-26714-51426-39281
{{< /admonition >}}

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404093455.png" alt="20220404093455" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

选择许可证文件：

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404094343.png" alt="20220404094343" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

选择要安装的工具包。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404095532.png" alt="20220404095532" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404095609.png" alt="20220404095609" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

安装完毕，`关闭`即可。

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404102007.png" alt="20220404102007" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

## R2021a激活流程

- 拷贝文件夹`Matlab910Win`中的`libmwlmgrimpl.dll`文件到R2021a安装位置下的路径`<matlab安装位置>\bin\win64\matlab_startup_plugins\lmgrimpl`中：

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404103117.png" alt="20220404103117" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

- 拷贝文件夹`Matlab910Win`中的`license.lic`文件到R2021a安装位置下的路径 `<matlab安装位置>\licenses`中：

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404103255.png" alt="20220404103255" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

**问题：** 安装完后，发现开始菜单的图标不能正确显示。
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404104307.png" alt="20220404104307" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

**解决：** 按照以下操作自行创建开始菜单图标即可。
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404103857.png" alt="20220404103857" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

- **参考：**

**Robot-G**, MATLAB (R2021a) 软件下载和安装教程, https://blog.csdn.net/GGY1102/article/details/121733746

## R2018安装流程

勾选`使用文件安装密钥`，进入下一步：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403184426.png" alt="20220403184426" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

勾选`是`，进入下一步：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403184511.png" alt="20220403184511" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

输入密钥：09806-07443-53955-64350-21751-41297，进入下一步：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403184651.png" alt="20220403184651" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

选择安装目录，进入下一步：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403184856.png" alt="20220403184856" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

按需选择要安装的工具箱：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403193020.png" alt="20220403193020" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403193144.png" alt="20220403193144" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403193432.png" alt="20220403193432" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

确认要安装的清单后，点击安装：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403193344.png" alt="20220403193344" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

程序安装进程：
<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220403193329.png" alt="20220403193329" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

打开看看效果

<div align="center" ><img src="https://img1.wlcheng.cc/images_for_blogs/20220404105927.png" alt="20220404105927" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>


## R2018 激活流程（TODO）


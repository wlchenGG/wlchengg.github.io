# Linux 服务器下 PyTorch 环境配置


记录在 Linux 下，Miniconda3 中配置 PyTorch 环境。

<!--more-->

## 安装 Miniconda

[Miniconda 官网](https://docs.conda.io/en/latest/miniconda.html)

### 下载安装包

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-py310_23.1.0-1-Linux-x86_64.sh
```

### 执行安装

```bash
bash Miniconda3-py310_23.1.0-1-Linux-x86_64.sh
```

输入 `yes` 同意协议；然后 `回车` 采用默认安装路径，或者手动输入指定的安装路径：

<div align="center" ><img src="https://fastly.jsdelivr.net/gh/wlchengg/PicBed@main/images_for_blogs/20230301163116.png" alt="20230301163116" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

下面询问在打开命令行时是否自动进入 conda 的 `base` 环境：输入 `yes` 后回车，然后执行 `conda config --set auto_activate_base false` 关闭自动初始化。p.s. 这样做可以免去手动添加环境变量的过程。

<div align="center" ><img src="https://fastly.jsdelivr.net/gh/wlchengg/PicBed@main/images_for_blogs/20230301164006.png" alt="20230301164006" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>

### 添加软件源（频道）

为了提高软件包下载速度，我们可以通过以下命令添加镜像软件源：

```bash
# 新加源具有高优先级
conda config --add channels source_url
conda config --prepend channels source_url #同上等效
# 新加源具有低优先级
conda config --append channels source_url
```

执行以下命令，添加清华源：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
```

查看源是否添加成功：

```bash
conda config --get channels
```

**参考：**

[1] 朱渠成, Linux 下 miniconda 的安装使用, https://www.jianshu.com/p/4d4c786ed454

[2] Conda doc, Managing channels, https://docs.conda.io/projects/conda/en/latest/user-guide/tasks/manage-channels.html?highlight=priority

[3] 普遍语法, 编辑 condarc 编辑 channel 的优先级, https://blog.csdn.net/weixin_45564533/article/details/123012930

## 创建 PyTorch 虚拟环境

### 创建 conda 独立环境

```bash
conda create -n pt python=3.10
```

### 配置 PyTorch 环境

进入创建的环境 `pt`：

```bash
conda activate pt
```

通过 PyTorch [官网](https://pytorch.org/get-started/locally/)，选择所需环境，获取安装命令并执行：

```bash
pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu
```

进入 Python 上下文环境，执行以下命令，如果能输出正确的版本号，则 PyTorch 安装成功：

```python
import torch
torch.__version__
```

<div align="center" ><img src="https://fastly.jsdelivr.net/gh/wlchengg/PicBed@main/images_for_blogs/20230301180410.png" alt="20230301180410" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/></div>


**参考：**

[4] PyTorch 安装命令. https://pytorch.org/get-started/locally/

[5] Hitesh Jethva, LCTT. Linux 系统下查看硬件信息命令大全. https://linux.cn/article-6928-1.html, 命令 `inxi -Fx` 好使

## 常用 Conda 命令

### 环境管理命令

```bash
# 创建虚拟环境
conda create --name 环境名 python=3.7 [可以指定其他需要安装的包]
# 删除某个环境
conda remove --name 环境名 --all
# 列出所有环境
conda env list
或者
conda info --envs
# 进入某个环境
conda activate 环境名
# 退出当前环境
conda deactivate
# 列出当前环境下安装的包
conda list
# 导出环境配置
conda env export > environment.txt
# 从配置文件创建新环境
conda ceate --name 环境名 --file environment.txt
# 重命名环境（克隆旧环境，删除旧环境）
conda create --name 新环境名 --clone 旧环境名
conda env remove --name 旧环境名
```

### 源（频道）管理命令

```bash
## 添加新的源
# 新加源具有高优先级
conda config --add channels source_url
conda config --prepend channels source_url #同上等效
# 新加源具有低优先级
conda config --append channels source_url
## 查看已有的源
conda config --get channels
```

**参考：**

[6] 朱渠成. miniconda的常用命令汇总. https://www.jianshu.com/p/0e9c88479cfd

[7] Fission0102. miniconda 常用命令. https://www.cnblogs.com/Fission0102/p/13998824.html


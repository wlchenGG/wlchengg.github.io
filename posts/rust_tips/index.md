# Rust 用过用法用例


记录使用 Rust 过程中的一些用法，以及用例。

<!--more-->

## 编程环境配置

### 安装

- **Windows**： 官网下载安装包 https://www.rust-lang.org/tools/install，直接运行安装，默认会安装到用户文件夹 `~/` 下，会用到的工具软件（`rustc`，`rustup`，`cargo`等）都在 `~/.cargo/bin` 中，并自动配置好环境变量。

- **Linux**：直接在终端执行命令：`curl https://sh.rustup.rs -sSf | sh`，会自动完成安装和配置。

```bash
rustc --version # 查看版本，如果没有正常输出结果，请检查以上安装、环境变量配置是否正确
```

其他安装方法和说明参考：[Other Rust Installation Methods](https://forge.rust-lang.org/infra/other-installation-methods.html)

### 更新和卸载

```bash
restup update   # 更新 Rust
restup self uninstall # 卸载 Rust
```

## 代码管理基本命令

### rustc 编译

Rust 源文件以 `.rs` 为后缀。当写完一个源文件时，可通过以下命令进行编译：

```bash
rustc ./main.rs
```

顺利编译后，将生成可执行文件 main.exe 和 main.pdb。进而可以直接执行主程序，以开始思考

```bash
./main
```

### cargo 构建和包管理工具

#### 查看版本

```bash
cargo --version
```

#### `new` 创建一个项目并进入项目目录

```bash
cargo new project
cd project
# 执行 tree 命令查看项目目录结构
project     # 跟目录放代码无关文件
│ .gitignore  # git 忽略文件过滤器，cargo 在此创建了一个 git 仓库
│ Cargo.toml  # cargo 配置文件
└─src         # 代码源文件目录
    main.rs   # 主程序源文件，放主程序源代码的地方
```

#### `build` 构建项目

在项目**根目录**下，执行下列命令

```bash
cargo build
#   输出为
#   Compiling hello_cargo v0.1.0 (E:\DevelopmentProject\Rust\hello_cargo)
#   Finished dev [unoptimized + debuginfo] target(s) in 1.66s
```

#### `run` 运行项目

在项目**根目录**下，执行下列命令

```bash
cargo run
```

将依次执行 build 和生成的 'exe' 程序：

1. 如果已有构建的 '.exe' 且没再修改源代码，则不构建，直接执行 '.exe' 程序。输出为

```bash
    Finished dev [unoptimized + debuginfo] target(s) in 0.25s
    Running `target\debug\hello_cargo.exe`
    Hello, world!
```

2. 如果已有构建的 exe 且又修改了源代码，或者没有构建，则先构建，然后执行 'exe' 程序。输出为

```bash
    Compiling hello_cargo v0.1.0 (E:\DevelopmentProject\Rust\hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.25s
    Running `target\debug\hello_cargo.exe`
    Hello, world!
```

#### `check` 检查项目

在项目**根目录**下，执行下列命令

```bash
cargo run
```

将对代码进行检查，确保能够编译，但并不生成 '.exe' 可执行文件。能大大提高效率。

可以和 `check` 的时间比较一下：

```shell
$ cargo build
    Compiling hello_cargo v0.1.0 (E:\DevelopmentProject\Rust\hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.53s

$ cargo check
    Checking hello_cargo v0.1.0 (E:\DevelopmentProject\Rust\hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.21s
```

## 一些概念和用法整理

### 量

#### 变量与不可变量

Rust 中，变量和引用默认都是是不可变量（immutable variable），要声明可变的（mutable）变量必须显示使用 `mut`。

#### 常量与不可变量

| 类别 | 英文 | 关键字 | 初始值来源 | 赋值次数 | 是否必须指定数据类型 | 命名规范 |
|--|--|--|--|:--:|--|--|
|常量|constant|`const`|常量值/常量表达式| 仅初始化 | 必须 | 全大写且下划线连接（若否则有编译器警告） | 
|不可变量|immutable variable|`let mut`|常量值/变量表达式| 仅初始化 | 非必须 | 遵循变量命名规范 |

#### 变量与隐藏（Shadowing）

一般来说，以下对 `x` 二次赋值会编译出错，这是因为 `let` 默认是不可变量：

```rust
let x = 9;
x = x + 1;  // 编译到此处会出错
```

为此，可以
**隐藏**：指可以通过 `let` 用旧变量名来声明一个新的变量，此时新的变量将隐藏旧变量。比如

```rust
// 例 1：可实现二次赋值的作用
let x = 9;
let x = x + 1;  // 用 let 声明新的不可变量，
// 例 2：新声明不可变量可以是不同的数据类型
let spaces = "-+-+-+";
let spaces = spaces.len(); //
```

这带来了以下好处，也是**隐藏** 与 `mut` 变量的区别：

- **按需赋值**（自己取的名）：隐藏可以保持变量的不可变性，提高代码的安全可维护。或许可以将其称之为“按需赋值”。而 `mut` 就随时可以对值进行改变，从安全来看具有一定的隐患。

- **数据类型可变**：隐藏实际是在创建新变量，因此可以用新的不同的数据类型。而 `mut` 虽然可以灵活赋值，但数据类型在初始化时就已固定，不能再改变，如果强制赋不同类型的值将导致编译错误。



### 范围
  
**范围表达式**：`start..=end`，表示 `start` 到 `end` 的序列。

### 格式

- 以 `.` 调用函数时，可以换行，提高可读性，比如

```Rust
    io::stdin()
        .read_line(&mut var);    // 从命令行读取输入
        .expect("读取失败！");    // 异常处理
    // 等价于
    io::stdin().read_line(&mut var).expect("读取失败！");
```

### crate

类似 Python 中的 package，Rust 中称为 crate。

在 Rust 中，项目程序是一个 `二级制crate`，而引入的外部工具包是 `库 crate`，比如 `rand`。要调库crate需要在项目根目录的 `Cargo.toml` 文件中的依赖部分 `[dependencies]` 执行库名及版本，比如：

```yaml
[dependencies]
rand = "0.8.3"
```

<div align="center" ><img src="https://fastly.jsdelivr.net/gh/wlchengg/PicBed@main/images_for_blogs/screenshots.gif" alt="screenshots" width="75%" style="box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);border-radius:10px;"/><br><div style="color:orange; border-bottom: 1px solid #d9d9d9; display: inline-block; color: #777; font-size: 90%; padding: 1px;">添加依赖 rand 时的构建过程</div></div>


### 文档


在安装 Rust 时，自动安装了离线文档，可通过以下命令打开：

```shell
cargo doc --open
```

## Rust 学习资源

[1] [Rust Book experiment](https://rust-book.cs.brown.edu/)：一本线上教程书，几乎每一节都有随堂问题，可以交互答题，巩固知识。

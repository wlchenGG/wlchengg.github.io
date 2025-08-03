# Github Token


Generate github token

<!--more-->

## 创建Token

**Warning**：Token一旦生成，无法再次查看，只能重新生成，所以一定要保存好。

- 登录Github，点击右上角头像，选择Settings
- 左侧选择Developer settings
- 选择Personal access tokens，两种方式：
  - Tokens (classic)：经典版，简单但不能选择特定仓库和权限
    - 点击右上角Generate new token
    - 设置Token名称，选择Token有效期，勾选repo
    - 点击Generate token，生成 token。
    - token 格式：`github_pat_<22位随机字符>_<59位随机字符>`
  - Fine-grained tokens：细粒度版，可以针对特定仓库和精细控制权限
    - 点击右上角Generate new token
    - 设置Token名称，选择Token有效期，选择特定仓库或所有仓库
    - 添加权限类别 `Contents`，并选择 `read and write` 权限
    - 点击Generate token，生成 token。
    - token 格式：`ghp_<36位随机字母数字串>`


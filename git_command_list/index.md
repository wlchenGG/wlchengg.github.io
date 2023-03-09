# Git 常用命令和用法


速查 Git 常用的命令和用法。分为基本（commit、branch、checkout、merge、rabase 等）和远程（clone、push、pull 等）两部分。

本文基于 [chatGPT](https://chat.openai.com/chat) 自动生成初稿（省时省力😁），并参考 [learngitbranching](https://learngitbranching.js.org/?locale=zh_CN) 进行调整。

<!--more-->

## 基本命令

`git init`：创建一个新的 Git 仓库。

`git add [file]`：将文件添加到 Git 的暂存区。

`git commit -m [message]`：将暂存区的文件提交到 Git 仓库，并添加一条注释。

`git status`：查看当前 Git 仓库的状态，包括已修改、已暂存和未跟踪的文件。

`git diff`：查看未暂存文件和最后一次提交之间的差异。

`git diff --staged`：查看已暂存文件和最后一次提交之间的差异。

`git log`：查看 Git 仓库的提交历史。

`git reflog`：查看命令历史。

`git tag [name]`：给当前的提交打上标签。

`git reset`：取消暂存或取消上一次提交。

`git rm [file]`：从 Git 仓库中删除文件。

## 分支相关

`git branch [name]`：创建一个新的分支。

`git checkout [branch-name]`：切换到另一个分支。

`git checkout -b [branch-name]`：创建同时切换到另一个分支。

`git merge [branch]`：将指定的分支合并到当前分支。

`git rebase [branch]`：将当前分支的提交步骤顺接到指定分支。

## 远程相关

`git clone [url]`：从远程仓库克隆一个副本到本地。

`git pull`：从远程仓库拉取最新的代码到本地。

`git push`：将本地的代码推送到远程仓库。

`git remote add [name] [url]`：将远程仓库添加到 Git 仓库。

`git fetch`：从远程仓库获取最新的代码，但不进行合并。

## 其他

`HEAD`：指向当前正在处理的提交记录。

`C^[number]`：表示指向提交记录 `C` 的第 `number` 个直接父记录（宽度搜索）。一个记录可能会有多个父记录（执行 `merge` 时产生）。`C^` 和 `C^1` 等价；`number`大于 1 时表示指向其他父记录。

`C~[number]`：表示指向提交记录 `C` 的回溯第 `number` 代的祖先记录（深度搜索）。

## 参考

[1] Peter Cottle. learngitbranching. https://learngitbranching.js.org/?locale=zh_CN
[2] GitHub Docs. Git Cheat Sheets. https://training.github.com/downloads/zh_CN/github-git-cheat-sheet/
[3] Visual Git Cheat Sheet. https://ndpsoftware.com/git-cheatsheet.html
[4] Blue Stragglers. 一个有趣的 Git 练习网站. https://zhuanlan.zhihu.com/p/383960650

# 

# git 知识和用法

## git 本地仓库文件夹结构

在 git repo 文件夹下，命令行执行 `git init` 初始化后，会生成一个 .git 文件夹，里面包含以下内容：

- .git/HEAD：指向当前分支
- .git/config：配置文件
- .git/description：描述文件
- .git/index：索引文件
- .git/hooks/：钩子脚本
- .git/info/：包含全局忽略文件
- .git/objects/：存储对象（commit、tree、blob）
- .git/refs/：存储引用（branch、tag）
- .git/logs/：存储提交日志

一般来说，`.git` 文件夹自动隐藏了，Power Shell 可以通过 `ls -Hidden` 命令查看。

## git 中的一些概念

### 对象（名词）

- `commit`：提交，每次提交都会生成一个 commit id，commit id 是一个 40 位的哈希值，用来唯一标识一个 commit。
- `tree`：树，每个 commit 都有一个 tree，用来存储该 commit 修改的文件和目录结构。
- `blob`：块，每个文件都会被存储为一个 blob，用来存储文件的内容。
- `branch`：分支，每个分支都有一个指向最新的 commit 的指针。
- `tag`：标签，用来标记某个 commit，通常用来标记 release 版本。
- `HEAD`：当前分支的指针，指向当前分支的最新 commit。
- `index`：索引，用来存储暂存区的文件。
- `remote`：远程仓库，用来存储远程的 git 仓库。

### `origin` 远程仓库别名

- `origin`：远程仓库的别名，通常用来表示远程仓库。可以把它看作是远程仓库的“默认地址”。
  在 Git 中，`origin` 是一个默认的远程仓库名称，它通常指向你克隆时指定的远程仓库。简单来说，`origin` 代表远程仓库的默认别名。你可以把它看作是远程仓库的“默认地址”。

1. **默认远程仓库名称**：
   - 当你克隆一个仓库时，Git 会自动把源仓库的 URL 赋给一个默认的远程名称 `origin`。
   - 例如，执行 `git clone https://github.com/user/repo.git` 后，`origin` 就会指向该 URL。

2. **查看远程仓库地址**：
   - 你可以通过以下命令查看 `origin`（以及其他远程仓库）的 URL：

     ```bash
     git remote -v
     ```
     输出示例：
     ```bash
     origin  https://github.com/user/repo.git (fetch)
     origin  https://github.com/user/repo.git (push)
     ```

3. **常见的 `origin` 用法**：
   - `git fetch origin`：从 `origin` 获取远程更新。
   - `git push origin <branch-name>`：将本地的某个分支推送到 `origin` 上。
   - `git pull origin <branch-name>`：从 `origin` 拉取并合并远程分支到当前分支。

4. **修改远程仓库名称**：
   - 如果你想给远程仓库指定不同的名称（除了 `origin`），可以使用 `git remote rename` 命令：

     ```bash
     git remote rename origin new-remote-name
     ```

5. **`origin` 只是一个名字**：
   - `origin` 只是一个约定俗成的名称，你完全可以把它改为其他名字。如果你与多个远程仓库交互，可以给每个远程仓库取不同的名字，例如 `upstream` 或 `myfork`，这样有助于区分不同的远程仓库。

总之，`origin` 是 Git 中的一个默认远程仓库别名，用于简化与远程仓库的交互。


### 操作（动词）

- `push`：推送，将本地的 commit 推送到远程仓库。
- `pull`：拉取，从远程仓库拉取最新的 commit。
- `merge`：合并，将两个分支的 commit 合并成一个 commit。
- `rebase`：变基，将一个分支的 commit 变基到另一个分支上。
- `reset`：重置，将暂存区和工作区重置到指定的 commit。
- `checkout`：检出，将工作区切换到指定的 commit。

## git 基本命令

- `git init`：初始化 git 仓库

- `git add <file>...`：添加文件到暂存区
- `git add .` 或 `git add -A`：添加所有文件到暂存区
- `git status`：查看当前 git 状态

---

- `git diff`：查看暂存区与工作区的差异
- `git diff --cached`：查看暂存区与本地仓库的差异
- `git diff HEAD`：查看工作区与本地仓库的差异
- `git diff <commit>`：查看工作区与指定 commit 的差异
- `git diff <commit> <commit>`：查看两个 commit 之间的差异
- `git diff <branch>`：查看工作区与指定 branch 的差异
- `git diff <branch> <branch>`：查看两个 branch 之间的差异
- `git diff <commit> <branch>`：查看 commit 与 branch 之间的差异
- `git diff <commit> <commit> <branch>`：查看两个 commit 与 branch 之间的差异
- `git diff <commit> <commit> <commit>`：查看三个 commit 之间的差异

---

- `git rm <file>`：删除文件
- `git mv <file> <file>`：移动文件
- `git rm --cached <file>`：删除暂存区的文件
- `git mv --cached <file> <file>`：移动暂存区的文件

---

- `git reset`：重置暂存区
- `git reset --hard`：重置暂存区和工作区
- `git reset --soft`：重置暂存区，保留工作区
- `git reset --mixed`：重置暂存区和工作区，保留 commit
- `git reset --hard <commit>`：重置暂存区和工作区到指定 commit
- `git reset --soft <commit>`：重置暂存区到指定 commit，保留工作区
- `git reset --mixed <commit>`：重置暂存区和工作区到指定 commit，保留 commit
- `git reset --hard HEAD~1`：重置暂存区和工作区到上一个 commit
- `git reset --hard HEAD^^`：重置暂存区和工作区到上两个 commit
- `git reset --hard HEAD~n`：重置暂存区和工作区到上 n 个 commit
- 撤销提交后恢复（`git reset`、`git commit --amend`、`git revert`等方式撤销/修改了原来的提交）
- 1. `git log`：查看提交日志，找到需要恢复的 commit id
- 2. `git reset --hard <commit_id>`：重置暂存区和工作区到指定 commit
- 3. `git reflog`：查看引用日志，找到需要恢复的 commit id。Git 的 reflog 记录了仓库中 HEAD 和分支头的变动历史。即使提交被撤销，它们仍然被记录在 reflog 中，只要它们还在 Git 的数据库中。
- 4. `git reset --hard <commit_id>`：重置暂存区和工作区到指定 commit
---

- `git commit -m "commit message"`：提交暂存区的文件到本地仓库
- `git commit`：提交暂存区的文件到本地仓库
- `git commit --amend`：修改最近一次提交的 commit message

---

- `git log`：查看提交日志，展示每次提交的 commit id、commit message、commit author、commit date
- `git log --oneline`：查看提交日志（简洁），展示每次提交的 commit id 和 commit message
- `git log --graph`：查看提交日志（图形化），展示提交树
- `git log --stat`：查看提交日志（统计），展示每次提交的修改文件和修改数
- `git log --pretty=format:"%h - %an, %ar : %s"`：查看提交日志（自定义格式），展示每次提交的 commit id、commit author、commit date 和 commit message
- `git log --pretty=format:"%h - %an, %ar : %s" --graph`：查看提交日志（自定义格式+图形化），展示每次提交的 commit id、commit author、commit date 和 commit message
- `git log <branch>`：查看指定分支的提交日志

---

- `git tag`：查看所有标签
- `git show <tagname>`：查看标签信息
- `git tag <tagname>`：创建轻量标签
- `git tag <tagname> <commit_hash>`：为指定 commit 创建标签
- `git tag -a <tagname> -m "tag message"`：创建带有描述的标签
- `git tag -d <tagname>`：删除本地标签
- `git push origin <tagname>`：推送标签到远程仓库。标签默认旨在本地仓库存在。
- `git push origin --tags`：推送所有标签到远程仓库
- 删除远程标签步骤
- 1. 删除本地标签：`git tag -d <tagname>`
- 2. 删除远程标签：`git push origin --delete tag <tag_name>`
- 3. 验证是否删除：`git ls-remote --tags origin`

---

- `git merge <branch>`：合并指定 branch 到当前 branch
- `git merge --no-ff <branch>`：合并指定 branch 到当前 branch，不使用 fast-forward
- `git merge --squash <branch>`：合并指定 branch 到当前 branch，将所有 commit 合并为一个 commit
- `git merge --no-commit <branch>`：合并指定 branch 到当前 branch，不自动提交
- `git merge --abort`：取消合并，回到合并前的状态
- `git merge --continue`：继续合并，解决冲突后继续合并，解决冲突后需要手动提交
- `git merge --ff-only <branch>`：合并指定 branch 到当前 branch，只使用 fast-forward
- `git merge --no-ff --no-commit <branch>`：合并指定 branch 到当前 branch，不使用 fast-forward，不自动提交
- `git merge --no-ff --squash <branch>`：合并指定 branch 到当前 branch，不使用 fast-forward，将所有 commit 合并为一个 commit
- `git merge --no-ff --no-commit --squash <branch>`：合并指定 branch 到当前 branch，不使用 fast-forward，不自动提交，将所有 commit 合并为一个 commit

---

- `git rebase <branch>`：将当前 branch 的提交应用到指定 branch 上，保留指定 branch 的提交
- `git rebase --onto <branch> <branch>`：将当前 branch 的提交应用到指定 branch 上，忽略指定 branch 的提交
- `git rebase --interactive <branch>`：交互式 rebase，可以修改、删除、合并提交

---

- `git branch`：查看当前分支
- `git branch <branch>`：创建分支
- `git branch -d <branch>`：删除分支
- `git branch -D <branch>`：强制删除分支
- `git branch -m <branch>`：重命名分支
- `git branch -M <branch>`：强制重命名分支
- `git branch -r`：查看远程分支
- `git branch -a`：查看所有分支
- `git branch -vv`：查看本地分支与远程分支的关联
- `git branch -u <remote>/<branch>`：设置本地分支与远程分支的关联
- `git branch -d -r <remote>/<branch>`：删除远程分支
- `git branch -D -r <remote>/<branch>`：强制删除远程分支
  重命名远程分支
- `git branch -m <old-branch> <new-branch>`：重命名本地分支
- `git branch -M <old-branch> <new-branch>`：强制重命名本地分支

---

- `git checkout <branch>`：切换分支
- `git checkout -b <branch>`：创建并切换分支
- `git checkout -B <branch>`：强制创建并切换分支
- `git checkout <commit>`：切换到指定 commit，即将 HEAD 指向这个commit。会提示 `detached HEAD` 警告，因为此时 HEAD 不再指向任何分支，而是指向一个具体的 commit。此时**可以进行任意修改，但不会影响其他分支**。如果需要创建一个新的分支来保存这些修改，可以使用 `git switch -c <new-branch-name>` 命令。
- `git checkout <file>`：恢复工作区文件到指定 commit
- `git checkout -- <file>`：恢复指定工作区文件到暂存区。用来放弃掉所有还没有加入到缓存区（就是 git add 命令）的修改，但是此命令不会删除掉刚新建的文件。因为刚新建的文件还没已有加入到 git 的管理系统中。所以对于git是未知的。手动删除即可。
- `git checkout -- .`：恢复工作区所有文件到暂存区。
- `git checkout -p <branch>`：比较当前分支与指定分支的差异
- `git checkout -p <commit>`：比较当前分支与指定 commit 的差异
- `git checkout -p <file>`：比较当前分支与指定文件的差异

---

- `git switch <branch>`：切换分支
- `git switch -c <branch>`：创建并切换分支
- `git switch -C <branch>`：强制创建并切换分支
- `git switch --detach <branch>`：切换到指定分支，并将 HEAD 指向这个分支
- `git switch --create <branch>`：创建并切换分支

### 远程仓库操作

- `git clone <repository>`：克隆远程仓库
- `git clone <repository> <directory>`：克隆远程仓库到指定目录
- `git clone --depth <depth> <repository>`：克隆远程仓库，只克隆最近 depth 个 commit
- `git clone --branch <branch> <repository>`：克隆远程仓库的指定分支
- `git clone --single-branch <repository>`：克隆远程仓库的单个分支
- `git clone --mirror <repository>`：克隆远程仓库的镜像
- `git clone --bare <repository>`：克隆远程仓库的裸仓库
- `git clone --depth <depth> --branch <branch> <repository>`：克隆远程仓库的指定分支，只克隆最近 depth 个 commit
- `git clone --depth <depth> --single-branch <repository>`：克隆远程仓库的单个分支，只克隆最近 depth 个 commit
- `git clone --depth <depth> --mirror <repository>`：克隆远程仓库的镜像，只克隆最近 depth 个 commit
- `git clone --depth <depth> --bare <repository>`：克隆远程仓库的裸仓库，只克隆最近 depth 个 commit

---

- `git remote -v`：查看远程仓库
- `git remote add <name> <url>`：添加远程仓库
- `git remote remove <name>`：删除远程仓库
- `git remote rename <old-name> <new-name>`：重命名远程仓库
- `git remote set-url <name> <url>`：设置远程仓库的 URL
- `git remote set-url --add <name> <url>`：添加远程仓库的 URL
- `git remote set-url --delete <name> <url>`：删除远程仓库的 URL
- `git remote update <name>`：更新远程仓库
- `git remote prune <name>`：删除远程仓库中已经不存在的分支
- `git remote show <name>`：查看远程仓库的信息
- `git remote set-head <name> <branch>`：设置远程仓库的默认分支
- `git remote set-branches <name> <branch>`：设置远程仓库的分支

- `git fetch <name>`：获取远程仓库的所有分支
- `git fetch <name> <branch>`：获取远程仓库的指定分支

- `git push <name> <branch>`：将当前分支推送到远程仓库的指定分支
- `git push <name> <branch>:<branch>`：将当前分支推送到远程仓库的指定分支，并重命名远程分支
- `git push -u <name> <branch>`：将当前分支推送到远程仓库的指定分支，并设置远程仓库的默认分支

- `git push origin --delete <branch>`：删除远程仓库的指定分支
- `git push --set-upstream origin <branch>`：设置远程仓库的默认分支


- `git pull <name> <branch>`：获取远程仓库的指定分支，并合并到当前分支
- `git pull --set-upstream origin <branch>`：获取远程仓库的指定分支，并设置远程仓库的默认分支

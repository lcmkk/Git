一、Git下载和安装
下载地址： https://git-scm.com/downloads
使用默认值安装
资源管理器内单击鼠标右键选择 Git Bash Here
输入git --version 检查是否安装成功

二、配置Git命令
注意：用户名和邮箱尽量保持和远程仓库如github绑定的邮箱和用户名一致
配置用户名：git config --global user.name "your name";
配置用户邮箱：git config --global user.email "youremail@github.com";
附：去掉引号部分适用于查看当前配置的用户名和邮箱

三、Git常用命令
1、git init 初始化git仓库
a.将工作区中的项目文件使用git进行管理，即创建一个新的本地仓库：git init；
b.从远程git仓库复制项目：git clone ; 克隆项目时如果想定义新的项目名，可以在clone命令后指定新的项目名：git clone git://github.com/wasd/example.git NewName；

2、查看文件状态
git status

3、提交到暂存区
a.提交单个文件 git add 文件名
b.提交多个文件 git add 文件名1 文件名2 ...
a.提交当前目录下所有修改文件 git add .

4、提交代码到本地仓库
a.添加注释信息并提交暂存区代码到本地仓库 git commit -m "commit_info"
b.注释写错，撤销上次提交到暂存区 git commit --amend

5、查看历史提交记录
a.查看详细信息 git log
b.信息一行显示 git log --pretty=oneline

6、版本时光机（回退操作）
a.回到历史版本 git reset --hard commitId(提交编号)
b.回到未来版本 
-- 先查看git历史操作记录  git reflog
-- 找到需要回到的未来版本的编号，再次使用回退命令 git reset --hard commitId(提交编号)
注：commitId不用写全也可，但是建议最少六位，保证提交编号唯一性

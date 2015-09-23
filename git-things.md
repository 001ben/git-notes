# Git things i learnt
Below are some notes on my process of learning git. Along with these notes, i've also written a server component to allow viewing these notes in HTML over http allowing custom css, and i've also committed these notes as i change them to a local repo.

# 1/2. Basics
Just the basics of working with git. Maybe the most common/important section though.

## Set up
- **git init** creates a new git project
- **git clone** creates clones a new git project from a url
- **git add** to add untracked files, and non staged files
- git stages are untracked, modified, and committed. Things can be untracked and modified (changes after add)
- **git status** shows current workspace/staging area, whether there are untracked or modified files and if they're in the staging area.
  - **git status -s** shows an abbreviated format


- **git diff** for diff between untracked changes and either staged or committed i think.
  - **git diff --staged** for changes between staged and previous commit.
  - **--staged** and **--cached** are synonyms


- **.gitignore** file specifies what file patterns should be ignored. File patterns are in glob format.
  - **\*** means any character repeating
  - **/** at start avoids recursivity
  - **/** at end specifies folder
  - **/folder/\*\*/.txt** specifies to ignore all .txt file under /folder recursively


- **git rm *file*** will remove files from the staged area. Just removing it won't do it properly
- **git mv *file1* *file2*** is used to rename files. Same as **mv F1.txt F2.txt & git rm F1.txt & git add F2.txt**

## All about logging
- **git log** will show you the commit history. The following args are accepted
  - **-p** will show you the diff between commits
  - **-2** will limit log to the last 2 commits
  - **--stat** will show you a summary of the commits
  - **--shortstat** will only show changed/insertions/deletions line from stat
  - **--name-only** show list of files modified after commit info
  - **--name-status** show list of files added/modified/deleted info
  - **--since=2.weeks** limits output to last 2 weeks. Accepts lots of formats
  - **--grep** searches the commit message for the string
  - **--decorate** shows which branches point to which commits
  - **--all** shows commits from all branches
  - **-S** only show commits adding or removing code matching the string
  - a path after a **--** will limit log to the commits changing files given in the path
  - **--pretty=*option*** will format the output as per option. Options include
    - oneline useful with --graph
    - short
    - full
    - fuller
    - format - this one is special, useful with --graph
- good way to see commits across all branches is **git log --oneline --decorate --graph --all**

## Oops, how do i fix it?
- **git commit --amend** should be used if you forget to add files or mess up your commit message
- **git reset HEAD *file*** removes a file from the staging area
- **git checkout -- *file*** copies the latest from the previous commit to the workspace. This is how you "undo".

## Remotes
- **git remote** shows you which remote servers are configured. If you've cloned, you should at least see origin.
  - **git remote -v** shows you the url as well.
  - **git remote add _short-name_ *url*** adds a new remote aliased by short name at the url.
  - **git remote show _short-name_** will show you information about that remote
  - **git remote rename _short-name_ _new-shortname_** renames a remote shortname
  - **git remote rm _short-name_** removes a remote. You would use this if you got rid of a server or maybe a contributor isn't contributing anymore.
  - **git clone -o _short-name_** clones into the specified repo using the given shortname instead of origin.


- **git fetch *shortname*** will fetch branches to your machine and let you access them. It will not merge the branches though.
- **git pull** will fetch and merge the latest from a tracked branch automatically
- **git push _remote-name_ _branch-name_** will push the branch to the remote repo

## Tagging
- **git log** lists all logs. Below are the modifiers.
  - **-l _search-pattern_** filters list by pattern
  - **-a _tag-name_ -m '_tag-message_'** adds an annotated tag.
  - **git log _tag-name_** is used to add a lightweight tag. Note no options used.
  - can use **git show _tag-name_** to show a tag along with it's commit information
  - **git tag -a _tag-name_ _commit-checksum_** will tag a historical commit. Only first few characters of checksum are required (enough to identify)
  - **git push _remote-name_ _tag-name_** will push a tag to a remote, since **git push** doesn't automatically push tags to remote.
  - **git push _remote-name_ --tags** will push all tags to remote server. **git clone** and **git pull** will then get tags as well.
  - you can't really checkout a tag since you can't move tags around, but you can create a branch at the commit a tag references. You do this with **git checkout -b _new-branch-name_ _tag-name_**.

## Git Aliases
- you can alias git commands for ease and familiarity
- **git config --global alias.co checkout** would alias checkout with co, so you can use **git co** to perform a checkout
- **git config --global alias.unstage 'reset HEAD --'** would add usability through allowing unstage to mean something
- **git config --global alias.last 'log -1 HEAD'** would add a last command to log the last commit. This is apparently common.
- to run an external command, use the form **git config --global alias._alias-name '!external-command'_**. Note the exclamation mark.

# 3. Branching
All about branches, remotes, tracking, deleting and merging branches.

## Git Branch Basics
- A branch is just a pointer to a commit
- **git branch _branch-name_** creates a new branch pointing to the commit you're currently on.
- **git branch -d _branch-name_** will delete a branch when you're done. Do this if 2 branches point to the same commit
- **HEAD** is a pointer to the branch you're currently on.
- **git checkout _branch-name_** switches to the branch name given. It moves head to a different branch.
- **git merge _branch-name_** merges the given branch into the current branch. You can also use **git mergetool**. If there are merge conflicts, they can be resolved on disk by changing them and adding to the staging area, then you can call **git commit** to commit the merge.

## Git Branching
- **git branch** will list all branches
  - **-v** will show you the last commit for each branch
  - **--merged** and **--no-merged** will show you only branches that have been merged, or have not been merged into the current branch respectively. Check a branch with **--merged** before deleting it.
- Topic branches can be easily created to silo work into work related to particular features. They can be created and deleted when they aren't required, and merged into other branches. Merge commits are only created if appending work over previously committed work.
- Remote references include branches and tags stored on a remote server. **git ls-remote _remote-name_** can be used to list all remote references explicitly, or **git remote show _remote-name_** can be used to show remote branches as well as other information.
- Branches need to be explicitly pushed to a remote for it to be shared. This is done using **git push _short-name_ _branch-name_**, this will create a branch on the remote if it doesn't exist. Git expands that automatically to **git push _short-name_ refs/heads/_branch-name_:refs/heads/_branch-name_**. You could additionally name the branch differently on the server using **git push _short-name branch-name:new-branch-name_**.
- If sick of typing passwords repeatedly over http, can call **git config --global credential.helper cache** which instructs to cache passwords for a few minutes.
- Fetching branches using a standard fetch command doesn't create a copy of the branch that's editable, it just fetches the remote reference. To access a branch:
  - you can merge it into current with **git merge _remote-name/branch-name_**
  - make your own branch for the remote branch using **git checkout -b _local-branch-name_ _remote-name/branch-name_**. This can be shortened **git checkout --track _remote-name/branch-name_**

## Git Tracking Branches
- when you create a local branch from a remote using checkout, it automatically creates a tracking branch (automatically updated).
- can use **-u** or **--set-upstream-to** arg to branch to set or change the tracked branch. e.g. **git branch -u _server-name_**.
- can use **git branch -vv** to see all tracking branches along with information on where that branch is relative to the rest. Note this only displays cached information, use **git fetch --all** to get latest from all remotes.
- **git pull** performs a fetch followed by a merge automagically. It's generally better to do the commands separately.
- Remote branches can be easily deleted using **git push _remote-name_ --delete _branch-name_**. This deletes the ref, but the data will generally be kept for a while before removing it so it can easily be recovered.

## Git Rebasing
- **git checkout _topic-branch-name_** followed by **git rebase _base-branch-name_** will rewrite the commit history of _new-branch-name_ to include the history of _branch-name_.
  - if _base-branch-name_ is checked out, you can rebase and checkout _topic-branch-name_ using **git rebase _base-branch-name_ _topic-branch-name_**
- Often used to apply commits cleanly on a remote branch. This command effectively updates the commit the topic branch is based off, and keeps the commit history clean.
- DO NOT rebase commits that exist outside of your repository (i.e. nothing that you've pushed already)
- if you end up with a screwed commit history (with you referencing commits via merge that aren't referenced on the server due to a rebase), then performing another rebase will determine what is unique to your branch and what isn't a merge commit, then rebase those onto unique commits of the rebase branch.
- can use **git pull --rebase** to do all this cleanly.
- rebase is good for keeping the commit history clean, but merge maintains information about what was actually developed on what branch. Both are necessary in different situations, so what this is used for is very team based. Good practice is to rebase all local changes before committing them.

#Git on the server

## Protocols
Protocol options include:
- Local protocol, specified as **git remote add local-proj _/path/to/file_**
  - Simple, easy to use, may not be the fastest. Using  file:/// slows it down.
- Http protocol, specified as **git remote add http-proj _http://example.com/project.git_**
  - Smart http lets lots of actions be performed on one url.
  - Allows authentication
  - Can be a pain to set up
- SSH protocol, specified as **git remote add ssh-proj _ssh://user@server/project.git_** or **git remote add ssh-proj _user@server:project.git_**
  - Can't serve anonymous access with it, would need to use with something else.
  - Fast and has good encryption/authentication features.
- Git protocol, specified as **git remote add git-proj _git://example.com/project.git_**.
  - Often the fastest protocol.
  - No authentication.
  - Difficult to set up owing to requiring it's own daemon and having an obscure port unblocked.

## Server Setup
Adding a repository to a server that has ssh access is super easy.

1. Get a bare clone of your repo, using the **--bare** switch.
  - Standard is for this folder to end in **.git**
2. Copy the bare repo to the server. Can be performed with **scp -r _project_.git _user_@_url_:/opt/git/_project_.git**
3. To allow group write permissions for a repo, ssh to the server, and run **git init --bare --shared** inside the project directory. Write access to the server will allow anyone with ssh access to push to the server.

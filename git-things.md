# git things i learnt
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
  - **-S** only show commits adding or removing code matching the string
  - a path after a **--** will limit log to the commits changing files given in the path
  - **--pretty=*option*** will format the output as per option. Options include
    - oneline useful with --graph
    - short
    - full
    - fuller
    - format - this one is special, useful with --graph

## Oops, how do i fix it?
- **git commit --amend** should be used if you forget to add files or mess up your commit message
- **git reset HEAD *file*** removes a file from the staging area
- **git checkout -- *file*** copies the latest from the previous commit to the workspace. This is how you "undo".

## Remotes
- **git remote** shows you which remote servers are configured. If you've cloned, you should at least see origin.
  - **git remote -v** shows you the url as well.
  - **git remote add _shortname_ *url*** adds a new remote aliased by short name at the url.
  - **git remote show _shortname_** will show you information about that remote
  - **git remote rename _shortname_ _new-shortname_** renames a remote shortname
  - **git remote rm _shortname_** removes a remote. You would use this if you got rid of a server or maybe a contributor isn't contributing anymore.


- **git fetch *shortname*** will fetch a branch to your machine and let you access it. It will not merge the branches though.
- **git pull** will fetch and merge the latest from a tracked branch automatically
- **git push _remote-name_ _branch-name_** will push the branch to the remote repo

## Tagging
- **git log** lists all logs. Below are the modifiers.
  - **-l _search-pattern_** filters list by pattern
  - **-a _tag-name_ -m '_tag-message_'** adds an annotated tag.
  - **git log _tag-name_** is used to add a lightweight tag. Note no options used.
  - can use **git show _tag-name_** to show a tag along with it's commit information
  - **git tag -a _tag-name_ _commit-checksum_** will tag a historical commit. Only first few characters of checksum are required (enough to identify)
  - **git push _tag-name_** will push a tag to a remote, since **git push** doesn't automatically push tags to remote.
  - **git push _remote-name_ --tags** will push all tags to remote server. **git clone** and **git pull** will then get tags as well.
  - you can't really checkout a tag since you can't move tags around, but you can create a branch at the commit a tag references. You do this with **git checkout -b _new-branch-name_ _tag-name_**.

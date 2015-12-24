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
- can use **-u** or **--set-upstream-to** arg to set or change the tracked branch. e.g. **git branch -u remote-branch-name_**.
- can use **git branch -vv** to see all tracking branches along with information on where that branch is relative to the rest. Note this only displays cached information, use **git fetch --all** to get latest from all remotes.
- **git pull** performs a fetch followed by a merge automagically. It's generally better to do the commands separately.
- Remote branches can be easily deleted using **git push _remote-name_ --delete _branch-name_**. This deletes the ref, but the data will generally be kept for a while before removing it so it can easily be recovered.

## Git Rebasing
- **git checkout _topic-branch-name_** followed by **git rebase _base-branch-name_** will rewrite the commit history of _topic-branch-name_ to include the history of _base-branch-name_.
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
2. Copy the bare repo to the server. Can be performed with **scp -r _project_.git _user_@_url_:_/path/to/project_.git**
3. To allow group write permissions for a repo, ssh to the server, and run **git init --bare --shared** inside the project directory. Write access to the server will allow anyone with ssh access to push to the server.
4. Add the remote with **git remote add _short-name_ _user_@_url_:_/path/to/project_.git**.
5. Add any tracking branches required with **git branch -u _remote-branch-name_**

This is good when there are only a few developers and an SSH enabled server is available.

On the server, SSH access is required. This can be accomplished with:
- Multiple accounts set up on the server with access to the folder.
- A Single **git** account set up on the server, then just add the public key generated by each user to the server.
- Authenticate users with an LDAP server or something else to allow them access. Whatever will get the user shell access on the server will work.

## How to SSH
- Check you don't have a key already in **~/.ssh**
- Generate key on client side with **ssh-keygen**

If using the git user method to authenticate people on an ssh server
- make the git user with something like **sudo adduser git**
- navigate to home directory for git user
- make a **.ssh** directory and assign full access to just the owner (the git user)
- make an **authorized_keys** file and assign read/write priveleges to just the user
- append any public keys that should have access to the authorized_keys files, you can use something like **cat _/path/to/key.pub_ >> ~/.ssh/authorized_keys**.

To restrict the git user to only having access to git commands, a git shell is available that can be set as the login shell.
- Check if git-shell is already in system with **cat /etc/shells**.
- If git-shell isn't listed then check if it's installed with **which git-shell**
- Add the path to the **etc/shells** file found from the last command.
- Change the shell for the git user with **sudo chsh git _path-to-git-shell_**. The path to the git shell is usually /user/bin/git-shell.

The git shell will reject ssh attempts, and the message can be customized for users.

## How to git daemon
This is the option for fast unauthenticated access to your git repo. Run **git daemon --reuseaddr --base-path=_/opt/git/ /opt/git/_** in a daemonized manner to start a git server.
- **--reuseaddr** allows the server to restart with waiting for old connections to time out.
- **--base-path** allows users to clone projects without specifying the entire path
- Final path tells the git daemon where to look for repositories.
- port 9418 will need to be unblocked as well.

To daemonize the process, if it's an ubuntu machine, you would add a script to **/etc/event.d/local-git-daemon**, then add the following script:
```bash
start on startup
stop on shutdown
exec /usr/bin/git daemon \
  --user=git --group=git \
  --reuseaddr \
  --base-path=/opt/git/ \
  /opt/git/
respawn
```
It's encouraged to create a new user called **git-ro** for example with read only priveleges, and to run the daemon as this user.

When the machine is rebooted, the daemon will run. To start the daemon without rebooting, run **initctl start local-git-daemon**.

The final step in allowing access to git repositories is adding a file named **git-daemon-export-ok** to the bare folder of any hosted git repositories.

## HTTP Server
The concept behind a http server is that git provides a git-http-backend CGI script which will do the negotiation to send and receive data over HTTP.

A node package exists to run a git server. Install via **npm install git-server**. [More info](https://github.com/stackdot/NodeJS-Git-Server).

## Git over the Web
After setting up git on a server, it's frequently desirable to have some sort of visual.
Git includes something called GitWeb, that provides a web interface for this.

Easy setup: **git instaweb** (not available on windows)
Permanent setup:
- Some linux distros have a **gitweb** package you can install with apt-get
- Git clone method:
  - **git clone git://git.kernel.org/pub/scm/git/git.git**
  - **cd git/**
  - **make GITWEB_PROJECTROOT="/opt/git" prefix=/user gitweb**
  - **sudo cp -Rf gitweb /var/www/**
  - make the web server use the cgi script, located in the directory you copied gitweb to, titled **gitweb.cgi**
  - when running, you should now be able to navigate to http://gitserver/ to view online repositories.

GitLab is a popular web front end for git backed by a database which allows users to interact with git on the server, like create repos, check history, manage commits and pull requests, so on.

# 5. Distributed Workflows

- Centralized repository

One shared repository is accessed by all developers publicly.

- Integration-manager workflow

Project maintainer pulls contributor forks into their own repository. Their repository is public to pull from and private to push to.

- Dictator and Lieutenants workflow

Sort of an extension of the Integration-manager, there is a dictator whose master branch is rebased on by all developers before pushing. Lieutenants will rebase developers work on their branches, while the dictator will rebase lieutenants work on their master branch, before pushing to the public repo so developers can rebase on it again.

This workflow isn't common, but can be useful in very big projects, or in a hierarchical environment. Allows project leader to delegate the work and collect large subsets of code at multiple points.

## Contributing to a project

How you should contribute depends on:
- number of active developers
- Workflow in use?
- do you have write access?
- How does the project accept contributed work?
- How often do you contribute?

### Commit Guidelines
Having a good guideline for commit messages allows your commits to be of high quality and the most useful for the project.

- Avoid whitespace errors, run **git diff --check** to catch and list any potential whitespace errors
- Don't commit lots of unrelated changes, try and keep related work committed in logical packages.
- Write a good commit message. First line should be < 50 chars, followed by blank line, followed by paragraphs of explanatory text wrapped at 72 characters or so.

### Private small teams
This is when one repository is shared by a few developers who all have push access to the repository.
Developers have to merge locally with changes from the server that were pushed since they started making changes.

The workflow is that you work for a while, generally on a topic branch, merge to master when ready to integrate, fetch and merge master from server, then push your work.

### Private managed teams
In a larger setup where multiple groups of people work on separate features, you might use a type of integration-manager workflow, where the work of the individual groups is integrated only by certain engineers who have access to the main repository. All work is team based, and the team based branches are pulled together by the integrators later.

### Forked Public Project
In this contribution model you'll fork the project, create a feature branch and work on that, then push your topic branch to your fork (this is recommended rather than merging with your fork master).
After producing some work ready to be contributed back to the original repo, either use the site pull request option, or run the git request-pull command and send an email the output to the project maintainer manually.
It's much easier when working like this to have a master branch that tracks origin/master, and do all work in topic branches. Feature branches should always be based from master (when possible), enabling topics to then be cleanly switched between and siloed so it's easy to rebase them.
If rebasing a feature branch from the origin/master branch, you can use **git push -f _fork-repo-name_ _feature-branch_** to overwrite the server commit history with a non-descendant commit.

An advanced scenario: You've pull requested a feature branch, and the maintainer wants you to make a change and update the feature branch from origin/master. You create a new feature branch from origin/master, and run **git merge --squash _original-feature-branch_** to perform the merge but place all the commits into the staging area so they're all part of a single commit that you can perform additional changes on when you do commit.

### Public project over email
You can contribute to some projects over email (instead of having your own public fork). Workflow is similar in that you create topic branches for each feature, except you contribute by generating an email version of your commit history and sending it to the developers mailing list. Use **git format-patch -M _base-branch_** to turn each commit since the _base-branch_ into an email message with the first line of the commit as the subject, and the commit message/patch info as the email body.

You can edit the patch files to add more information for the mailing list that you don't want in the commit message by adding it between the first __---__ line, and the line with __diff --git__, which won't add any extra info to the actual commit. Once the email file has been generated, you can copy paste it into an email program (which may screw up), or send it via a command line program, though pasting often can cause formatting issues.

Git provides a tool which allows you to send formatted patches via IMAP. First, the imap section of .gitconfig needs to be setup similar to below either with git config commands or just manual editing. If the IMAP server doesn't accept SSL, the last 2 lines probably aren't necessary and it will be **imap://** instead of **imaps://**
```
[imap]
folder = "[Gmail]/Drafts"
host = imaps://imap.gmail.com
user = user@gmail.com
pass = p4ssw0rd
port = 993
sslverify = false
```

Now that it's configured, you can pipe in text and it will copy it to the folder specified in the imap folder like so: **git cat *.patch | git imap-send**. Finally, go to the specified imap folder in gmail, change to "To" field of the email, and send it to the dev mailing list and possibly CC the maintainer, it's that easy.

SMTP is configured similarly, except your config looks as below and you'll be prompted for email addresses when **git send-email *.patch** is used.
```
[sendemail]
smtpencryption = tls
smtpserver = smtp.gmail.com
smtpuser = user@gmail.com
smtpserverport = 587
```

## Maintaining a Project
It's generally a good idea to create topic branches for integrating your work on, before merging it with longer-term branches. Append the branch name with a namespace, such as the initials of the person whose work you're integrating using, for example **git branch sc/_branch_name_ _base-branch_**.

### Applying emailed patches
There are two ways, **git apply** or **git am**.

Using **git apply** should be used on patches generated with a git diff or unix diff (recommended to avoid this), just apply it using **git apply _/path/to/dir/filename.patch_**, which takes the changes and applies them to the staging area maintaining all information, and reverting if the patch fails. You can use **git apply --check** to test if the patch will apply before actually applying it.

Using **git am** accepts the output of **git format-patch**, and is much easier to perform as it maintains commit information as well. Get the patch files on the pc in the mbox format, then run **git am _/path/to/file/mboxfile.patch_** to apply a patch. If you save a whole series of patch emails to a file in mbox format, pointing **git am** to the file will apply all patches in turn.

In patches, the author of a commit is the person who actually performed the commit, while the "Commit" field indicates the person who applied the patch.

If there is an issue with a patch, it will add the markers so you can fix the file, stage it (**git add** it), the run **git am --resolved** to mark it as resolved, similar to a patch.

Calling **git am -3 _/path/to/file.patch_** if you have the commit the patch was based on installed is generally much smarter about merging. Calling it with the **-i** switch enters interactive mode which prompts for each patch in the file whether it should be merged or not.

When all patches are in your topic branch, you can then decide how to integrate it into the main branch(es).

### Checking out remote branches

If you have access to the contributors remote repository, you can add it as a remote then checkout a remote branch with **git checkout -b _alias-name_ _namespace/branch-name_**.

Checking out a remote branch is the most useful method if you're working with particular people consistently. If a patch is a one off contribution, emailing the patch might be a lot easier than everyone having to run their own server and host a public repository, and add/remove remotes for every patch. If you do want to access a remote for a one-off patch, you may call **git pull _http://url-to-project_** to do a one-off pull without adding a remote.

### Determining what work has been introduced

Use **git log _branch-name_ --not _base-branch-name_** to see all commits introduced on _branch-name_ since _base-branch-name_. Don't forget the -p option to see the diff's of each commit.

To get the overall diff between 2 branches (the topic branch and master branch in an integrators situation), you would determine the ancestor commit so that you don't get a weird diff, and do a diff between that commit and the topic branch commit.

- Verbose way: **git merge-base _contrib-branch_ _base-branch_**, then take the output hash and run **git diff _common-hash_** to do the expected diff operation.
- Nice way: **git diff _base-branch_..._contrib-branch_**

### Integrating contributed work

- Merging workflow involves topic branches just being merged into main with the creation of a merge commit for each merge operation. Whether you merge into master immediately, or a develop branch and then fast-forward master to develop when you're sure the changes are stable is up to you.
- Large merging workflows. The git project has branches: **master**, **next**, **pu** (proposed updates) and **maint** (maintenance backports). The maintainer merges topic branches into next if they're stable enough, or pu if they aren't.
- Rebasing works much the same as the merging workflow except you rebase onto master (or develop) from the topic instead of merging.
- Cherry picking worklfow is a method of rebasing for a single commit rather than all in a branch. After all commits have been cherry-picked to be included in the master or dev branch, you can delete the topic branch. This is useful if there are a number of commits and you'd like to select only particular commits to include. Command for cherry picking is **git cherry-pick _commit id_**.

If maintaining a long running topic branch, or doing lots of merging/rebasing, there's a feature called rerere (reuse recorded resolution) which resuses previous conflict resolution when attempting to resolve future conflict resolution in case a previous conflict is similar to a future conflict. It can be enabled with **git config --global rerere.enabled true**, and can be interacted with using **git rerere**.

### Tagging releases
When a release has been decided on, you should probably tag it so you can recreate the release whenever you want. If you want to screw around with tag signing, consult [git-scm](https://git-scm.com/book/en/v2/Distributed-Git-Maintaining-a-Project#Tagging-Your-Releases).

### Generating a build number
As git doesn't track version numbers like V1.1.2 or anything like that, there's a command which supports this kind of versioning. Calling **git describe _branch-name_** gives you the name of the nearest tag with the number of commits on top of that tag. The command favors annotated tags, so release tags should be created this way if using git describe.

### Preparing a release
When releasing a build, there's a command for generating an archive. The following will generate a tarball.
**git archive master --prefix='project/' | gzip & gt ; 'git describe master'.tar.gz**

To generate a zip, use the below.
**git archive master --prefix='project/' --format=zip &gt; `git describe master`.zip**

### Shortlog
The shortlog generates a summary of all the commits in the given range for a branch, and is useful for summarising releases. You would run this command like **git shortlog --no-merges master --not _last-release-tag_**.

# 6. GitHub

## Basic stuff

You can access github with ssh easily by adding your public key to github. Name the key appropriately then copy your id_rsa.pub to github to allow ssh access.

GitHub verifies your commits based on email, so add all your email addresses so that GitHub can properly link your commits with your account.

You contribute to a project by forking it and creating a pull request. You can create pull requests for branches within the same repo. Merging from a pull request on GitHub will also always perform a non fast forward merge (creates a merge commit), you could always merge it locally though.

## Advanced Pull Requests
GitHub doesn't think of a pull request as a perfect series of changes, pull requests are often incomplete and are used for discussion about a proposed change, this way all the decisions made on a contribution are kept in tact. This is also why merging from GitHub never performs a fast forward merge, as it will still be referencing the pull request commits.

Github will let you know if a pull request will merge cleanly. If not, it should be fixed so the project maintainer doesn't have to do anything. To fix merge issues for a pull request, you can rebase off the main branch (usually master), or you can merge back into your pull request branch. Merging is far more common as it's less error prone and will keep the history. To perform this, add the original repo as a remote, fetch from it, merge the master branch into the pull request branch and fix any issues before pushing again.

If you really insist on rebasing to fix the errors, don't do it on the pull request. Rather, create a new branch from the target branch, rebase that branch, push it up to the server as a new branch and create a new pull request referencing the old pull request. This will avoid the "Perils of rebasing" section.

### Referencing other pull requests
Pull requests and issues all have a unique hash tag ID that you can type in any comment or description to cross reference within.

You can use #<num> to reference an issue or pull request in the same repo.
You can use <username>#<num> to reference an issue or pull request in a fork of the current repo.
You can use <username>/<repo>#<num> to reference something in a different repo.

You can reference commits with their SHA-1, but you have to use the full 40 character SHA-1.

## Github Flavored markdown
Task lists syntax (- [x] and - [ ], note the space before and inside the brackets):
- [x] one
- [ ] two
- [ ] three

Code snippets syntax:
```java
public void main() {}
```

Quoting syntax:
> line being quoted
> another line

note: this can also be accomplished by highlighting some text and pressing r.

Emoji syntax:
:joy:

note: when you start typing, it will have an autocomplete pop up.

Images:
You can drag and drop images onto a field to generate the markdown for the image.

## Collaborating on pull requests
Emails notify you of pull requests and conversations on pull requests. you can reply to the email to comment on the entire pull request.

You can merge through GitHub (which will always create a merge commit), or you can pull the changes locally and merge locally then push back up.

You can pull in pull requests manually using the url, or you can run **git ls-remote origin**, and look through all the references in the **refs/pull** folder. You can fetch the head references from origin, or you can add a line in the git config for the origin remote which automatically fetches these refs every time you fetch from origin. This makes it easy to checkout and merge pull requests.

Add the below line to .git/config under the [remote "origin"] section to setup automatic pull request fetch.
fetch = +refs/pull/*/head:refs/remotes/origin/pr/*

Then you can switch to any pull request with **git checkout _pr#_**

The ref in the form of **refs/pull/#/merge** represents the commit that would result if the "merge" button was pushed on GitHub, giving you an easy way to test the merge before it's performed.

Finally pull requests can be opened for any branch in any repository or fork, even on other pull requests.

## Mentions and notifications
You can start typing the @ symbol to mention anyones name on GitHub, this will notify them. If someone gets mentioned, they will be subscribed to the pull request.

## Special Files
README files will be read and rendered on the front page regardless of their extension (may as well use markdown for the GitHub flavoured markdown).

CONTRIBUTING allows you to specify things that you do or don't want people to account for when opening pull requests, and will suggest people read the guidelines when opening a pull request.

## Organizations
Like user accounts organizations can have repositories made for them. Organizations are owned and managed by a number of people who can create repositories for either their personal accounts, or their organizations.

People are grouped under teams in organizations, which are given access to the repositories via teams. This makes it easy to manage who has access without worrying about individual access. You can mention teams like you can mention users, and this notifies everyone in the team.

Organizations also have an audit log for events which have happened at an organization level.

## Scripting GitHub
You can add services to do a lot of different tasks, such as send emails when someone pushes to the repository, or to start a Jenkins test.

Webhooks work by sending a payload to a specified url on selected events. Generic and simple jah? GitHub also logs if the hooks were successfully delivered or not, making it easier to debug.

You can access a wide array of GitHub API endpoints through https://api.github.com, including user, project, repo, issue and commit information. You can even access gitignore templates, for example https://api.github.com/gitignore/templates/Java.

To access more sensitive information, you can do the same as google and get an application token authorized for particular scopes. Without authenticating, you can make 60 requests per hour, with authentication, you can make 5000 requests per hour. You can use the api to do just about anything on GitHub, making it very powerful and scriptable.
There's a cool example of setting up a webhook to validate that the commit message contains a certain string, and failing the commit if it doesn't.
Octokit provides a fairly easy GitHub api for a bunch of languages. Find out about these at https://github.com/octokit.

# 7. Git Tools
## Revision Selection
Git lets you select commits or a range of commits a few different ways

- Single commit: Specified by the SHA-1, just include enough characters that it isn't ambiguous. 4 or 5 should be enough. Running **git log --abbrev-commit --pretty=oneline** will show you the shortest SHA-1's you can use, defaulting to 7 characters if possible.
- Branch Reference: If a branch is pointing to a commit, it's interchangeable with the commit SHA-1. You can use **git rev-parse _branch-name_** to get the SHA-1 of the commit the branch points to.
- Reflog Shortname: The reflog (**git reflog**) stores a history of where HEAD was. You can access this historical information like **git show HEAD@ {5}** which will show where HEAD pointed 5 entries ago, or **git show HEAD@ { yesterday }** to show where HEAD pointed yesterday. This only works for data that's in the reflog, i.e. it can't be more than a few months ago. The same syntax can be used on branches for the same effect, i.e. **git show master@{5}**. You need to quote the master@{5} bit in powershell, otherwise the curly braces evaluate within powershell. The reflog is strictly local, i.e. it's only as old as when you cloned it.
- Ancestry References: Placing a ^ at the end of a reference will resolve to the parent of a commit. For a merge commit, commit^ will be the commit on the branch you were on when you merged, and commit^2 will be the branch which was merged in. ~ is also ancestry, but works like a recursive ^ rather than splitting. So HEAD~3 would be the same as HEAD^^^.
- Double Dot Range: Gets the commits that are reachable by one branch, but not reachable by another. I.e. **git log master..experiment** would show the commits that are on experiment but not on master. Reversing the names would show the opposite. This is also used to see what you're about to push to a remote. Git also allows you to specify not reachable with ^ and --not. So saying **git log ^master experiment** would also be equivalent. The ^ and --not syntax lets you specify to show multiple branches with commits not reachable.
- Triple Dot Range: This shows you commits that are reachable by either of the references, but not both. I.e. **git log master...experiment** will show commits only on master, and commits only on experiment. Running the command with --left-right will show which branch the commits are on, making it more useful. I.e. **git log --left-right master...experiment**.

## Interactive staging
Git adds tools to helps you select which commits to stage so when commiting changes, you can make several focused commits rather than one big messy commit.

Running git add with -i or --interactive will put git into an interactive shell mode. Use 2/u to add files to the staging area, 3/r to unstage a file, and 6/d to run a diff on any staged files.
Using the option of 5/p (patch) will allow you to stage parts of a file. It will ask which parts of the file you want to stage 1 by 1. Typing ? shows what you can do, there's lots of options. After running this option, or even the same script via **git add -p**, you can just commit and the parts of the file will be committed. You can also use patch to partially reset files with **git reset --patch**, to checkout files with **git checkout --patch** and to stash parts of files with **git stash save --patch**.

## Stashing and Cleaning
Stashing is a way to store half finished work without having to commit so you can switch branches.
**git stash** or **git stash save** will store the work.
**git stash list** will show you stashed work.
**git stash apply** or **git stash apply stash@{_number_}** will apply a stash to the working directory.
**git stash apply --index** will apply staged changes back to the staged area.
**git stash drop stash@{0}** will drop a given stash number.
**git stash pop** will apply a stash, then delete it immediately.

**git clean** will remove everything from your working directory, staged, unstaged, tracked, untracked. It's safer to use **git stash --all** to remove everything but save it in a stash.
**git clean -f -d** will force the clean operation and remove empty directories as well.
**git clean -d -n** will show you what would be deleted (i.e the -n) flag specifies this.
**git clean -x** will even remove files that are ignored.
**git clean -i** runs it interactively.
Always check with the clean commands with -n before running it, as you can't get that work back.

Extra options:
**git stash --keep-index** won't stash anything added to the staging area.
**git stash --include-untracked** or **git stash -u** stashes untracked files as well
**git stash --patch** will interactively walk you through stages you would like to stash, diff by diff.
**git stash --all** will stash everything.
**git stash branch _branch-name_** applies the stashed changes on a new branch for you, so you can test them on that. Useful if changes won't apply cleanly to the original branch.

## Signing
There are options in git for signing both tags and commits, and configuration options for only accepting commits which are properly signed for both merge and pull commands. The signing operations use and rely on gpg, which works off public/private key encryption. [Read get-scm for more](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work).

## Searching
- **git grep** searches for a string or regular expression in the working directory.
  - You can pass -n to print out the line numbers.
  - The --count option summarises which files matched and how many matches were found in each.
  - The -p flag will return the method or function each match was found inside.
  - The --and flag ensures that multiple phrases are found in the same line.
  - The --break and --heading options can help to better format the output
- **git log** allows searching for which commit introduced a particular change.
  - The -S arg can be used to find which commits a given term was introduced. Commands are structured as follows: **git log -S_term_**.
  - The -G arg is like the -S argh, but it allows regex.
  - The -L arg will show you which commits changed a particular function, which is frign awesome :O. You'd use it like **git log -L :myFunctionName:myFileName.cs** and it would find you all the commits which modified that function, and what the changes are. You can modify this command to take custom regex for matching start and end bounds, or a number of lines, or a single line number.

## Rewriting History
- Changing the last commit message: Using the **git commit --amend** command lets you modify the previous commit message in case you made a mistake.

- Changing the last commit contents: add or remove files to the staging area, and call **git commit --amend** to change the contents of a commit. You need to treat this like a small rebase though, because it will change the commit message and therefore you should not do this if you've already pushed a commit to the server.

- Changing multiple commit messages/contents: An interactive rebase will do the trick on top of the HEAD you're already on. For each commit during the interactive rebase, you can change the message and/or contents of the commit. As with any rebase though, this should not be done if the commits being rebased are already on the server, as developers can get confused having alternate versions of the same change. You perform an interactive rebase using **git rebase -i HEAD~3** to rebase the last 3 commits (note you're providing the SHA-1 of the PARENT of the commit you want to change, i.e. that's the fourth commit).
  - In the interactive rebase, change the word next the commits wished to be changed from pick to edit, then save and close the text file and follow the prompts to modify the files.
  - The interactive rebase lets you reorder or remove commits entirely just by changing the order or what's included in the text file.
  - Selecting squash merges a commit with the previous commit to make a single commit representing both.
  - To split a commit, put edit on the particular commit, then when at the command line, reset the workspace to the parent of head **git reset HEAD^**, then you add whatever files you want in the first commit, and you commit it like normal, repeat for other commits in the split operation, then finally call **git rebase --continue** to continue the interactive rebasing process.
  - Remember with all of these, to never do it if the commits are on the server already.

- filter-branch: Super powerful command for rewriting large amounts of commits
  - Removing a file from every commit: You'd use this if you're removing some huge binary file from every commit, or if you committed a file containing a password and you want the project to be open source. E.g. you want to remove a file called passwords.txt from the entire history, you would run **git filter-branch --tree-filter 'rm -f passwords.txt' HEAD**. Another example, if you wanted to remove all accidentally committed editor backup files, you'd run **git filter-branch --tree-filter 'rm -f *~' HEAD**.
  - When removing files like this, you should do it on a test branch and hard-reset your master branch after you've determined that the outcome is what you want.
  - Making a subdirectory the new root: In case you've imported from some source which includes subdirectories that don't make sense to keep, you can make a subdirectory the new root by running filter branch like **git filter-branch --subdirectory-filter _directory-name_ HEAD**. Your commits now only have what was changed in the _directory-name_, and all commits dealing with other directories are automatically removed.
  - Changing your email address on all commits: You would do this if you forgot to properly config your email address, or if you wanted to open source a work project and wanted to change all work email addresses to a personal email address. You would do this as below, though note that this changes every SHA-1 in the history, not just those that have changed email addresses:
  ```bash
      git filter-branch --commit-filter '
        if [ "$GIT_AUTHOR_EMAIL" = "schacon@localhost" ];
        then
                GIT_AUTHOR_NAME="Scott Chacon";
                GIT_AUTHOR_EMAIL="schacon@example.com";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi' HEAD
  ```

## Reset and Checkout
- Reset
Reset is a way of updating a branch pointer to a different commit (i.e. undoing work).
  - **git reset --soft _commit-reference_** will only update the branch pointer and leave the index and working directory.
  - **git reset --mixed _commit-reference_** or running with no arguments updates the index as well (i.e. unstages all current changes that were staged in the last commit).
  - **git reset --hard _commit-reference_** overwrites the working directory. This is the only reset command which actually removes data, so use it sparingly or not at all. If the working directory work has not been committed, it will be permanently removed. Anything committed can be recovered, but things only in the working directory can not be recovered if they're deleted.
 - **git reset _commit-reference_ _/path/to/dir_** will not update the HEAD ref, but it will do the other 2 reset steps depending on what you specify (index and working directory) for the specified path. If you point to a different commit than HEAD, it will restore that to the index, which if you commit will revert it back to v1 without having it in the working directory.
  - You can run git reset with a --patch option to only unstage parts of files.
  - You can squash a change into a more succinct change (i.e. skipping a partial change commit) by just soft resetting to the first commit you want to keep, and simply committing your current index with all the finalized changes. See? simples. Just do it before you push anything.

- Checkout
Checkout updates all three trees to look like a branch like running **git reset --hard _branch_**, but it is working directory safe so unlike reset --hard, it will check to see if there are any changes in the working directory before it performs its operation, and will attempt a trivial merge if there are, however hard reset just replaces everything across the board.

Checkout also behaves differently than reset, as where reset will update the branch that HEAD points to, checkout will just move HEAD to point to a different branch.

Calling checkout with a path will overwrite the index and working directory (like a hard reset), but won't check beforehand, so it's the same as a hard reset for a given file.

In summary, resetting is to change a branches reference, and checking out is to change the branch that head points to. Hard reset and checking out a file are not working directory safe.

## Advanced Merging - Merge Conflicts
Try to maintain a clean working directory before performing a merge by stashing or committing any current changes, this will help avoid any unnecessary complications as a result.

- **git merge --abort** will abort a merge and revert files to their previous states if you wish to abort the merge.
- **git merge -Xignore-all-space _branch-name_** and **git merge -Xignore-space-change _branch-name_** will perform a merge ignoring whitespace, either all or treating consecutive whitespace as a single space. This option may be ignoring legit whitespace issues though, or it can be a lifesaver if someone has updated entire files from spaces to tabs.
- **git show :_1/2/3_:filename.ext > filename.common.ext** can be used to retrieve blob information for the common version of a file where the merging branches intersect (1), our current version of the file (2) or their version of the file (3). Once you've retrieved and modified these files (say by fixing up whitespace issues), you run **git merge-file -p file1.ext file2.ext file3.ext > outfile.ext** and use outfile.ext as your resolved file.
- **git diff --ours** compares what we're about to commit with the original files from our branch. **git diff --theirs** and **git diff --base** work in much the same way. **git diff -b** does a compare ignoring whitespace.
- **git clean -f** will get rid of any unnecessary files after files have been committed.
- **git checkout --conflict=_diff3/merge_ _filename_** will reset the file with merge conflict markers in either of the specified styles (merge is the default style).
- **git config --global merge.conflictstyle _diff3/merge_** sets the default conflict style when merge conflicts are encountered.
- **git checkout --_ours/theirs_** can resolve a conflict by just selecting one of the file versions.
- **git log --oneline --left-right HEAD...MERGE_HEAD** will show all the commits that are different between both branches, to give you context as to why you have merge conflicts.
- **git log --oneline --left-right --merge** will show all the commits that have modified currently conflicted files in either branch. Add the -p option to that, and you'll get the diffs as well, which is *really* helpful in resolving merge conflicts.
- Running *git diff** directly after a merge conflict will show 2 columns on the left hand side. The left hand column shows you line that are different between the "ours" branch and the current working directory file, the right hand column shows the lines that are difference between "their" branch and the working directory file.
- **git log --cc -p** will include merge commits as a result of --cc, and will show the same combined diff info.

## Advanced Merging - Undoing Merges
- In case of an unwanted merge, just hard reset to the ancestor of HEAD using **git reset --hard HEAD~**, although as with any rewriting history command, avoid this if it exists in a shared repository. This also won't work if there have been any other commits. You would just lose the changes.
- **git revert -m 1 HEAD** when run on a merge commit will undo the work will revert the work merged in from "their" branch (because -m 1 takes the first branch, "our" branch as the mainline branch), and it will effectively undo a merge. To regain the reverted merge though, you will have to revert the revert commit, otherwise you will not be able to merge new work on that branch into master.

## Subtrees
You can have subtrees within your project representing different projects/repositories.
- **git add remote add _remote-name_ _remote-url_** will add another remote your project that may not be related at all to your repository codebase, fetching from this and switching to a branch from the remote can switch you to a project root from a different project.
- **git read-tree --prefix _subdir-prefix/_ -u _branch-name_** will map this different project to the _subdir-prefix_ folder of your main project. When you commit, it will look like you've copied all the other project files to that subdirectory.
- You can update the other project branch as normal (by pulling) then can use **git merge --squash -s recursive -Xsubtree=_subdir-prefix_ _branch-name_** to merge the _branch-name_ into the subdirectory. The recursive strategy specified in -s is default, but is specified for clarity. You can make changes in the subdirectory and contribute them to the external project later as well.
- Using subtrees allows git projects to be modularised, but adds complexity to the workflow and allows mistakes to be made more easily.
- **git diff-tree -p _branch-name_** needs to be used to compare a subtree directory to its external root branch. You could also use **git diff-tree -p _remote-name_/master** to compare with the latest master on the server.

## Advanced Merging - Other types of merges
- **git merge -X_ours/theirs_ _branch-name_** just takes the specified side in case of a merge conflict, even for entire binary files.
- **git merge -s _ours/theirs_ _branch-name_** performs a sort of fake merge, taking all the work in the specified branch, and ignoring all work in the other just for the purpose of having a merge commit. This can be useful if you're going to have work needing to be merged into 2 branches which will also need to be merged.

## Rerere in depth
The recorded resolution feature is super helpful when merging and rebasing a lot, and can be used to record resolutions when merging, then to rewind and rebase without having to fix the conflicts again.

- **git config --global rerere.enabled true** to turn it on automatically as before.
- **git rerere status** to see what files have a pre-merge state recorded
- **git rerere diff** will show the current state of the resolution when in the process of recording a resolution.
- **git checkout --conflict=_diff3/merge_ _filename_** to add the conflict markers in if rerere was incorrect or for some other reason.
- **git rerere** to manually resolve all currently conflicting files that can be resolved.

## Debugging with git
- **git blame _filename_** outputs a file annotated with the user who made changes to each line. Lines starting with **^** were in the original file commit.
  - **-L 12,22** would limit the output to lines 12 to 22 inclusive.
  - **-C** will include info about what file each line originally came from, so if files were renamed or split apart, git can let you know that.
- **git bisect start** will start a bisect session which helps isolate a breaking commit that may be hidden within hundreds of commits.
  - **git bisect bad** marks the current commit as bad (failing, dodgy code)
  - **git bisect good _tag/commit-sha_** marks the given commit as known good code, and will change the current commit for you continuously, then you mark each one as good or bad until you isolate your issue.
  - **git bisect reset** will reset HEAD to it's original position.
  - After starting a bisect session, you can call **git bisect run _script-file_** which will invoke a script on each commit to output 0 if the commit is good, or non-0 if the commit is bad to automate the whole git bisect.

## Submodules
Submodules are a way of working on multiple related git projects under a top level git project if you want to include a separate project, or perhaps to modularise your development into multiple parts.

Note that when you add a submodule, it will add a folder in the working directory, but is stored in git as a directory entry containing just the commit pointed to by the submodule directory. The commit required for the project to function is stored at the project level, along with submodule commits. The commits can also be pushed to the submodule URL's to contribute to the standalone submodule projects.

Git submodules are by default created with a detached head, meaning work can't be contributed without checking out a branch. Detached head meaning it's showing and initialized to a remote branch.

- **git submodule add _url_** will add a new submodule to your project.
- the **.gitmodules** file tracks which submodules have been added and where to pull/push them from.
- **git diff --submodule** formats a summary of changes to a submodule nicely.
- **cd _SubmoduleName_; git submodule init** will initialize a submodule from a newly cloned project which didn't bring the submodule files.
- **git clone --recursive _url_** will pull down a project as well as all submodules (same as calling git submodule init on each submodule).
- To update a submodule, run git fetch from inside the directory, and just merge with an origin branch. This can be done quicker with **git submodule update --remote _SubmoduleName_**, and will default to the master branch unless otherwise specified by **git config -f .gitmodules submodule._SubmoduleName_.branch _branch-name_**, the **-f .gitmodules** bit stores this change for the rest of the project as well.
- **git update --remote** will update all submodules, so if there are many, you may want to specify the name as above.
- To make a submodule diff standard, configure with **git config --global diff.submodule log**. If you update a submodule and commit, you will lock other people into having that code when other people update.
- **git config status.submodulesusmmary 1** will direct git status to provide a summary of changes to a submodule.
- To work on a submodule, just checkout a branch. Then to update a submodule with a checked out branch, you need to pass either --merge or --rebase to the **git update --remote** command. I.e. **git update --remote --_merge/rebase_**. If you leave off the flag, it will go back to a detached head state and you'll need to checkout a branch again. If there are any merge conflicts, they can be fixed from the subdirectory as per normal.
- **git push --recurse-submodules=check** will check submodules have been pushed before the main project has been pushed.
- **git push --recurse-submodules=on-demand** will push any submodules with commits before pushing the main project.
- If a subproject has been updated to different commits in different branches of the superproject, it can cause issues when merging (like in a git pull). If one subproject commit is just an ancestor of the other, it will just take the latter in the merge, else the below process should be followed.
  - **git diff** to see the SHA-1 for the conflicting commits of the subproject.
  - Go into the subproject, and attempt to merge the second commit into our commit, i.e. **git branch try-merge _sha-of-conflicting-commit_**.
  - If it merges cleanly, go into the main project, add the changed subproject again and commit.
  - If it doesn't merge cleanly, fix the merge conflict in the subproject, then commit into the subproject, and then again in the main project.
  - If at the beginning of the merge, they were conflicting but a merge commit exists referencing the 2 divergent subproject commits in question, git will suggest the merge commit as a solution, so go and fast-forward merge the subproject into that commit SHA-1 suggested by the initial merge, test the changes, see what the differences are and then finally add and commit the superproject.
- **git submodule foreach '_git command_'** will run the git command in all subprojects, below are some useful aliases.
  - **git config alias.sdiff '!' "git diff && git submodule foreach 'git diff'"**
  - **git config alias.spush 'push --recurse-submodules=on-demand'**
  - **git config alias.supdate 'submodule update --remote --merge'**
- If you switch from a branch with a git submodule to a branch without, the submodule directory will still exist untracked in your directory, you can remove it with **git clean -fdx**, but then you have to re-initialize it if you switch back to a branch with the submodule with **git submodule update --init**
- If you migrate a subdirectory to a submodule, and remove the subdirectory in place of adding a submodule, you'll need to **git rm -r _subdirectory_** to remove the subdirectory properly. If you switch back to a branch that still has the subdirectory, you will need to **git checkout -f _branch-name_** to accomplish it, but it will delete any unsaved changes so precede with care in this case. In the reverse case, the submodule directory will be empty so use **git submodule update**, or **git checkout .** if that isn't working.

## Bundling
Bundles are used to store ranges of commits in a file that can be sent when regular network operations aren't available for some reason.
- **git create bundle _filename_ HEAD master** stores all commits required to construct master, HEAD should be stored too. The file can then be sent to someone else however.
- **git clone _bundle-filename_ _project-folder-name_** will clone from a bundle containing an entire project.
- The range of commits needs to be determined to create a bundle to send a specific set of commits, this could be determined by using **git log --oneline master ^origin/master** and comparing that to **git log --oneline master** to find the first commit to omit. After determining that commit, use **git bundle create _filename_ master ^_omit-sha1_**.
- When importing a bundle with a range of commits into an existing repo, using **git bundle verify _filename_** to verify the repo in relation to the bundle.
- **git bundle list-heads _filename_** shows what references are in the bundle that can be imported, this info can be used with **git fetch _filename_ _bundle-head-name_/_new-branch-name_** to import the commits to the new branch in the current repo.

## Replace
Replace can be used to treat one commit as another. An example was given showing how this can be used to separate out a project history into historical data and recent commits.

### Separation
- Make a branch at the cutoff point and push that data to a new repo.
  - **git branch history _commit-sha_**
  - **git remote add _remote-alias_ _remote-url_**
  - **git push _remote-alias_ history:master**
- Create a new base commit with instructions on how to retrieve the historical commits, and splice the recent history from the common commit in both repos onto that dummy base commit.
  - To create a new parentless base commit, use **echo 'instructions to retrieve base commit' | git commit-tree _sha-parent-of-common-commit_^{tree}**
  - Rebase onto the new base commit - **git rebase --onto _sha-of-base-commit_**

### Reconnection
- Get the historical commits - **git remote add project-history _url_**, *git fetch project-history**
- Replace the common commit in our repo, with the common commit in the historical repo, and it will act as if the histories are joined together (and ignoring the base commit) - **git replace _our-common-commit-sha_ _historical-common-commit-sha_**
- Git blame, git bisect and all the cool tools will now work whils incorporating the added historical info.
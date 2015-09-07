# git things i learnt

- __git add__ to add untracked files, and non staged files
- git stages are untracked, modified, and committed. Things can be untracked and modified (changes after add)
- __git status__ shows current workspace/staging area, whether there are untracked or modified files and if they're in the staging area.
  - __git status -s__ shows an abbreviated format
- __git diff__ for diff between untracked changes and either staged or committed i think.
  - __git diff --staged__ for changes between staged and previous commit. __--staged__ and __--cached__ are synonyms

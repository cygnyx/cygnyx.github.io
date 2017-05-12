---
layout: post
title:  "Using GitHub"
tags: github jekyll
---

In order to test functionality of GitHub, I've had to make many commits
and pushes onto GitHub. After making adjustments I didn't need this
multitude of commits.

It is possible to remove, or merge, a set of commits on GitHub by
doing the following:
```
git reset --soft <LAST-COMMIT-THAT'S-OK>
git commit -m 'Many squashed commits'
git push --force origin master
```
based on this
[article](http://stackoverflow.com/questions/8213926/git-simplest-way-of-squashing-commits-on-master).
To determine the `<LAST-COMMIT-THAT'S-OK>`
run `git --no-pager log`.

I typically do an incremental update with:
```
git add .; git commit -m again; git push
```

To initially set up, I've used (checkout master or gh-pages):
```
git init .
git remote add origin https://github.com/cygnyx/REPOSITORY.git
git checkout -b master
git pull
```


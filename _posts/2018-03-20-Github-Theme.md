---
layout: post
title:  "Minima theme change problem"
tags: github jekyll
---

While trying to update my [GitHub] [Jekyll] site, I got an error about
a symbolic link being missing in my `default.html`.
This was strange since I didn't have a `default.html` file.
The problem was a recent update to the Minima theme which the site uses.

The Minima update made incompatible changes relative to my custom `footer.html`.
The GitHub error message was misleading.
I solved this by finding `icon-github.html` and `icon-github.svg` on the web.

[GitHub]: http://github.com
[Jekyll]: http://jekyllrb.com

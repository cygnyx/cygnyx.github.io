---
layout: post
title:  "Using Jekyll to Deploy to GitHub"
tags: github jekyll
---

I've tried a few static site builder with [GitHub] pages, such as
[brunch] and [Metalsmith].
Since [Jekyll] is popular and is recommended for GitHub,
I've decided to give it a try.

There are several guides on how to deploy a Jekyll site on GitHub,
but none seem to do what I want.
Github converts the site's source files into the render website on their servers.
However there is a delay between uploading sources and the rendering.
This was a problem when I was debugging a configuration issue -
I needed to wait awhile before the website was updated.

Before deploying I used `jekyll serve` to adjust some of the source files.
In particular I wanted to include [MathJax][mathjax] in order to write
equations on my site, such as: \\(x \lt y \\), which is written as `\\(x \lt y \\)`.
The whole process was easy to use.
It updates to the local webserver, port 4000, whenever a source file changes.

For MathJax I modified the head.html file to include:
```
  <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
  </script>
  <script type="text/javascript">
    MathJax.Hub.Config({
      showProcessingMessages: false,
      tex2jax: { inlineMath: [['\\(','\\)']] },
      TeX: { equationNumbers: {autoNumber: "AMS"} }
    });
  </script>
```
Which restricts the inline math equation delimiters to avoid conflicts with [markdown].

I learn enough about Liquid to build a `tags` page to organize posts according to their tags.

I did a `git init`, followed by `git add .`, `git commit -m 'again'`, `git push`.


[brunch]: http://brunch.io
[Metalsmith]: http://metalsmith.io
[GitHub]: http://github.com
[MathJax]: https://www.mathjax.org
[Jekyll]: http://jekyllrb.com
[markdown]: https://en.wikipedia.org/wiki/Markdown

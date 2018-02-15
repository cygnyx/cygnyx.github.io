---
layout: post
title:  "jekyll problems"
tags: github jekyll
---

My local installation of `bundle` and `jekyll` became corrupted.

I reinstalled both to fix the problem.
The prior versions of these scripts had a hardcoded path to the `ruby` interpreter.
The current versions use `/usr/bin/env ruby` instead.

Unfortunately the `bundle` version of `jekyll` (3.4.3) is a different version than the local install (3.7.0).
This led to some confusion for the `_config.yml` file. The keyword `gems` changed to `plugins` for example.
Although this built successfully locally, this produced an error during the build on github.
The github build error message was unclear.
The solution was to revert to the `bundle` version of `jekyll` and use the keywords that this version requires.

---
layout: post
title:  "Plot of Dow Component performance"
tags: finance
---

A Jupyter notebook for plotting Dow Component performance.

The notebook is available [here](/notebooks/DowComponentPerformance.ipynb)
or viewed [online](https://github.com/cygnyx/cygnyx.github.io/blob/master/notebooks/DowComponentPerformance.ipynb) at GitHub.
The most significant difficulty was finding reliable free pricing data.
I tried `Yahoo` and `Google` but settled on `Quandl` pricing source.
Each provider requires slightly different ticker formats
and provides results in slightly different formats.
Quandl seems to be missing prices for MMM at this time.

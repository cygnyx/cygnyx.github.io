---
layout: post
title:  "qppenalty"
tags: algorithms QP python C java javascript
---
This notebook implements qppenalty: a program that
solves quadratic programming problems.

I created a Jupyter notebook 
that implements qppenalty in python, C, java and javascript.
It is
available [here](/notebooks/qppenalty.ipynb)
or viewed [online](https://github.com/cygnyx/cygnyx.github.io/blob/master/notebooks/qppenalty.ipynb) at GitHub.
The approach converts the constrained quadratic programming problem
into an unconstrained problem that approximates the solution.
The notebook reviews the mathematics that drives the algorithm,
generates and compiles the code and runs a number of test problems.
Using the python version several plots are displayed that
suggest that selecting the meta-parameters is non-trivial.

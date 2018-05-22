---
layout: post
title:  "Two Input Classifier"
tags: tensorflow ANN
---
This notebook demonstrates the need for multi-layer ANN when
the solution involves fitting many non-linear edges.

I created a Jupyter notebook for
using an image to monitor the progress of an ANN to solve a complex classification.
It is
available [here](/notebooks/TwoInputClassifier.ipynb)
or viewed [online](https://github.com/cygnyx/cygnyx.github.io/blob/master/notebooks/TwoInputClassifier.ipynb) at GitHub.

The images typically show a vertical structure,
suggesting that the 2 inputs are not treated equally.
It could be that this is due a random initialization:
in one case there has a horizontal characteristic.

The images demostrate that a single hidden layer has difficulty
handling the non-linear edges of the classification.
The addition of additional layers significantly improves the
handling of these edge cases.
It should be noted that percentage-wise most sample points are
handled well by the SHL.
But the proper handling of the edge cases may be an important
in certain problems.

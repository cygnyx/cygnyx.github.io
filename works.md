---
layout: page
title: Works
permalink: /works/
---

A collection of public works that I've contributed to.

## Software

### EUVE Guest Observer Analysis Software

I was the principal developer of the
EUVE Guest Observer Analysis Software
([ADASS I EGO](http://articles.adsabs.harvard.edu/full/1992ASPC...25..110O),
 [ADASS I EES](http://articles.adsabs.harvard.edu/full/1992ASPC...25..496V),
 [ADASS IV](http://adass.org/adass/proceedings/adass94/olsone.html),
 [ADASS VI](http://adsabs.harvard.edu/full/1997ASPC..125..349O),
 [EUVE](http://archive.stsci.edu/euve/),
 [EGOS UG](http://archive.stsci.edu/euve/soft_ug/softug_int.ps),
 [code](http://archive.stsci.edu/pub/euve/software))
from 1990 thru 1997.
The main innovation in this package is the `Comprehensive Event Pipeline` program.
This program implemented a number of processing modules that could be configured at run time into a processing pipeline.
This concept is derived from the `End-to-End System` used during the development of the satellite's scientific payload.
Where the EES used individual programs with Unix pipes,
CEP is a single program where `buckets` of events are passed between modules.

The Google search is
[EUVE Guest Observer Analysis Software](https://www.google.com/search?q=euve+guest+observer+analysis+software)

### Satellite Communications Animation

Around 1996 I wrote a Satellite Communications Java applet for Dr. Isabel Hawkins and Dennis Biroscak as part of an educational outreach program associated with the EUVE mission.
It is difficult to run in 2017 due to the security changes made in browsers.
Chrome no longer supports Java applets.
On my Mac I first had to add `cse.ssl.berkeley.edu` to the `Exception Site List` in the `Java Control Panel`.
This panel is located under `System Preferences...` and then selecting `Java`.
On the panel, select the `Security` tab and the `Edit Site List ...`.
Also make sure that `Enable Java content in the browser` is selected.

After the security set up is complete, the
[animation](http://cse.ssl.berkeley.edu/lessons/indiv/dataflow/animation.html)
will run on the page `http://cse.ssl.berkeley.edu/lessons/indiv/dataflow/animation.html`.
On Safari, it opens up a separate window with two toggle buttons.
The animination shows the wireless lines of communication from
the EUVE operations center in Berkeley to the EUVE satellite.
EUVE was in Low-Earth Orbit completing an orbit in 90 minutes or so.
Geosynchronous satellites are located in much higher orbits
and complete an orbit in 24 hours - thus appearing stationary from the Earth.
The green line show the domestic space network components.
From the former
[Onizuka Air Force Base](https://en.wikipedia.org/wiki/Onizuka_Air_Force_Station)
in Mountain View, CA to the geosynchronous Domsat 2 satellite.
Domsat 2 relays the signal to
[Goddard Space Flight Center](https://www.nasa.gov/goddard)
which in turn relays the signal to DomSat 1 (in geosynchronous orbit).
The gray lines are segments in the
[Near Earth Network](https://www.nasa.gov/directorates/heo/scan/services/networks/txt_nen.html).
The signal is relayed from Domsat 1 through
[White Sands ground station](https://www.nasa.gov/directorates/heo/scan/services/networks/txt_sn.html)
and back up to
[TDRS](https://esc.gsfc.nasa.gov/tdrs) also in geosynchronous orbit.
The final, red, link is intermitent from TDRS to the EUVE satellite.

Surprisingly this work is on the first page of the Google search for
[Satellite Communication Simulation](https://www.google.com/search?q=satellite+communication+simulation)
and is first for
[EUVE Satellite Communication Simulation](https://www.google.com/search?q=euve+satellite+communication+simulation)

### Triangulation Applet

This [Triangulation](http://www.cygnyx.com/Triangulation/) applet uses Java in the browser to build interactive,
as well as static diagrams, of Delaunay Triangulations.
Due to security concerns, some adjustments to the browser may be needed before this page will display properly.


### markover.js

I wrote [markover](http://cygnyx.github.io/markover.js)
([github](http://github.com/cygnyx/markover.js), [npmjs](https://www.npmjs.com/package/markover.js))
in 2013.
It revisits Knuth's 1984 literate programming paradigm using HTML, CSS, and javascript.
The Literate Programming style emphasizes readability: a source document can be `tangled` into code or `weaved` into a document.
`markover` targets an single class: methods in the class can be built incrementally with explanitory text intermixed with the source code.
The tone of the document tends to be informal, as one developer might write to another.
Awkward development issues can be discussed in-situ as well as links to useful resources.

### pry

I wrote [pry](http://cygnyx.github.io/pry)
([github](http://github.com/cygnyx/pry), [npmjs](https://www.npmjs.com/package/pry),
[Cloudant](https://cygnyx.cloudant.com/example/_design/pry/_show/README.html))
in 2015.
It is a self-replicating [Couchapp](https://couchapp.readthedocs.io/en/latest/) deployment tool based in part on `markdown.js`.
A live deployment of `pry` is located on `Cloudant` featuring its online editor.

### LP Workbench

I wrote [LP Workbench](http://cygnyx.github.io/LPWorkbench)
([github](http://github.com/cygnyx/LPWorkbench)),
in 2016.
It is an educational web app for instructing students on the Simplex linear programming algorithm for solving real, integer, and mixed problems.
The problems are specified in canonical form using the notation in [_An Introduction to Linear Programming and Game Theory_](https://www.google.com/search?q=An+Introduction+to+Linear+Programming+and+Game+Theory,+Third+Edition+by+Paul+R.+Thie+and+G.+E.+Keough), Third Edition by Paul R. Thie and G. E. Keough.
Students can adjust the tableau by pivoting, adjusting variables and constraints.

### mapline

I wrote `mapline`([github](https://github.com/cygnyx/mapline), [npmjs](https://www.npmjs.com/package/mapline)) in 2014.
It is a nodejs module that streams an input line by line.

## Guides

### hello couchapp series

I have a few guides on deploying a couchapp from 2014:
hello-couchapp ([github](https://github.com/cygnyx/hello-couchapp)) using a file attachment,
hello-again-couchapp ([github](https://github.com/cygnyx/hello-again-couchapp)) without a file attachment,
and hello-couchapp-revisited ([github](https://github.com/cygnyx/hello-couchapp-revisited))
which separates out the HTML, CSS, and javascript components slightly.

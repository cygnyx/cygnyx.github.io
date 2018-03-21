---
layout: post
title:  "IBM Changes Cloudant, Smileupps.com"
tags: cloudant smileupps.com
---

IBM has taken over [Cloudant] which I had been using as
a live site for [pry], so I needed to move the site.

I signed up for a `Lite` free site on their new platform
to move `pry` before the March 31, 2018 deadline.
Once I figured out how to launch the service,
I copied and pasted the `pry.json` document from
the old service into the new service.
There were many confusing options for creating
user and API key, password pairs.
In the end, I used the account credentials
and tried to remove all other keys and passwords.
I updated the `pry` link using the new url,
which includes a key and encoded password.
So I thought it is OK to leave the encoded password in the link.
But once I logged out of the service this required a login/password.
So I gave up on this.

Searching on the web turned up [smileupps.com].
Its configuration is similar to the old cloudant site.
I quickly set up a free trial, copied and pasted `pry` into it,
created a cygnyx.smileupps.com subdomain, linked to my GitHub account,
and upgraded from a trial to a free account.

[Cloudant]: https://www.ibm.com/cloud/cloudant
[pry]: http://www.cygnyx.com/works#pry
[smileupps.com]: http://smileupps.com

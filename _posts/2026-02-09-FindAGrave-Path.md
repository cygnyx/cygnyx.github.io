---
layout: post
title:  "Path planning for FindAGrave"
tags: Javascript
---
Recently I had a number of memorials in [FindAGrave][FAG] to visit.
I created a virtual cemetery for them and visited the page.
I had about 50 memorials all in the same cemetery and all contained GPS locations.

Here is how I order the memorials to reduce the distances (with ChatGPT helping).

First, I grabbed the memorial info from the virtual cemeter page I was visiting.
I entered the following in the development console window.

```js
const memorialLinks = [...document.querySelectorAll('a[href*="/memorial/"]')]
  .map(a => a.href)
  .filter((v, i, a) => a.indexOf(v) === i); // dedupe

console.log(`Found ${memorialLinks.length} memorials`);
```

ChatGPT had problems scrapping the GPS data, after some debugging, I tested this function:
```js
async function scrapeMemorial(url) {
  const res = await fetch(url, { credentials: 'include' });
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const idMatch = url.match(/\/memorial\/(\d+)/);
  const memorialId = idMatch ? idMatch[1] : null;

  let latitude = null;
  let longitude = null;

  const mapLink = [...doc.querySelectorAll('a')]
    .find(a => a.textContent.trim().toLowerCase().includes('show map'));

  if (mapLink) {
    const href = mapLink.href;
    const qMatch = href.match(/[?&]q=([-0-9.]+),([-0-9.]+)/);
    if (qMatch) {
      latitude = qMatch[1];
      longitude = qMatch[2];
    }
  }

  return {
    id: memorialId,
    url,
    latitude,
    longitude
  };
}
```

This can be scrapped on all the memorials with this function:
```js
const delay = ms => new Promise(r => setTimeout(r, ms));

async function scrapeAllMemorials(memorialLinks) {
  const results = [];

  for (let i = 0; i < memorialLinks.length; i++) {
    const url = memorialLinks[i];
    console.log(`Scraping ${i + 1} / ${memorialLinks.length}`);

    try {
      const data = await scrapeMemorial(url);
      results.push(data);
    } catch (err) {
      console.error('Failed:', url, err);
      results.push({
        id: null,
        url,
        latitude: null,
        longitude: null,
        error: true
      });
    }

    await delay(1200);
  }

  return results;
}

const memorialData = await scrapeAllMemorials(memorialLinks);
```

Make sure to use on memorials with GPS for path planning:
```js
const points = memorialData
  .filter(m => m.latitude && m.longitude)
  .map(m => ({
    id: m.id,
    url: m.url,
    lat: Number(m.latitude),
    lon: Number(m.longitude)
  }));
```

Here is the distance function, note that R is not important for this application:
```js
function distance(a, b) {
  const R = 6371000; // meters
  const toRad = d => d * Math.PI / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}
```

And a bit brutal nearest neighbor function (n squared order, ok for small sets):
```js
function nearestNeighbor(points, startIndex = 0) {
  const unvisited = points.slice();
  const path = [];

  let current = unvisited.splice(startIndex, 1)[0];
  path.push(current);

  while (unvisited.length) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const d = distance(current, unvisited[i]);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = i;
      }
    }

    current = unvisited.splice(nearestIdx, 1)[0];
    path.push(current);
  }

  return path;
}

let path = nearestNeighbor(points);
```

Followed by a classic path optimization [algorthm][Opt2] that removes crossing paths:
```js
function twoOpt(path) {
  let improved = true;

  while (improved) {
    improved = false;

    for (let i = 1; i < path.length - 2; i++) {
      for (let j = i + 1; j < path.length - 1; j++) {
        const a = path[i - 1];
        const b = path[i];
        const c = path[j];
        const d = path[j + 1];

        const currentDist = distance(a, b) + distance(c, d);
        const newDist = distance(a, c) + distance(b, d);

        if (newDist < currentDist) {
          path.splice(i, j - i + 1, ...path.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }

  return path;
}

path = twoOpt(path);
```

Here is a utility function to generate short path directions on google maps:
```js
function googleMapsRoute(points) {
  const origin = `${points[0].lat},${points[0].lon}`;
  const destination = `${points[points.length - 1].lat},${points[points.length - 1].lon}`;
  const waypoints = points
    .slice(1, -1)
    .map(p => `${p.lat},${p.lon}`)
    .join('|');

  return `https://www.google.com/maps/dir/?api=1&travelmode=walking` +
         `&origin=${origin}` +
         `&destination=${destination}` +
         (waypoints ? `&waypoints=${waypoints}` : '');
}
```

This buids an array for these short path directions:
```js
function buildRouteLinks(path, chunkSize = 8) {
  const links = [];

  for (let i = 0; i < path.length - 1; i += chunkSize) {
    const slice = path.slice(i, i + chunkSize + 1);
    if (slice.length >= 2) {
      links.push({
        start: i + 1,
        end: i + slice.length,
        url: googleMapsRoute(slice)
      });
    }
  }

  return links;
}

const mapRoutes = buildRouteLinks(path);
```

Next, build a web page with the memorials in the ordered direction:
```js
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Virtual Cemetery Visit Path</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 2rem;
    }
    h1 {
      margin-bottom: 1rem;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #f0f0f0;
      position: sticky;
      top: 0;
    }
    tr:nth-child(even) {
      background: #fafafa;
    }
    a {
      color: #0645ad;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .idx {
      text-align: right;
      color: #666;
    }
  </style>
</head>
<body>

<h1>Virtual Cemetery - Visit Order</h1>
<p>Total memorials: ${path.length}</p>

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Memorial ID</th>
      <th>Latitude</th>
      <th>Longitude</th>
      <th>Find A Grave</th>
      <th>Google Maps</th>
    </tr>
  </thead>
  <tbody>
    ${path.map((p, i) => `
      <tr>
        <td class="idx">${i + 1}</td>
        <td>${p.id}</td>
        <td>${p.lat}</td>
        <td>${p.lon}</td>
        <td>
          <a href="${p.url}" target="_blank">Memorial</a>
        </td>
        <td>
          <a href="https://www.google.com/maps?q=${p.lat},${p.lon}" target="_blank">
            Map
          </a>
        </td>
      </tr>
    `).join('')}
  </tbody>
</table>

<h2>Google Maps Walking Routes</h2>
<ol>
  ${mapRoutes.map(r => `
    <li>
      <a href="${r.url}" target="_blank">
        Memorials ${r.start}–${r.end}
      </a>
    </li>
  `).join('')}
</ol>

</body>
</html>
`;
```

Finally, save the result:
```js
const blob = new Blob([html], { type: 'text/html' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'virtual-cemetery-path.html';
a.click();
```

[FAG]: https://www.findagrave.com
[Opt2]: https://en.wikipedia.org/wiki/2-opt

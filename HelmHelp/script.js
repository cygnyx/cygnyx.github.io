var c = null;
var ch = [];
var mapch = null;
var cminlat = null;
var cmaxlat = null;
var cminlon = null;
var cmaxlon = null;

var error = null;
var errorcnt = 0;
var tracking = null;
var timer = null;

var raceseries = null;
var racecourse = null;
var racecoursedetails = {};

var routes = null;
var waypoints = null;

var race = null;

var racestart = null;

var mapview = null;
var mapleaflet = null;
var mapcenter = null;

var marks = {};

const starttimes = [
    "Now",
    "+1 minute",
    "+5 minutes",
    "+10 minutes",
    "@ :00",
    "@ :05",
    "@ :10",
    "@ :15",
    "@ :20",
    "@ :25",
    "@ :30",
    "@ :35",
    "@ :40",
    "@ :45",
    "@ :50",
    "@ :55"
];


const geolocationoptions = {
    maximumAge: 0,
    enableHighAccuracy: true,
    timeout: 1000
};

function elapsedsecond() {
    var t = new Date;
    setclock(t);

    if (errorcnt > 0) {
	errorcnt = errorcnt - 1;
	if (errorcnt == 0)
	    error = null;
    }

    if (c) {
	newlat = c.coords.latitude;
	newlon = c.coords.longitude;
	newtim = t.getTime();
	
	if (!cminlat) {
	    cminlat = cmaxlat = newlat;
	    cminlon = cmaxlon = newlon;
	}
	ch.unshift([newlat, newlon, newtim]);

	if (cminlat > newlat) cminlat = newlat;
	else if (cmaxlat < newlat) cmaxlat = newlat;

	if (cminlon > newlon) cminlon = newlon;
	else if (cmaxlon < newlon) cmaxlon = newlon;

	drawmap();
    }
}

function pos(p) {
    if (tracking == null || p == null)
	return;
    c = p;
}

function seterror(txt, sec) {
    if (sec == null) sec = 5;
    error = txt;
    errorcnt = sec;
}

function err(ec) {
    if (ec.code != GeolocationPositionError.TIMEOUT)
	seterror(ec.message);
}

function updateposition() {
    navigator.geolocation.getCurrentPosition(pos, err, geolocationoptions);
}

function recordtoggle() {

    if (tracking == null) {
	timer = setInterval(elapsedsecond, 1000);
	tracking = navigator.geolocation.watchPosition(pos, err, geolocationoptions);
    } else {
	clearInterval(timer);
	timer = null;
	navigator.geolocation.clearWatch(tracking);
	tracking = null;
	c = null;
    }

}


function llfmt(c) {
    if (c.latitude >= 0.0) {
	lat = c.latitude.toFixed(6);
	if (c.latitude < 10.0) sgn = "+0";
	else sgn = "+";
    } else {
	lat = (-c.latitude).toFixed(6);
	if (c.latitude < -10.0) sgn = "-";
	else sgn = "-0";
    }
    lat = sgn + lat;

    if (c.longitude >= 0.0) {
	lon = c.longitude.toFixed(6);
	if (c.longitude < 10.0) sgn = "+00";
	else if (c.longitude < 100.0) sgn = "+0";
	else sgn = "+";
    } else {
	lon = (-c.longitude).toFixed(6);
	if (c.longitude < -100.0) sgn = "-";
	else if (c.longitude < -10.0) sgn = "-0";
	else sgn = "-00";
    }
    lon = sgn + lon;

    return lat + ", " + lon;
}


function setseries(sname) {
    if (sname == 'Not Set') {
	raceseries = null;
	localStorage.removeItem("raceseries");
    } else {
	raceseries = sname;
	localStorage.setItem("raceseries", sname);
    }
    setconfcourse();
}

function setcourse(sname) {
    if (racecourse) {
	racecourse = null;
	if (racecoursedetails) {
	    if ('mapped' in racecoursedetails) {
		var l = racecoursedetails['mapped'];
		for (const e of l) {
		    mapleaflet.removeLayer(e);
		}
	    }
	    racecoursedetails = null;
	}
    }
    if (sname == 'Not Set') {
	localStorage.removeItem("racecourse");
    } else {
	racecourse = routes.series[raceseries][sname];
	localStorage.setItem("racecourse", sname);
	mapracecourse();
	mapracemarks();
    }
    if (mapcenter) {
	mapcenter = midmap();
	mapleaflet.panTo(mapcenter);
    }
}

function mapracecourse() {
    var minlat, maxlat;
    var minlon, maxlon;
    var marks = {};
    var ftime = true;
    var maplbl = [];
    
    if (racecourse) {
	racecourse.forEach(function (turning) {
	    var a = turninggetmarks(turning);
	    if (a)
		a.forEach(function(e) {marks[e]=0;});
	});
    }
    marks = Object.keys(marks).sort();

    marks.forEach(function(mark) {
	var m, newlat, newlon, ml;
	if (mark in routes.waypoints.overrides)
	    m = routes.waypoints.overrides[mark];
	else if (mark in waypoints)
	    m = waypoints[mark];
	else
	    m = null;
	ml = null;
	if (m) {
	    newlat = m[0];
	    newlon = m[1];
	    ml = L.circle([newlat, newlon], {
		color: '#f00',
		fillColor: '#f03',
		fillOpacity: 1.0,
		radius: 5
	    }).bindPopup(m[2]);
	    if (ftime) {
		minlat = maxlat = newlat;
		minlon = maxlon = newlon;
		ftime = false;
	    } else {
		if (minlat > newlat)
		    minlat = newlat;
		else if (maxlat < newlat)
		    maxlat = newlat;
		if (minlon > newlon)
		    minlon = newlon;
		else if (maxlon < newlon)
		    maxlon = newlon;
	    }
	}
	maplbl.push(ml);
    });

    racecoursedetails = {
	'marks': marks,
	'labels': maplbl,
	'minlat': minlat,
	'maxlat': maxlat,
	'minlon': minlon,
	'maxlon': maxlon
    };
}

function setstart(sname) {
    var dt = new Date();
    var gt = dt.getTime();

    if (sname == 'Not Set') {racestart = null; return; }

    idx = starttimes.indexOf(sname);
    switch(idx) {
    case 0: t = gt; break;
    case 1: t = gt + 60000; break;
    case 2: t = gt + 60000 * 5; break;
    case 3: t = gt + 60000 * 10; break;
    default:
	dt.setSeconds(0);
	mm = (idx - 4) * 5;
	if (mm < 0) mm = 0;
	else if (mm > 59) mm = 59
	mmc = dt.getMinutes();
	if (mm < mmc)
	    dt.setHours(dt.getHours() + 1);
	dt.setMinutes(mm);
	t = dt.getTime();
	break;
    }
    racestart = new Date(t);
}

function setmark(name) {
    marks[name] = c;
}

function setclock(t) {
    var s = t.toLocaleTimeString().trim();
    var a = s.split(' ');
//    clock.innerHTML = a[0];
}

function turninggetmarks(turning) {
    var typ = turning.substring(0, 1);
    var mrk = turning.substring(2);
    var a;
    var marks;
    if (typ == 'l') {
	if (mrk in routes.lines) {
	    a = routes.lines[mrk];
	    marks = [a[0], a[1]];
	}
    } else if (typ == 'p' || typ == 's') {
	marks = [mrk];
    } else
	marks = [];
    return marks;
}

function midmap() {
    var minlat = cminlat;
    var maxlat = cmaxlat;
    var minlon = cminlon;
    var maxlon = cmaxlon;

    if (!minlat) return null;
    
    if (racecourse) {
	if (racecoursedetails['minlat'] < minlat) minlat =  racecoursedetails['minlat']
	if (racecoursedetails['maxlat'] > maxlat) maxlat =  racecoursedetails['maxlat']
	if (racecoursedetails['minlon'] < minlon) minlon =  racecoursedetails['minlon']
	if (racecoursedetails['maxlon'] > maxlon) maxlon =  racecoursedetails['maxlon']
    }

    var midlat = (minlat + maxlat) / 2;
    var midlon = (minlon + maxlon) / 2;
    return new L.latLng(midlat, midlon);
}

function drawmap() {
    var pts;
    var i;
    var l;
    var o;
    if (mapcenter == null) {
	if ((mapview.clientWidth + mapview.clientHeight) > 0) {
	    mapcenter = midmap();
	    if (mapcenter)
		mapleaflet.setView(mapcenter, 11);
	}
    } else {
	l = ch.length;
	if (l > 0) {
	    if (l > 300) l = 300;
	    pts = [];
	    for (i = l-1; i > 0; i--) {
		o = ch[i - 1];
		pts.push([o[0], o[1]]);
	    }
	    if (mapch)
		mapleaflet.removeLayer(mapch);
	    mapch = L.polyline(pts, {
		color: '#F00',
		weight: 5,
		opacity: 1.0
	    });
	    mapch.addTo(mapleaflet);
	}
    }
}

function mapracemarks() {
    if (!racecourse)
	return;
    var m = [];
    racecoursedetails['labels'].forEach(function (e) {
	e.addTo(mapleaflet);
	m.push(e);
    });
    racecoursedetails['mapped'] = m;
}

function foo() {
	navigator.permissions.query({
	    name: 'geolocation'
	}).then(function(result) {
	    if (result.state != 'granted')
		seterror("This application requires geolocation permission to be set to granted.");
	});
}


// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function splitcsv(csv) {
        var matches = csv.match(/(\s*"[^"]+"\s*|\s*[^,]+|,)(?=,|$)/g);
        for (var n = 0; n < matches.length; ++n) {
            matches[n] = matches[n].trim();
            if (matches[n] == ',') matches[n] = '';
        }
        if (csv[0] == ',') matches.unshift("");
        return matches;
}

function loadcachedwaypoints(csv) {
    a = {};
    s = 0
    csv.split(/\r?\n/).forEach(function (line) {
	if (line.length > 0 && s == 1) {
	    i = splitcsv(line);
	    j = []
	    i.forEach(function(n){
		m = n.length;
		if ((n[0] == '"' && n[m-1] == '"') ||
		    (n[0] == "'" && n[m-1] == "'"))
		    n = n.substring(1,m-1);
		j.push(n);
	    });
	    a[j[2]] = [parseFloat(j[0]), parseFloat(j[1]), j[3]];
	}
	s = 1
    });
    waypoints = a;
}

function loadcachedroutes(json) {
    routes = JSON.parse(json);
    for (const [n, v] of Object.entries(routes.waypoints.urls))
	cachefile(v, loadcachedwaypoints);
}

function cacheclear() {
    localStorage.clear();
}

async function cachefile(url, procfunc, init = null) {
    if (!url || url == "")
	return;
    txt = localStorage.getItem(url);
    if (txt === null) {
	var r = await fetch(url, init);
	txt = await r.text();
	if (txt.length > 0) {
	    localStorage.setItem(url, txt);
	    procfunc(txt);
	}
    } else {
	procfunc(txt);
    }
}

function loadroutes() {
    var url = document.getElementById("routesurl").value;
    localStorage.setItem("routesurl", url);
    cachefile(url, loadcachedroutes);
    setconfseries();
}

function loadwaypoints() {
    var url = document.getElementById("waypointsurl").value;
    localStorage.setItem("waypointsurl", url);
    cachefile(url, loadcachedwaypoints);
}

function setvalue(id) {
    var txt = localStorage.getItem(id);
    if (txt)
	document.getElementById(id).value = txt;
    return txt ? true : false;
}

function setconftimes() {
    const e = document.getElementById("racestarttimes");
    var h = "'<option>Not Set</option>'"
    for (const s of starttimes)
	h += '<option>'+s+'</option>';
    e.innerHTML = h;
}

function setconfseries() {
    const e = document.getElementById("raceseries");
    var h = "'<option>Not Set</option>'"
    if (routes) {
	sl = Object.keys(routes.series).sort();
	for (const s of sl)
	    if (s != "help") {
		if (e.value == s)
		    h += '<option selected>'+s+'</option>';
		else
		    h += '<option>'+s+'</option>';
	    }
    }
    e.innerHTML = h;
}

function setconfcourse() {
    const e = document.getElementById("racecourse");
    var h;
    if (e.value)
	h = "'<option>Not Set</option>'"
    else
	h = "'<option selected>Not Set</option>'"

    var reg = /^\d+$/;

    if (raceseries) {
	cl = Object.keys(routes.series[raceseries]);
	n = true
	for (const s of cl)
	    if (reg.test(s) == false) {
		n = false;
		break;
	    }
	if (n)
	    cl = cl.sort(function(a, b) {return a-b;});
	else
	    cl = cl.sort();
	for (const s of cl) {
	    if (e.value == s)
		h += '<option selected>'+s+'</option>';
	    else
		h += '<option>'+s+'</option>';
	}
    }
    e.innerHTML = h;
}


function showmap() {
    if (!tracking)
	recordtoggle();
    document.getElementById("configuration").className = "hide";
    document.getElementById("mapview").className = "show";
}

function showconf() {
    document.getElementById("configuration").className = "show";
    document.getElementById("mapview").className = "hide";
}

function startmap() {
    mapleaflet = L.map('mapview');
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapleaflet);

    L.Control.ConfigurationButton = L.Control.extend({
	options: { position: 'topleft' },
	onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            var button = L.DomUtil.create('a', 'leaflet-control-button', container);
            L.DomEvent.disableClickPropagation(button);
            L.DomEvent.on(button, 'click', function(){
		    showconf();
            });

            container.title = "Configuration";
	    button.innerHTML = '<img src="iconsettings.svg" width="25" height="25"></img>';

            return container;
	},
	onRemove: function(map) {},
    });

    var control = new L.Control.ConfigurationButton();
    control.addTo(mapleaflet);

}

//	<img onclick="setmark('Pin');" src="iconbuoy.svg" width="50" height="50"></img>
//	<img onclick="setmark('RC');" src="iconrc.svg" width="50" height="50"></img>

function onload() {
    mapview = document.getElementById("mapview");
    startmap();

    document.getElementById("nojavascript").className = "hide";
    if ("geolocation" in navigator && "permissions" in navigator) {
	document.getElementById("configuration").className = "show";
	if (setvalue("routesurl")) {
	    loadroutes();
	    if (setvalue("raceseries")) {
		setseries(document.getElementById("raceseries").value);
		if (setvalue("racecourse")) {
		    setcourse(document.getElementById("racecourse").value);
		}
	    }
	}
	setvalue("waypointsurl");
	setconftimes();
	setconfseries();
	setconfcourse();
    } else
	document.getElementById("badbrowser").className = "show";
}

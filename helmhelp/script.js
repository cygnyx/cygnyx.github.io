var c = null;
var ct = ctfmt();

var error = null;
var errorcnt = 0;
var tracking = null;
var timer = null;

function ctfmt(d) {
    if (!d) d = new Date();
    return d.toLocaleTimeString();
}

const geolocationoptions = {
    maximumAge: 0,
    enableHighAccuracy: true,
    timeout: 1000
};

function elapsedsecond() {
    ct = ctfmt();
    if (errorcnt > 0) {
	errorcnt = errorcnt - 1;
	if (errorcnt == 0)
	    error = null;
    }
    drawpage();
}

function pos(p) {
    if (tracking == null)
	return;
    c = p.coords;
}

function seterror(txt, sec) {
    if (sec == null) sec = 5;
    error = txt;
    errorcnt = sec;
    drawpage();
}

function err(ec) {
    if (ec.code != GeolocationPositionError.TIMEOUT)
	seterror(ec.message);
}

function updateposition() {
    navigator.geolocation.getCurrentPosition(pos, err, geolocationoptions);
}

function recordtoggle(startp) {
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
    drawpage();
}

var mode = 0;
var series = null;
var course = null;

var routes = {
    "BYC": {
	"5": ["BYC", "YRA-DOC", "BYC", "YRA-DOC", "BYC Finish"],
	"14": ["BYC", "YRA-DOC", "YRA-XOC", "BYC Finish"]
    },
    "RYC": {
	"Black": ["RHC 8", "RW Bn", "YRA-NR6", "RW Bn", "RHC 7"],
	"Orange": ["RHC 8", "RW Bn", "RYC-BK", "RW Bn", "RHC 7"]
    }
};

var waypoints = {
    "BYC": [37.867833, -122.326000],
    "BYC Finish": [37.866473, -122.317745],
    "RHC 7": [37.906595, -122.386237],
    "RHC 8": [37.904440, -122.385007],
    "RW Bn": [37.903762, -122.392035],
    "RYC-BK": [37.897450, -122.389783],
    "YRA-DOC": [37.857680, -122.349403],
    "YRA-XOC": [37.872333, -122.358500]
}

var race = null;

function pagemode(newmode) {
    mode = newmode;
    drawpage();
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
    if (sname == 'Choose:') series = null;
    else series = sname;
    course = null;
    racecourse = null;
    mode = 1;
    drawpage();
}

function setcourse(sname) {
    if (sname == 'Choose:') course = null;
    else course = sname;
    mode = 0;
    racecourse = routes[series][course];
    drawpage();
}

var starttimes = [
    "Now",
    "+1 minute",
    "+5 minutes",
    "+10 minutes",
    "12:35 PM",
    "6:25 PM",
    "6:50 PM"
]

var racestart = null;

function setstart(sname) {
    var dt = new Date();
    var gt = dt.getTime();
    var lz = dt.getTimezoneOffset();

    if (sname == 'Choose:') {racestart = null; return; }

    idx = starttimes.indexOf(sname);
    switch (idx) {
    case 0: t = gt; break;
    case 1: t = gt + 60000; break;
    case 2: t = gt + 60000 * 5; break;
    case 3: t = gt + 60000 * 10; break;
    default:
	hhmm = sname.split(":");
	hh = parseInt(hhmm[0])
	mm = parseInt(hhmm[1])
	if (sname.endsWith("PM")) hh += 12;
	dt.setHours(hh);
	dt.setMinutes(mm + lz);
	dt.setSeconds(0);
	t = dt.getTime();
	break;
    }
    racestart = new Date(t);
}


var marks = {};
var tacks = [];
var gybes = [];
var mob = null;

function tack() {
    if (!c) seterror("GPS hasn't started");
    else tacks.push(c)
}

function gybe() {
    if (!c) seterror("GPS hasn't started");
    else gybes.push(c)
}

function setmob() {
    if (!c) seterror("GPS hasn't started");
    else mob = c;
}

function mark(mname) {
    if (!c) seterror("GPS hasn't started");
    else marks[mname] = c;
}

function drawpage() {
    var e = document.body;
    var h = "";
    var t = new Date;
    
    switch(mode) {
    case 0:
	if (racestart != null && tracking != null) {
	    dt = Math.floor((racestart.getTime() - t.getTime()) / 1000);
	    if (dt < 61 && dt > -15) {
		if (dt < 0)
		    h += '<p class="countup">' + (-dt) + ' seconds after start</p>'
		else
		    h += '<p class="countdown">' + dt + ' seconds before start</p>'
		break;
	    }
	}
	h += '<p>';
	h += '<a onclick="pagemode(1);">Setup</a>';
	h += ' <a onclick=\'mark("Pin");\'>Pin</a>';
	h += ' <a onclick=\'mark("RC");\'>RC</a>';
	h += ' <a onclick=\'tack();\'>Tack</a>';
	h += ' <a onclick=\'gybe();\'>Gybe</a>';
	h += ' <a onclick=\'setmob();\'>MOB</a>';
	h += '</p>';
	if (tracking == null) {
	    h += '<p><a onclick="recordtoggle();">Start GPS</a></p>';
	} else {
	    h += '<p><a onclick="recordtoggle();">Finish</a></p>';
	}

	if (series != null) {
	    h += '<p>Series: ' + series;
	    if (course != null)
		h += '  Course: ' + course;
	    h += '</p>';
	}
	if (error != null) h += '<p class="error">' + error + '</p>';
	if (c != null) h += '<p>Latitude, Longitude: ' + llfmt(c) + ', ' + ct + '</p>';
	if ('Pin' in marks) h += '<p>Pin Set</p>';
	if ('RC' in marks) h += '<p>RC Set</p>';
	if (mob) h += '<p class="mob">MOB Set</p>';
	if (racestart != null) h += '<p>Race Start: ' + ctfmt(racestart) + '</p>';
	if (tacks.length > 0) h += '<p>Last Tack: ' + llfmt(tacks[tacks.length-1]) + '</p>';
	if (gybes.length > 0) h += '<p>Last Gybe: ' + llfmt(gybes[gybes.length-1]) + '</p>';

	break;
    case 1:
	h += '<p><a onclick="pagemode(0);">Race</a></p>';

	h += '<p>Select Start: <select onChange="setstart(this.options[this.selectedIndex].value);">';
	h += '<option>Choose:</option>';
	for (const s of starttimes)
	    h += '<option>'+s+'</option>';
	h += '</select></p>';

	h += '<p>Select Series: <select onChange="setseries(this.options[this.selectedIndex].value);">';
	h += '<option>Choose:</option>';
	sl = Object.keys(routes).sort();
	for (const s of sl)
	    h += '<option>'+s+'</option>';
	h += '</select></p>';

	if (series != null) {
	    h += '<p>Select Course: <select onChange="setcourse(this.options[this.selectedIndex].value);">';
	    h += '<option>Choose:</option>';
	    sl = Object.keys(routes[series]).sort();
	    for (const s of sl)
		h += '<option>'+s+'</option>';
	    h += '</select></p>';
	}

	break;
    }
    e.innerHTML = h
}

function getpermission() {
    navigator.permissions.query({
	name: 'geolocation'
    }).then(function(result) {
	if (result.state != 'granted')
	    seterror("This application requires geolocation permission to be set to granted.");
    });
}

function begin() {
    if ("geolocation" in navigator && "permissions" in navigator) {
	getpermission()
	drawpage()
    } else {
	seterror("This application doesn't work in this browser");
	drawpage()
    }
}

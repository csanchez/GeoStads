//Ests script se encarga de todas las funciones referentes a los mapas
//objeto mapa, layer, database, asi como las funciones para desplegar marcadores y puntos

$(document).ready(function(){
	
	var po = org.polymaps;

	var radius = 10, tips = {};

	var map = po.map().container(document.getElementById("map").appendChild(po.svg("svg"))).zoom(7).add(po.interact()).on("move", move).on("resize", move);

	map.add(po.image().url(po.url("http://{S}tile.cloudmade.com/310220efba2b4d17979e5aaf5e657869/998/256/{Z}/{X}/{Y}.png").hosts(["a.", "b.", "c.", ""])));

var geo = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Point","coordinates":[-99.0,19.0]},"properties":{"cve_ent":9,"nom_ent":"Distrito Federal","cve_mun":4,"nom_mun":"Cuajimalpa de Morelos","cve_loc":10,"nom_loc":"Cruz Blanca"},"id":1},
{"type":"Feature","geometry":{"type":"Point","coordinates":[-99.19999999999999,19.25]},"properties":{"cve_ent":9,"nom_ent":"Distrito Federal","cve_mun":4,"nom_mun":"Cuajimalpa de Morelos","cve_loc":11,"nom_loc":"DUMMY LOC"},"id":2}]};
	
	map.add(po.geoJson()
	    .on("load", load)
			.on("show", show)
	    .features(geo.features));

	map.add(po.compass());

	function load(e) {
	  for (var i = 0; i < e.features.length; i++) {
	    var f = e.features[i];
	    f.element.setAttribute("r", radius);
	    f.element.addEventListener("mousedown", toggle(f.data), false);
	    f.element.addEventListener("dblclick", cancel, false);
	  }
	}

	function show(e) {
	  for (var i = 0; i < e.features.length; i++) {
	    var f = e.features[i], tip = tips[f.data.id];
	    tip.feature = f.data;
	    tip.location = {
	      lat: f.data.geometry.coordinates[1],
	      lon: f.data.geometry.coordinates[0]
	    };
	    update(tip);
	  }
	}

	function move() {
	  for (var id in tips) {
	    update(tips[id]);
	  }
	}

	function cancel(e) {
	  e.stopPropagation();
	  e.preventDefault();
	}

	function update(tip) {
	  if (!tip.visible) return; // ignore
		alert(map.locationPoint(tip.location).x+"  "+map.locationPoint(tip.location).y);
	  var p = map.locationPoint(tip.location);
	  tip.anchor.style.left = p.x - radius + "px";
	  tip.anchor.style.top = p.y - radius + "px";
	  $(tip.anchor).tipsy("show");
	}

	function toggle(f) {
	  var tip = tips[f.id];
	  if (!tip) {
	    tip = tips[f.id] = {
	      anchor: document.body.appendChild(document.createElement("a")),
	      visible: false,
	      toggle: function(e) {
	        tip.visible = !tip.visible;
	        update(tip);
	        $(tip.anchor).tipsy(tip.visible ? "show" : "hide");
	        cancel(e);
	      }
	    };
	    tip.anchor.style.position = "absolute";
	    tip.anchor.style.visibility = "hidden";
	    tip.anchor.style.width = radius + "px";
	    tip.anchor.style.height = radius  + "px";
	    $(tip.anchor).tipsy({
	      html: true,
	      fallback: f.properties.nom_loc,
	      gravity: $.fn.tipsy.autoNS,
	      trigger: "manual"
	    });
	  }
	  return tip.toggle;
	}
});
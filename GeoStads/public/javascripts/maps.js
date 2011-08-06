//Ests script se encarga de todas las funciones referentes a los mapas
//objeto mapa, layer, database, asi como las funciones para desplegar marcadores y puntos





 function load_markers(e) {
      for (var i = 0; i < e.features.length; i++) {
          var f = e.features[i];
          f.element.setAttribute("r", radius);
          f.element.addEventListener("mousedown", toggle_markers(f.data), false);
          f.element.addEventListener("dblclick", cancel_markers, false);
      }
  };
  function show_markers(e) {
      for (var i = 0; i < e.features.length; i++) {
          var f = e.features[i],
          tip = tips[f.data.id];
          tip.feature = f.data;
          tip.location = {
              lat: f.data.geometry.coordinates[1],
              lon: f.data.geometry.coordinates[0]
          };
          update_markers(tip);
      }
  };

  function move_markers() {
      for (var id in tips) {
          update_markers(tips[id]);
      }
  };

  function cancel_markers(e) {
      e.stopPropagation();
      e.preventDefault();
  };

  function update_markers(tip) {
      if (!tip.visible) return;
      // ignore
      //alert(map.locationPoint(tip.location).x+"  "+map.locationPoint(tip.location).y);
      var p = map.locationPoint(tip.location);
      tip.anchor.style.left = p.x + 50 + "px";
      tip.anchor.style.top = p.y + 130 + "px";
      $(tip.anchor).tipsy("show");
  }

  function toggle_markers(f) {
      var tip = tips[f.id];
      if (!tip) {
          tip = tips[f.id] = {
              anchor: document.body.appendChild(document.createElement("a")),
              visible: false,
              toggle: function(e) {
                  tip.visible = !tip.visible;
                  update_markers(tip);
                  $(tip.anchor).tipsy(tip.visible ? "show": "hide");
                  cancel_markers(e);
              }
          };
          tip.anchor.style.position = "absolute";
          tip.anchor.style.visibility = "hidden";
          tip.anchor.style.width = radius + "px";
          tip.anchor.style.height = radius + "px";
          $(tip.anchor).tipsy({
              html: true,
              fallback: "<p>" + f.properties.nom_loc + "</p><p>" + f.properties.nom_mun + "</p>",
              trigger: 'hover'
          });
      }
      return tip.toggle;
  };



function initilizeMap(){
	var map = po.map().container(document.getElementById("map").appendChild(po.svg("svg"))).zoom(7).add(po.interact()).on("move", move_markers).on("resize", move_markers);
	map.add(po.image().url(po.url("http://{S}tile.cloudmade.com/310220efba2b4d17979e5aaf5e657869/998/256/{Z}/{X}/{Y}.png").hosts(["a.", "b.", "c.", ""])));
	map.add(po.compass());
	return map;
};

function add_markers(features){
    var layer = po.geoJson().on("load", load_markers).on("show", show_markers).features(features);
    map.add(layer);
    return layer;
    
};
function add_marker(features){
    var layer = po.geoJson().on("load", load_markers).on("show", show_markers).features(features);
    map.add(layer);
    return layer;   
};
function add_polygons(features){
    var layer =  po.geoJson().features(features);
    map.add(layer);
    return layer;
};
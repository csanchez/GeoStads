//Ests script se encarga de todas las funciones referentes a los mapas
//objeto mapa, layer, database, asi como las funciones para desplegar marcadores y puntos

var Map = function(){
    this.id="";
    this.tag="";
    this.data_bases={}; 
    this.layers={};
    this.description="Nuevo mapa";
    this.title="Nuevo mapa";
		this.po = org.polymaps;
		this.map;
};


Map.prototype.display = function (map_tag){
	this.map = this.po.map().container(document.getElementById(map_tag).appendChild(this.po.svg("svg"))).zoom(0).add(this.po.interact());
	this.map.add(this.po.image().url(this.po.url("http://{S}tile.cloudmade.com/310220efba2b4d17979e5aaf5e657869/998/256/{Z}/{X}/{Y}.png").hosts(["a.", "b.", "c.", ""])));
	this.map.add(this.po.compass());
	return this;
};


/**
 cambia la visibilidad de una capa.
 @param id Identificador de la capa a modificar
 @param value true para mostrar, false para ocultar
*/
Map.prototype.set_layer_visible = function(id,value){
	this.layers[id].layer.visible(value);
}


/**
 Añade una base de datos al mapa y crea la capa para el mapa
*/
Map.prototype.add_db = function(db_name, markers,query){
	this.data_bases[db_name] = new DB(markers.attributes, db_name,"Nueva BD");
	var layer = this.po.geoJson().features(markers.markers.features).on("load",load).id(db_name);
	this.map.add(layer);
	this.layers["layer_"+db_name] = new Layer(layer,query,"Base de datos",db_name.toUpperCase())//layer;
	return this.data_bases[db_name];	
}




	

Map.prototype.get_db = function (db_name){
	return this.data_bases[db_name];
}

Map.prototype.get_db_id = function(db_name){
	return this.data_bases[db_name].id;
}

Map.prototype.add_markers = function(features,id,desc,title,query){
    var layer = this.po.geoJson().features(features).on("load",load).id(id);
    this.map.add(layer);
		this.layers[id]=new Layer(layer,query,desc,title)//layer;
    return layer;
};



Map.prototype.get_layer = function(layer_name){
	return this.layers[layer_name];
}

Map.prototype.add_layer = function (layer_name,markers){
	this.layers[layer_name] = this.add_marker(markers.features);
}


Map.prototype.add_marker = function(feature,id,desc,title,query){
	  var layer = this.po.geoJson().features(feature).on("load",load).id(id);
	  this.map.add(layer);
		this.layers[id]=new Layer(layer,query,desc,title)
	  return layer;  
};
Map.prototype.load_marker= function(e) {
      e.features[0].element.setAttribute("class",e.features[0].data.properties.class);
};

Map.prototype.has_grid = function(){
	  return !(this.layers["grid"] == undefined)
}

Map.prototype.remove_layer = function(id){
	this.map.remove(this.layers[id].layer);
	delete this.layers[id];
}




Map.prototype.add_polygons = function(features){
    var layer =  this.po.geoJson().features(features);
    this.map.add(layer);
    return layer;
};

Map.prototype.db_size = function(){
	return Object.keys(this.data_bases).length;
}

Map.prototype.draw_line = function(feature){
		console.log(feature[0].id);
	  var layer = this.po.geoJson().features(feature).id(feature[0].properties.id);
	  this.map.add(layer);
		this.layers[feature[0].properties.id]=new Layer(layer,"",feature[0].properties.description,feature[0].properties.description)
		return 	layer;  
};



function load(e){
	var clas = e.features[0].data.properties.class
	$.each(e.features,function(index,ele){
		//console.log(ele);
		ele.element.setAttribute("class",ele.data.properties.class+" point");
		ele.element.setAttribute("id",ele.data.properties.id);
		ele.element.setAttribute("vecino","");
		ele.element.setAttribute("prom_vecino","");
		ele.element.setAttribute("lon",ele.data.geometry.coordinates[0]);
		ele.element.setAttribute("lat",ele.data.geometry.coordinates[1]);
		ele.element.setAttribute("fill",ele.data.properties.html_color);
		ele.element.setAttribute("stroke",ele.data.properties.html_color);
		ele.element.addEventListener("click", function(){
			
			$("#nearest_neighbor_dialog #content").empty();
			$("#nearest_neighbor_dialog #content").append(
				  "<div>"+
						"<h3> Entidad:</h3>"+ele.data.properties.nom_ent+
					  "<h3> Municipio: </h3>"+ele.data.properties.nom_mun+
						"<h3> Localidad: </h3>"+ele.data.properties.nom_loc+
						"<h3>Promedio al vecino mas cercano:</h3>"+$("#"+ele.data.properties.id).attr("prom_vecino")+
						"<h3>Vecino mas cercano: </h3>"+$("#"+ele.data.properties.id).attr("vecino")+
			"</div>");
			$("#nearest_neighbor_dialog #content").dialog({
				title: "INFORMACION ("+ele.data.geometry.coordinates+")",
				resizable: false,
				open: function(){},
				close:function(){$("#nearest_neighbor_dialog").append("<div id='content'> </div>");},
				buttons: { "Cerrar": function() {$(this).dialog("close");}}
				});
			}, false);
	});
		
	
	}


Map.prototype.create_grid = function (grid_size){
	    //de ancho las coordenadas son -180,0 a 180,0  de alto 0,-90 a 0,90
		/*
				Mexico esta entre las coordenadas 
				[-117.3, 32.6], izq sup
				[-117.3, 14  ], izq inf
			  [-86,    32.6], der sup 
				[-86,    14  ], der inf		
			*/
			var long = -117.3;
	    var lat = 32.6;
			var features = [];
			while(long <= -86 ){
				
				features.push(
					{"type": "Feature",
					 "geometry" :{
												 "type" : "LineString",
												 "coordinates" : [[long, 32.6 ],[long, 14]]
												},
					 "properties":{
												 "class" : "line_grid"
												}
					});
					long = long + grid_size;
			}
			
			while(lat >= 14 ){
				
				features.push(
					{"type": "Feature",
					 "geometry" :{
												 "type" : "LineString",
												 "coordinates" : [[-117.3, lat ],[-86, lat]]
												},
					 "properties":{
												 "class" : "line_grid"
												}
					});
					lat = lat - grid_size;
			}
			var layer =  this.po.geoJson().features(features);
	    this.map.add(layer);
			this.layers["grid"] = new Layer(layer,"null","Rejilla","Rejilla");
			return layer;
	
	}
	
/*	function load_grid(e) {
	    //e.features[0].element.setAttribute("class",e.features[0].data.properties.class);
	    for (var i = 0; i < e.features.length; i++) {
	          e.features[i].element.setAttribute("class",e.features[i].data.properties.class);
	      }
	  };

*/

/*function contains_db(db){
	current_map.data_bases[$("#load_db_dialog input[name=database]:checked").val()]!=undefined)
}*/
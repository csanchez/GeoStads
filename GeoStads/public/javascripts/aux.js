//DRFINICION DE OBJETOS
var DB  = function(attributes,id,desc){
   this.id=id;
   this.attributes=attributes;//los atributos de esa base de datos
   this.description=desc;
}

var Layer = function(layer,query,desc,title){
    this.layer=layer; //todos los marcadores visibles en el mapa actual
    this.description=desc;
    this.title=title;
		this.query = query;
}


/*
DB.prototype.add_layer = function(layer){
	this.layer = layer; 
}







var po;
var map;*/
var num_maps = 1;
var maps=[];
var radius = 5;
var tips = {};
var polygons;


var db_layer_count=1;




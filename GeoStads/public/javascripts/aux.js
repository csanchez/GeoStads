//DRFINICION DE OBJETOS
var DB  = function(json,id){
   this.id=id;
   this.markers= json.markers;
   this.attributes=json.attributes;//los atributos de esa base de datos
   this.description="Nueva BD";
   this.title="Nueva BD";
   this.object;
}

var Map = function(){
    this.id="";
    this.tag="";
    this.data_bases={}; 
    this.layers={};//layer,grid,polygons
    this.description="Nuevo mapa";
    this.title="Nuevo mapa";
};

var Layer = function(){
    this.id="";
    this.markers=[]; //todos los marcadores visibles en el mapa actual
    this.description="Nueva capa";
    this.title="Nueva capa";
    this.visible=true;
}
var po;
var map;
var num_maps = 1;
var maps=[];
var radius = 5;
var tips = {};
var current_map = new Map();
var polygons;

//Funciones auxiliares




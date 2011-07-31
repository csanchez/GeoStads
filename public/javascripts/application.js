// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/*TODO 

BUSQUEDAS WHERE DESDE AKI A LA BASE DE DATOS
procesaro la media espacial
faltan mas herramientas para datamining

 */
//EXTERNAL
$(document).ready(function(){
	//Descripcion de las bases de datos
	var inegi_description = "Base de datos del iter del inegi-df";
	var inegi_title ="INEGI ITER DF";
	var DB = function(){this.markers=[];}

	var Map = function(){
	    this.tag="";  //div que hace referencia a la pestaña del acordeon
	    this.h3="";
	    this.markers=[]; 
	    this.data_bases={};//tambien es un mapa
	    this.attributes=[];
	    this.layers={};
	    this.description="";	    
	};
	Map.prototype.simply_markers = function(){
	    var s_markers=[];
	    var it = Iterator(this.markers, true);
	    for (var key in it){
		s_markers.push({"description":this.markers[key].description,"title":this.markers[key].title,"lng":this.markers[key].lng,"lat":this.markers[key].lat,"picture":this.markers[key].picture});
	    }
	    return s_markers;
	};
	
	
	var num_maps = 1;
	var maps=[];
	
	var current_map = new Map();
	current_map.tag=$("#map_1");
	current_map.h3=$("#h3_map_1");
	maps.push(current_map);

	$( "#tabs" ).tabs();


	$( "#accordion" ).livequery(function(){
 	  $( "#accordion" ).accordion();
	  $("#new_map").live('click',function(){
	    current_map = new Map();	  
	    num_maps++;
	    $("#accordion h3").first().before(
            "<h3 id='h3_map"+num_maps+"'><a href=#>Mapa "+num_maps+"</a></h3>"+
             "<div id='map_"+num_maps+"' map='"+num_maps+"' >"+
               "<div class='description'></div>"+
               "<div class='attributes_db'></div>"+
               "<div class='layers'></div>"+
             "</div>");
	     current_map.tag=$("#map_"+num_maps);
	     current_map.h3=$("#h3_map_"+num_maps);
	     maps.push(current_map);
	     //añadimos el evento change, asi al cambiar de pestaña se actualiza el current_map para trabajar sobre el
	     $( "#accordion" ).accordion('destroy').accordion({change: function(event, ui) {current_map=maps[parseInt($(ui.newContent).attr("map"))-1];}});
	     
	  });
	  
	});


	/*
	  Añade una base de datos a un mapa para trabajar con ella.
	  verifico que no este la base de datos en el mapa, de estarlo,  no hace nada; en otro caso, realiza la llamada en ajax
	  y devuelve los marcadores de la base de datos y los atributos en formato JSON.
	 */
	$("#tabs-1 input[name=database]").click(function(){
		/*if(current_map.data_bases.indexOf($("#tabs-1 input[name=database]:checked").val())!=-1)
	    return;
	    current_map.data_bases.push($("#tabs-1 input[name=database]:checked").val());*/

	  if(current_map.data_bases[$("#tabs-1 input[name=database]:checked").val()]!=undefined)
	    return;
	  current_map.data_bases[$("#tabs-1 input[name=database]:checked").val()] = new DB();
	  $.ajax({
	    url: "/geo_stads/new",
	    dataType: "json",
	    data: "database="+$("#tabs-1 input[name=database]:checked").val(),
	    type: "GET",
	    success: addMarkers_for_database
	  });
        })
	    /*
	      Ejecuta una llamada ajax para devolver la media espacial del atributo especificado
	     */
	$("#spatial_mean").click(function(){
	  if(current_map.layers["spatial_mean_"+$("input[name=attribute_db]:checked").val()] != undefined)
	      return;//faltaria cargar el layer con esa media espacial  
	  $.ajax({
	    url: "/spatial_mean",
	    dataType: "json",
	    data: "spatial_mean="+current_map.tag.find("input[name=attribute_db]:checked").val(),
	    type: "GET",
	    success: respond_to_spatial_mean
	  });
        })

	 
	    /*
	      Esta funcion se encarga de mostrar en pantalla solo aquel grupo de marcadores que se deseen ver.
	     */
	    /*var markers_visibles=[];
	    $("#"+current_map.tag.attr("id")+" input:checkbox:checked").live('click',each(
	    jQuery.each($("#map_1 input:checkbox:checked"),function(index,element){
		    
 
            })*/
	    $("#"+current_map.tag.attr("id")+" input:checkbox").live('click',function(){
	      var markers=[];
	      var text;
	      $(".checkbox_database:checked").each(function(index){
	        markers= markers.concat(current_map.data_bases[$(this).attr("name")].markers);
              });
	      
	      $(".checkbox_layer:checked").each(function(index){
   	        markers=markers.concat(current_map.layers[$(this).attr("name")].markers);
              });
	      Gmaps4Rails.replaceMarkers(markers);	    
	    });
	    
	/*$(".checkbox_database").live('click',function(){
	      var markers=[];
	      var text;
	      $(".checkbox_database:checked").each(function(index){
	        markers= markers.concat(current_map.data_bases[$(this).attr("name")].markers);
              });
	      
	      $(".checkbox_layer:checked").each(function(index){
   	        markers=markers.concat(current_map.layers[$(this).attr("name")].markers);
              });
	      Gmaps4Rails.replaceMarkers(markers);
	      });

	$(".checkbox_layer").click(function(){
		    Gmaps4Rails.replaceMarkers(current_map.layers[$(".checkbox_database:checked").attr("name")].markers());
		});
	*/
	/*
	      FUNCIONES QUE PROCESAN LOS MARCADORES DESPUES DE LAS LLAMADAS AJAX
	     */
	    
	/*
	  Procesa los marcadores nuevos traidos al realizar una busqueda de la base de datos.
	  //kizas esto no me sirva de nada
	  añade al mapa actual los marcadores de la base de datos //y atributos para ya no ir por ellos despues

	  crea la estructura en html para una base datos
	  <div class='databases'>
            <div id='base_del_input' class='database'>
	      <div class=.description'>
	        Descripcion de la BD y campo checkbox para mostrar o quitar marcadores
	      </div>
	      <div class='attributes'>
	        <ul>
		  <li>
		  <li>
		<ul>
	      </div>
	    </div>
          </div>
        */
	function addMarkers_for_database(resp){
	    Gmaps4Rails.addMarkers(resp.markers);
	    current_map.data_bases[$("#tabs-1 input[name=database]:checked").val()].markers = resp.markers;
	    current_map.tag.find(".databases").append(
            "<div class='database' id='"+$("#tabs-1 input[name=database]:checked").val()+"'>"+
               "<div class='description'>"+
	          "<p>Base de datos: <strong>"+inegi_title+"</strong><input type='checkbox' CHECKED  class='checkbox_database' name='"+$("#tabs-1 input[name=database]:checked").val()+"'/></p>"+
	          "<p>Descripcion: "+inegi_description+"</p>"+
	       "</div>"+
	       "<div class='attributes'>"+
	          "<p>Atributos</p>"+
                  "<ul></ul></div>"+
            "</div>");
	    //$(".databases #"+$("#tabs-1 input[name=database]:checked").val()+" input[name="+$("#tabs-1 input[name=database]:checked").val()+"]").attr("checked","true");
	    $.each(resp.attributes, function(index) { 
		    current_map.tag.find(".databases #"+$("#tabs-1 input[name=database]:checked").val()+" .attributes ul").append("<li><input type='radio' name='attribute_db' class='attribute_db' id='attribute_"+resp.attributes[index].attribute+"' value='"+resp.attributes[index].attribute+"'/>&nbsp;"+resp.attributes[index].attribute+"</li>");	    });
	}

	

	/*
	  FUNCIONES DE ESTADISTICA ESPACIAL
	  Crea una capa para el mapa especificado, una capa es un mapa mas con un cjto de marcadores,sin  atributos(por ahora), 
	  y genera la siguiente estructura en html
	  <div class=layers>
	    <ul>
	      <li id='cve_capa'>Nombre de capa checkbox</li>
	    </ul>
	  </div>
	 */
	function respond_to_spatial_mean(resp){
	    current_map.tag.find(".layers ul").append(
              "<li class='layer' id='spatial_mean_"+$("input[name=attribute_db]:checked").val()+"'> Media espacial:"+$("input[name=attribute_db]:checked").val()+"<input type='checkbox'  CHECKED   class='checkbox_layer' name='spatial_mean_"+$("input[name=attribute_db]:checked").val()+"' /></li>");
            var layer = new Map();
	    layer.tag = current_map.tag.find(".layers ul li#spatial_mean_"+$("input[name=attribute_db]:checked").val());
	    layer.markers = resp;   
	    layer.attributes.push($("input[name=attribute_db]:checked").val());
	    layer.description="Media espacial del atributos "+$("input[name=attribute_db]:checked").val();
	    current_map.layers["spatial_mean_"+$("input[name=attribute_db]:checked").val()]=layer;
	    Gmaps4Rails.addMarkers(resp);
	}





	

	
	
	
	
	/*    
	var polygons=[];
	function render(records, data) {
		
	    for (var i = 0; i < records.length; i++) {
		var record = records[i];
		console.log("record");
		console.log(records[i]);
		if (record.shapeType == ShpType.SHAPE_POLYGON || record.shapeType == ShpType.SHAPE_POLYLINE) {
		    for (var j = 0; j < record.shp.rings.length; j++) {
			var ring = shp.rings[j];
			for (var k = 0; k < ring.length; k++) {//falta sacar la x y y de los puntos
			    if (!box) {
				box = { x: ring[k].x, y: ring[k].y, width: 0, height: 0 };
			    }
			    else {
				var l = Math.min(box.x, ring[k].x);
				var t = Math.min(box.y, ring[k].y);
				var r = Math.max(box.x+box.width, ring[k].x);
				var b = Math.max(box.y+box.height, ring[k].y);
				box.x = l;
				box.y = t;
				box.width = r-l;
				box.height = b-t;
			    }
			}
		    }
		}
		
	    }*/

	    /*$("#poligon").click(function(){
	      alert("hara poligonos");
	      var polygons=[[{"lng": "-80.190262", "lat": "25.774252","strokeColor": "#FF0000","strokeOpacity": 0.3,"strokeWeight": "1","fillColor": "#FF0000","fillOpacity": "0.7"},{"lng": "-66.118292", "lat": "18.466465"}, {"lng": "-64.75737", "lat": "32.321384"}],[{"lng":   "0", "lat":   "0"},{"lng":  "10", "lat":  "10"},{"lng": "-10", "lat": "-10"}]];
	      Gmaps4Rails.polygons=polygons;
	      Gmaps4Rails.create_polygons();
	      });
	    */


});



// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/*TODO 

BUSQUEDAS WHERE DESDE AKI A LA BASE DE DATOS
procesaro la media espacial
faltan mas herramientas para datamining

 */
$(document).ready(function(){
	//mapa
	po = org.polymaps;
	map = initilizeMap(po);
	
	current_map.id=num_maps;
	maps.push(current_map);
	$.ajax({
	    url: "get_polygons",
	    dataType: "json",
	    type: "GET",
		    success: function(resp){polygons = add_polygons(resp.features) }
	  });
	
	
	$("#remove_poly").click(function(){polygons.visible(false)});
	$("#add_poly").click(function(){polygons.visible(true)});
	/*
	  Añade una base de datos a un mapa para trabajar con ella.
	  verifico que no este la base de datos en el mapa, de estarlo,  no hace nada; en otro caso, realiza la llamada en ajax
	  y devuelve los marcadores de la base de datos y los atributos en formato JSON.
	 */
	$("#tabs-1 input[name=database]").click(function(){
	  if(current_map.data_bases[$("#tabs-1 input[name=database]:checked").val()]!=undefined)
	    return;
	  $.ajax({
	    url: "get_db",
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
	    url: "spatial_mean",
	    dataType: "json",
	    data: "spatial_mean="+$("input[name=attribute_db]:checked").val(),
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
	    /*
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
	    });*/
	    


	    
	/*
	  Procesa los marcadores nuevos traidos al realizar una busqueda de la base de datos.
	  añade al mapa actual los marcadores de la base de datos
        */
	function addMarkers_for_database(resp){
	    var db = new DB(resp,$("#tabs-1 input[name=database]:checked").val());
	    
	    db.object = add_markers(resp.markers.features);
	    
	    
	    current_map.data_bases[$("#tabs-1 input[name=database]:checked").val()] = db;
	    $("#databases_button").removeAttr("disabled");
	    $("#layers_button").removeAttr("disabled");
	    $("td#menu_options #databases_layers").append(
              "<div id='database_"+db.id+"' class='database' "+
	        "<p> Base de datos: "+db.id.toUpperCase()+
	        "<input type='checkbox' CHECKED  class='checkbox_database' name='"+db.id+"'/></p>"+
	        "<p> Atributos </p>"+
	        "<ul class='database_attributes'>"+
	        "</ul>"+
	      "</div>");	    
	    // $("td#menu_options #databases_layers  #database_"+db.id+" input[name="+db.id+"]")
	    $("td#menu_options #databases_layers  #database_"+db.id+" input[name="+db.id+"]").click( function(){
	      if( $(this).is(':checked') ) db.object.visible(true);
	      else db.object.visible(false);
	    });
	    $.each(resp.attributes, function(index) {
	        $("td#menu_options #databases_layers #database_"+db.id+" ul").append(
                  "<li>"+
		    "<input type='radio' name='attribute_db' class='attribute_db' id='attribute_"+resp.attributes[index]+"' value='"+resp.attributes[index]+"'/>&nbsp;"+resp.attributes[index]+
		  "</li>");
		$("td#menu_options #databases_layers #database_"+db.id+" ul  input#attribute_"+resp.attributes[index]).click(function(){
			$( "#dialog" ).dialog( "open" );
		    });
             });
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
	    
	    $("#layers").append(
            "<div class='layer' id='spatial_mean_"+$("input[name=attribute_db]:checked").val()+"'>"+
              "<p>Media espacial:"+$("input[name=attribute_db]:checked").val()+
                "<input type='checkbox'  CHECKED   class='checkbox_layer' name='spatial_mean_"+$("input[name=attribute_db]:checked").val()+"' /></p>"+
            "</div>");
	    current_map.layers["spatial_mean_"+$("input[name=attribute_db]:checked").val()] = add_marker(resp.features);

            /*var layer = new Map();
	    layer.tag = current_map.tag.find(".layers ul li#spatial_mean_"+$("input[name=attribute_db]:checked").val());
	    layer.markers = resp;   
	    layer.attributes.push($("input[name=attribute_db]:checked").val());
	    layer.description="Media espacial del atributos "+$("input[name=attribute_db]:checked").val();
	    current_map.layers["spatial_mean_"+$("input[name=attribute_db]:checked").val()]=layer;
	    Gmaps4Rails.addMarkers(resp);*/
	}


	
/*	
	
	
			

	
	
var shpLoader = new BinaryAjax("../shapefiles/df/df.shp", onShpComplete, onShpFail);
var dbfLoader = new BinaryAjax("../shapefiles/df/df.dbf", onDbfComplete, onDbfFail);
var shpFile;
var dbfFile;	

function onShpFail() { 
    alert('failed to load shfile'  );
}
function onDbfFail() { 
    alert('failed to load dbf'  );
}

function onShpComplete(oHTTP) {
    var binFile = oHTTP.binaryResponse;
    if (window.console && window.console.log) console.log('got data, parsing shapefile');
    shpFile = new ShpFile(binFile);
    
    if (dbfFile) {
	getPolygons(shpFile.records, dbfFile.records);
    }
}
	
function onDbfComplete(oHTTP) {
    var binFile = oHTTP.binaryResponse;  
    if (window.console && window.console.log) console.log('got data, parsing dbf file');
    dbfFile = new DbfFile(binFile);
    console.log(dbfFile);
    if (shpFile) {
	getPolygons(shpFile.records, dbfFile.records);
    }
}


function getPolygons(records, data){
    var polygons="";
    var record = records[0];
    console.log(record);
    
    //  alert("POLYGON("+record.shape.rings+"}");
    //for (var i = 0; i < records.length; i++) {
	var record = records[16];
	
	if (record.shapeType == ShpType.SHAPE_POLYGON){
	    polygons+="POLYGON((";
	   for (var j = 0; j < record.shape.rings.length; j++) {
		var ring = record.shape.rings[j];
		//polygons+="[";
		for (var k = 0; k < ring.length-1; k++) {//falta sacar la x y y de los puntos
		    //console.log("coord "+ring[k].x+" "+ring[k].y);
		    polygons+=ring[k].x+" "+ring[k].y+",";
		}
		polygons+=ring[ring.length-1].x+" "+ring[ring.length-1].y+",";
		//polygons+="],";
	    } 
	   polygons+="))\n";
	}
	console.log(	polygons);
	
	
	//}
}


*/






	$("#databases_button").click(function () {
	  $( ".tab-div" ).hide("slide");
          $( "#databases_layers" ).toggle("slide" , null, 500 );
	});
	$("#show_db").click(function () {
		//$( ".tab-div" ).hide("slide");
   	  $( "#tabs-1" ).toggle("slide" , null, 500 );
	});

	$("#layers_button").click(function () {
	  $( ".tab-div" ).hide("slide");
   	  $( "#layers" ).toggle("slide" , null, 500 );
	});

	$( "#dialog" ).dialog({
			autoOpen: false,
			show: "blind",
		        hide: "explode",
		        width:"1230",
		    height:"200",
		    zIndex: "3999"
		});

	
});



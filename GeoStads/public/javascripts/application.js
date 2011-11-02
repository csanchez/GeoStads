// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

/*TODO 

BUSQUEDAS WHERE DESDE AKI A LA BASE DE DATOS
procesaro la media espacial
faltan mas herramientas para datamining

 */
$(document).ready(function(){
	
	/* -------------------------- Interfaz --------------------*/
	
	$( "#menu_tabs" ).tabs();
	$( "#file_a" ).click(function(){
			$( "#file" ).css("visibility","visible");		
	});	
	$( "#edit_a" ).click(function(){
			$( "#edit" ).css("visibility","visible");		
	});
	$( "#see_a" ).click(function(){
			$( "#see" ).css("visibility","visible");		
	});
	$( "#grid_a" ).click(function(){
			$( "#grid" ).css("visibility","visible");		
	});
	$( "#tools_a" ).click(function(){
			$( "#tools" ).css("visibility","visible");		
	});
	
	
	
	
	$( "#file ol" ).selectable({selected: function(event,ui){
		var d = $( ".ui-selected", this ).index();
		switch(d){
			case 0: 
					$( "#load_db_dialog" ).css("visibility","visible");
					$( "#load_db_dialog" ).dialog({
						title: "SELECCIONAR BASE DE DATOS",
						modal: true,
						resizable: false
					});break;
			case 1: alert("xport");break;
			case 2: alert("nuevo mapa");break;
		}//switch
	}
		});
		
	$( "#edit ol" ).selectable({selected: function(){alert("das");} });
	
	
	$( "#see ol" ).selectable({selected: function(){
		var d = $( ".ui-selected", this ).index();
		switch(d){
			case 0: 
			    if(current_map.db_size()==0){
						alert("Debes agregar almenos una base de datos");
						return;
					}
					$( "#see_db_dialog" ).css("visibility","visible");
					$( "#see_db_dialog" ).dialog({
						title: "Bases de datos",
						modal: true,
						resizable: false,
						buttons: { "Aceptar": function() {$(this).dialog("close");}}});
						break;
			case 1: 
			        if(polygons.visible()==true)
								polygons.visible(false);
						  else
								polygons.visible(true);
							break;
			case 2: 
			        $( "#layers_dialog" ).css("visibility","visible");
							$( "#layers_dialog" ).dialog({
								title: "CAPAS",
								resizable: false,
								width: "330",
								buttons: { "Aceptar": function() {$(this).dialog("close");}}});
			
							;break;
		}//switch
		}});
	$( "#grid ol" ).selectable({selected: function(){
		current_map.create_grid(10);}});
	$( "#tools ol" ).selectable({selected: function(){
		if(current_map.db_size()==0){
			alert("Debes agregar almenos una base de datos");
			return;
		}
		var d = $( ".ui-selected", this ).index();
		switch(d){
			case 0:
			  $( "#spatial_mean_dialog" ).dialog({
					title: "MEDIA ESPACIAL",
					modal: true,
					resizable: false,
					buttons: { "Calcular": function(){spatial_mean();$(this).dialog("close");}}
					});
					break;
			  case 1:
					 $( "#nearest_neighbor_dialog" ).dialog({
							title: "VECINO MAS CERCANO",
							modal: true,
							resizable: false,
							width: "auto",
							buttons: { "Calcular": function(){nearest_neighbor();$(this).dialog("close");}}});
							break;
				case 3:
							$( "#moran_dialog" ).dialog({
									title: "COEFICIENTE DE MORAN",
									modal: true,
									resizable: true,
									width: "auto",
									height:"auto",
									open: function(){
										$("#moran_dialog #slider").slider({
										  range: "min",
											value : 10,
											min: 0.02,
											max: 100,
											slide: function(){$("#moran_dialog #grid_size").text(parseInt($("#moran_dialog #slider").slider("value"))/100);},
											stop: function(){create_grid(parseInt($("#moran_dialog #slider").slider("value"))/100)}
										});
										$("#moran_dialog #grid_size").text("0.1");
									},
									buttons: { "Calcular": function(){
										moran(parseInt($("#moran_dialog #slider").slider("value"))/100);
									}}
									//
									});
							break
					
				case 6:
				  $( "#filter_dialog" ).dialog({
						title: "FILTRAR BASE DE DATOS",
						modal: true,
						resizable: false,
						buttons: { "Cargar": function() {load_db_from_filter($("#filter_dialog #filter_db_table input[name=database]").val());$(this).dialog("close");}}
					  });
						break;
		}//switch
	}});
	
	/*
		Estos eventos ocultan el menu cuando el raton sale fuera de su alcanze
	*/
	$( "#file" ).mouseleave(function(){$( "#file" ).css("visibility","hidden");});
	$( "#edit" ).mouseleave(function(){$( "#edit" ).css("visibility","hidden");});
	$( "#see" ).mouseleave(function(){$( "#see" ).css("visibility","hidden");});
	$( "#grid" ).mouseleave(function(){$( "#grid" ).css("visibility","hidden");});
	$( "#tools" ).mouseleave(function(){$( "#tools" ).css("visibility","hidden");});
	
	
	
	
	/**
		Este eventos e dispara al presionar sobre algunos de los botos para cargar la base de datos.
	*/
	$("#load_db_dialog button").click(function(){
		var db = $(this).attr("database");
		if(current_map.data_bases[db]!=undefined)
	    return;
		$.ajax({
	      url: "get_db",
	      dataType: "json",
	      data: "database="+db,
	      type: "GET",
	      success: function(resp){respond_to_get_db(db,resp);},
				complete: function(){$( "#load_db_dialog" ).dialog("close");}	
	    });
		
	})
	
	
	
	/**
	  cambiar ya no debe aparcer el checkbox en la base, si no que, en las capas, agregar la base de datos a capas
	  "<input type='checkbox'  CHECKED   name='layer' class='layer_checkbox layer_db' id='layer_"+db.id+"' />"+
	*/
	$("input[name=layer]:checkbox").live('click',function(){
		if($(this).is(":checked")==false)
			current_map.set_layer_visible($(this).attr("id"),false);
		else
			current_map.set_layer_visible($(this).attr("id"),true);
	});
	
	
	/**
		Este evento se dispara al selecciona una base de datos de la ventana para aplciar filtros
	*/
	$("#filter_dialog #data_bases input[name=database]").live('click',function(){
		show_db_for_filter($("#filter_dialog #data_bases input[name=database]").val());
	});


	//al seleccionar una base de datos sobre la cual obtener la media espacial,
	//busca las capas para mostraras
	//show_layer_for_database($("#spatial_mean_dialog #data_bases ul li input[name=database]").val());
	$("#spatial_mean_dialog #data_bases ul li input[name=database]").live('click',function(){
		
		$("#spatial_mean_dialog #content").append("<div id='spatial_mean_layers'><h3>Capas</h3></div>");
		//Pegamos todas las capas asociadas a una base de datos
		$("#layers_dialog #databases .layer_title").each( function(index) {
			  $("#spatial_mean_dialog #content #spatial_mean_layers").append($(this).text()+"&nbsp;&nbsp;&nbsp;<input type='radio'   name='spatial_mean_layer_checkbox' class='spatial_mean_checkbox layer_db' id='"+$(this).attr("layer")+"' /><br>");
		  });
		$("#spatial_mean_dialog #content").append("<div id='spatial_mean_atributes'><h3>Atributos</h3></div>");
		$("#spatial_mean_dialog #content div#spatial_mean_atributes").append("<ul></ul>");
		var db = current_map.get_db($("#spatial_mean_dialog #data_bases ul li input[name=database]").val());	
		$.each(db.attributes, function(index) {
		   $("#spatial_mean_dialog #content div#spatial_mean_atributes ul").append(
				"<li>"+db.attributes[index].attribute+"<input type='radio' class='spatial_mean_radio' name='"+db.attributes[index].attribute+"'></li>"
				);
		 });
	});
	
	//lo mismo para el vecino mas cercano, unificar esto
	$("#nearest_neighbor_dialog #databases table input[name=database]").live('click',function(){
		$("#nearest_neighbor_dialog #layers").append("<div><h3>Capas</h3></div>");
		$("#layers_dialog #databases .layer_title").each( function(index) {
			  $("#nearest_neighbor_dialog #layers").append($(this).text()+"&nbsp;&nbsp;&nbsp;<input type='radio'   name='nearest_neighbor_layer_checkbox' class='nearest_neighbor_checkbox layer_db' id='"+$(this).attr("layer")+"' /><br>");
		  });
	});
	
	$("#moran_dialog #databases table input[name=database]").live('click',function(){
		$("#layers_dialog #databases .layer_title").each( function(index) {
			  $("#moran_dialog #layers").append($(this).text()+"&nbsp;&nbsp;&nbsp;<input type='radio'   name='moran_layer_checkbox' class='moran_checkbox layer_db' id='"+$(this).attr("layer")+"' /><br>");
		  });
		  
			$("#moran_dialog").append("<div id='moran_attributes'><h3>Atributos</h3></div>");
			$("#moran_dialog #moran_attributes").append("<ul></ul>");
			var db = current_map.get_db($("#moran_dialog #databases input[name=database]").val());	
			$.each(db.attributes, function(index) {
				$("#moran_dialog #moran_attributes ul").append(
					"<li>"+db.attributes[index].attribute+"<input type='radio' class='moran_radio' name='moran_attribute' value='"+db.attributes[index].attribute+"' /></li>"
					);
			 });
		
	});
	
	
	
	
	/**
		Una vez selecciona una base datos para filtrarse, se procede a mostrar en la ventana los sliders para cada atributo
		del lado izquierdo esta el minimo valor del atributos, del lado derecho el maximo valor del atributos
		cada paso del slider esta calculado como el 10% del maximo valor
	*/
	function show_db_for_filter(database){
		
	  var num_td; 
		var num_tr;
		if(current_map.get_db(database).attributes.length<8){
			var num_td = 1; 
			var num_tr = current_map.get_db(database).attributes.length;
			
		}else{
			var num_td = current_map.get_db(database).attributes.length/8;
			var num_tr = (current_map.get_db(database).attributes.length/num_td)+1;
		}
		var aux1 = num_tr;
		var aux2 = num_td;
		var cad = "";
		
		$.each(current_map.get_db(database).attributes, function(index,value) {
				//si aun hay espacio para td's añadimos otro td si no, necesitamos un nuevo renglon
				/*if(cad =="")
					cad+="<tr>";
				if(aux2 > 0){
					cad += "<td>"+
					"<div class='slinder' id='spatial_mean_attr_"+value.attribute+"'>"+
				    "<p> "+
				      "<label for='slider_"+value.attribute+"'> Mínimo valor para "+value.attribute+"</label>"+
							"<label id='slider_"+value.attribute+"_value' style='border:0;color:#F6931F;font-weight:bold;'> "+value.min+"</label>"+
			        "<div class='slider' attr='"+value.attribute+"' id='slider_"+value.attribute+"'></div>"+
						"</p>"+
			    "</div>"+
					"</td>";
					aux2--;}
			  else{
					cad+="</tr>";
				aux2 = 	num_td;
				$("#filter_dialog #content table").append(cad);
				cad ="";
				}
				*/	
				
				$("#filter_dialog #content").append(
					  "<div id='spatial_mean_attr_"+value.attribute+"'>"+
					    "<p> "+
					      "<label for='slider_"+value.attribute+"'> Mínimo valor para "+value.attribute+"</label>"+
								"<label id='slider_"+value.attribute+"_value' style='border:0;color:#F6931F;font-weight:bold;'> "+value.min+"</label>"+
				        "<div class='slider' attr='"+value.attribute+"' id='slider_"+value.attribute+"'></div>"+
							"</p>"+
				    "</div>");
			
			$("#filter_dialog #content div#spatial_mean_attr_"+value.attribute+" div#slider_"+value.attribute).slider({
					value:value.min,
					min: value.min,
					max:value.max,
					step:parseInt(value.max*0.1),
					range:"max",
					slide: function(event,ui){$("#filter_dialog #content div#spatial_mean_attr_"+value.attribute+" label#slider_"+value.attribute+"_value").text(ui.value);}
										
				});
		});
		
		
	}
	
	/*
	  Recibe el tamaño de la rejilla, si no existe ya la capa con la rejilla entonces la crea, en otro caso se reemplaza
	*/
	function create_grid(grid_size){
		if(current_map.has_grid()){
			current_map.remove_layer("grid");
		}
	  current_map.create_grid(grid_size);
	}
	

	
	
	/* -------------------------- Funciones --------------------*/
	
	
	current_map = new Map().display("map");
	current_map.id=num_maps;
	maps.push(current_map);
	
	
	
	current_map.map.add(current_map.po.geoJson()
	    .features([
		{
	  "geometry": {
	    "coordinates": [-117.3, 32.6],
	    "type": "Point"
	  }},
		{
	  "geometry": {
	    "coordinates": [-86, 32.6],
	    "type": "Point"
	  }},
		{
	  "geometry": {
	    "coordinates": [-86, 14],
	    "type": "Point"
	  }},
		
	    ]));
	/**
	* Coloca los poligonos en el mapa al cargar la vista por primera vez
	*/
	/*$.ajax({
	    url: "get_polygons",
	    dataType: "json",
	    type: "GET",
		    success: function(resp){polygons = current_map.add_polygons(resp.features) }
	  });*/
	
	
	function load_db_from_filter(database){
		var values="";
		$.each($("#filter_dialog #content div.slider"), function(index,value) {
			values += "values["+$(value).attr("attr")+"]="+$(value).slider("option","value")+"&";
	});
	$.ajax({
	      url: "get_db",
	      dataType: "json",
	      data: "database="+database+"&"+values,
	      type: "GET",
	      success: function(resp){respond_to_get_db_filter(resp,values);}
	    });
	}
  
	/*
	   Ejecuta una llamada ajax para devolver la media espacial del atributo especificado
	 */
	function spatial_mean(){
		var values="";
		$("#spatial_mean_dialog #content div#spatial_mean_atributes ul input.spatial_mean_radio:checked").each(function(index) {
		  if(current_map.layers["spatial_mean_"+$(this).val()] == undefined){
			  values += "spatial_mean["+$(this).attr("name")+"]="+$(this).attr("name")+"&";
			}
		});
		//var layer = current_map.get_layer($("#spatial_mean_dialog #content div#spatial_mean_layers input[name=spatial_mean_layer_checkbox]:checked").attr("id"));
		$.ajax({
		    url: "get_spatial_mean",
		    dataType: "json",
		    data: values+current_map.get_layer($("#spatial_mean_dialog #content div#spatial_mean_layers input[name=spatial_mean_layer_checkbox]:checked").attr("id")).query,
		    type: "GET",
		    success: function(resp){respond_to_spatial_mean(resp,values);}
		 });
  	}

function nearest_neighbor(){
	//alert(current_map.get_layer($("#nearest_neighbor_dialog #nearest_neighbor_layers input[name = nearest_neighbor_layer_checkbox]:checked").attr("id")).query);
	$.ajax({
	    url: "get_nearest_neighbor",
	    dataType: "json",
	    data: current_map.get_layer($("#nearest_neighbor_dialog #layers input[name = nearest_neighbor_layer_checkbox]:checked").attr("id")).query,
	    type: "GET",
	    success: respond_nearest_neighbor
	 });
	}
	
	function moran(grid_size){
		$.ajax({
		    url: "get_moran",
		    dataType: "json",
		    data: "database="+$("#moran_dialog #databases input[name=database]:checked").val()+"&moran_attribute="+$("#moran_dialog #moran_attributes input[name=moran_attribute]:checked").val()+"&grid_size="+parseInt($("#moran_dialog #slider").slider("value"))/100+"&"+current_map.get_layer($("#moran_dialog #layers input[name = moran_layer_checkbox]:checked").attr("id")).query,
		    type: "GET",
		    success: respond_moran
		 });
		
	}
	

	
	
	

  
		
		
	
			
	
	
	

	
        


	    

	 
	    
	    
/*----------------- Funciones que procesan las respuestas ajax --------------*/

	    
	      /*
	  			Procesa los marcadores nuevos traidos al realizar una busqueda de la base de datos.
	  			añade al mapa actual los marcadores de la base de datos
        */
		function respond_to_get_db(database,resp){
			var db = current_map.add_db(database,resp,values);
			$("#see_db_dialog table tr#db_title").append(
				"<td><h3>"+db.id.toUpperCase()+"</h3>"+
				"</td>"
				);
			$("#see_db_dialog table tr#db_content").append(
				"<td>"+
				  "<h4>Descripci&oacute;n: Aqui va la descripcio de la BD</h4>"+
				  "<h4>Atributos:</h4><ul id=attributes_"+db.id+"></ul>"+
				"</td>");
				
			var values ="";
			$.each(resp.attributes, function(index) {
			   $("#attributes_"+db.id).append(
					"<li>"+resp.attributes[index].attribute+"</li>"
					);
					values += "values["+resp.attributes[index].attribute+"]=0&";
			 });	
			//añadimos la capas de tipo DB
				$("#layers_dialog #databases .list_db_table").append(
					"<tr>"+
					  "<td>"+
						  "<div class='layer_title' layer='layer_"+db.id+"' >"+db.id.toUpperCase()+"</div>"+
						"</td>"+
						"<td>"+
						  "<div class='layer db_layer'><input type='checkbox'  CHECKED   name='layer' class='layer_checkbox layer_db' id='layer_"+db.id+"' /></div>"+  
						"</td>"+
					"</tr>");
			
			//añadimos la base de datos a la ventana de media espacial
			 	$("#spatial_mean_dialog #databases").append(
			    "<tr>"+
			       "<td>"+
						   "<div class = 'layer_title'>"+db.id.toUpperCase()+"</div>"+
						 "</td>"+
						 "<td>"+
						    "<div class='layer'><input type='radio' name='database' value='"+db.id+"'></div>"+
						 "</td>"+
					"</tr>"
					);	
					   
			//añadimos la base de datos a la ventana de vecino mas cercano
			  $("#nearest_neighbor_dialog #databases table").append(
				   "<tr>"+
					  "<td>"+
						  "<div class='layer_title'>"+db.id.toUpperCase()+"</div>"+
						"</td>"+
						"<td>"+
						  "<div class='layer'><input type='radio' name='database' value='"+db.id+"'></div>"+  
						"</td>"+
					"</tr>");
					
			//añadimos la base de datos a la ventana de filtros
			  $("#filter_db_table").append(
								"<tr>"+
								  "<td>"+
									  "<div class='layer_title'>"+db.id.toUpperCase()+"</div>"+
									"</td>"+
									"<td>"+
									  "<div class='layer'><input type='radio' name='database' value='"+db.id+"'></div>"+  
									"</td>"+
								"</tr>");
				 
			//añadimos la base de datos a la ventana de moran		
			$("#moran_db_table").append(
							"<tr>"+
							  "<td>"+
								  "<div class='layer_title'>"+db.id.toUpperCase()+"</div>"+
								"</td>"+
								"<td>"+
								  "<div class='layer'><input type='radio' name='database' value='"+db.id+"'></div>"+  
								"</td>"+
							"</tr>");
			current_map.get_layer("layer_"+db.id).query = values;
	  }
	
			
		function respond_to_get_db_filter(resp,values){
				current_map.add_markers(resp.markers.features,"db_filter_"+db_layer_count,"Filtro","Filtro",values);
			  $("#layers_dialog #databases .list_db_table").append(
					"<tr>"+
					  "<td>"+
						  "<div class='layer_title' layer='db_filter_"+db_layer_count+"' >Filtro "+db_layer_count+"</div>"+
						"</td>"+
						"<td>"+
						  "<div class='layer db_layer'><input type='checkbox'  CHECKED   name='layer' class='layer_checkbox layer_db' id='db_filter_"+db_layer_count+"' /></div>"+ 
						"</td>"+
					"</tr>");
				db_layer_count++;
				
		}
		
		function respond_nearest_neighbor(resp){
			//añadimos cada linea como una capa al mapa para poder visualizarla posteriormente de manera individual
			/*$.each(resp.markers.features, function(index,feature){
				$("#"+feature.id).attr("prom_vecino",resp.prom_min);
				$("#"+feature.id).attr("vecino",feature.geometry.coordinates[0]);
				var l = current_map.draw_line([feature]);
			});*/
				var layer = current_map.draw_line(resp.markers.features);
			//añadimos la capa a la ventana de capas
			$("#layers_dialog #others table").append(
				"<tr>"+
				  "<td>"+
					  "<div class='layer_title'>"+resp.markers.features[0].properties.description.toUpperCase()+"</div>"+
					"</td>"+
					"<td>"+
					  "<div class='layer layer_nearest_neighbor'>"+
					    "<input type='checkbox'   CHECKED name='layer' class='layer_checkbox layer_nearest_neighbor' id='"+layer.id()+"' />"+
					    "<button id'"+resp.markers.features[0].id+"'> Vecinos cercanos </button>"+
					  "</div>"+ 
					"</td>"+
				"</tr>");
		}



	

	 /*
	  FUNCIONES DE ESTADISTICA ESPACIAL
	  Crea una capa para el mapa especificado, una capa es un mapa mas con un cjto de marcadores,sin  atributos(por ahora), 
	  y genera la siguiente estructura en html
	 */
	function respond_to_spatial_mean(resp){
    var layer;
		$.each(resp.features, function(index,feature) {
				layer = current_map.add_marker([feature],"layer_"+feature.properties.id,feature.properties.description,feature.properties.description,"X");
				$("#layers_dialog #others table").append(
					"<tr>"+
					  "<td>"+
						  "<div class='layer_title'>"+feature.properties.description.toUpperCase()+"</div>"+
						"</td>"+
						"<td>"+
						  "<div class='layer layer_spatial_mean'>"+
							  "<input type='checkbox'  CHECKED   name='layer' class='layer_checkbox layer_spatial_mean' id='layer_"+feature.properties.id+"' /></div>"+ 
							
						"</td>"+
					"</tr>");
		});
		//checar para que keria le atrobuto layer :S:S recordar
		
		/*"<li class='layer layer_spatial_mean' id='layer_"+feature.properties.id+"' layer='"+feature.properties.id+"'>"+
		  feature.properties.description.toUpperCase()+"&nbsp;&nbsp;&nbsp;<input type='checkbox'  CHECKED   name='layer' class='layer_checkbox layer_spatial_mean' id='layer_"+feature.properties.id+"' />"+
		"</li>"*/
	}
	
	function respond_moran(resp){
		console.log(resp);
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






#generamos la matriz
matrix = Array.new(num_s_lon*num_s_lat);
matrix.map!{|x| 
  x = Array.new(num_s_lon*num_s_lat) 
}
#llenamos la matriz con los vecinos
puts num_s_lon
puts num_s_lat
puts matrix.size
matrix.each_index do |index| 
  matrix[index][index]   = 1
  matrix[index][index+1] = 1
  matrix[index][index-1] = 1
  
  matrix[index][index + matrix[0].size] = 1
  matrix[index][index + matrix[0].size+1] = 1
  matrix[index][index + matrix[0].size-1] = 1
  
  matrix[index][index - matrix[0].size] = 1
  matrix[index][index - matrix[0].size+1] = 1
  matrix[index][index - matrix[0].size-1] = 1                  
end
moran
*/






	

	
});



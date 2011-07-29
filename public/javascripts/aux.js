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
	render(shpFile.records, dbfFile.records);
    }
}
	
function onDbfComplete(oHTTP) {
    var binFile = oHTTP.binaryResponse;  
    if (window.console && window.console.log) console.log('got data, parsing dbf file');
    dbfFile = new DbfFile(binFile);
    if (shpFile) {
	render(shpFile.records, dbfFile.records);
    }
}


function getPolygons(records, data) {
    var polygons=[];
    for (var i = 0; i < records.length; i++) {
	var record = records[i];	
	if (record.shapeType == ShpType.SHAPE_POLYGON){
	   for (var j = 0; j < record.shape.rings.length; j++) {
		var ring = record.shape.rings[j];
		for (var k = 0; k < ring.length; k++) {//falta sacar la x y y de los puntos
		    /*if (!box) {
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
		    }*/
		    console.log("coord "+ring[k].x+" "+ring[k].y);
		}
	    } 
	}

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




		
    }
}
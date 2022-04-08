
// myMap= map "a" (Amtrak)
let myMap;

// mapid= map "b" (Megacities)
let mapid;


// Declaring baselayers
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Initialize map
function initialize(){
    loadMap();
};



// Styling for both maps being called in fetch data functions
function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}



// Point styles for Amtrak (map a)
function amtrakStyle(feature, latlng) {
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (typeof feature.properties.ZipCode== 'number') {
		if (feature.geometry.type == "Point") {
			styles.fillColor = '#fff'
			,styles.fillOpacity = 0.5
			,styles.stroke=true
			,styles.radius=9
		}	
	}else {
		if (feature.geometry.type == "Point") {
			styles.fillColor = 'cyan'
			,styles.fillOpacity = 0.5
			,styles.stroke=true
			,styles.radius=9
		}	
	}
	
	return styles;
}



// Point Style for Megacities (map b)
function megacitiesStyle(feature, latlng) {
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}
	
	return styles;
}
	
	

// Map A: Amtrak Stations Data
function fetchData_A(){
    //load the data
    fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson')
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json,
				{style: amtrakStyle, onEachFeature: addPopups_Amtrak, pointToLayer: generateCircles}).addTo(myMap);
        })	
};

// Map B: Megacities Data
function fetchData_B(){
    //load the data
    fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson')
		.then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json,
				{style: megacitiesStyle, onEachFeature: addPopups_megaCities, pointToLayer: generateCircles}).addTo(myMap);
        })
};



// Function to add pup-ups for Amtrak
function addPopups_Amtrak(feature, layer){
	layer.bindPopup(feature.properties.Name);
};

// Function to add pup-ups for megaCities
function addPopups_megaCities(feature, layer){
	layer.bindPopup(feature.properties.city);
};



// Loading both the maps
function loadMap(mapid){
	//Load map B (Mega cities):
	try {
		myMap.remove()
	} catch(e) {
		console.log(e)
		console.log("no map to delete")
	} finally {
		
		//put your map loading code in here
		if (mapid== 'mapb'){ 
			myMap = L.map('mapdiv', {
				center: [45.50, -73.58]
				,zoom: 3
				,maxZoom: 18
				,minZoom: 3
				,layers: [CartoDB_Positron, OpenStreetMap_Mapnik]
			});
	
				//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
			let baseLayers = {
				"CartoDB": CartoDB_Positron,
				"OpenLayer": OpenStreetMap_Mapnik
				//,...
			};

			//declare basemap selector widget
			let lcontrol = L.control.layers(baseLayers);
			//add it to the map
			lcontrol.addTo(myMap);	

			//fetching the data with points
			fetchData_B();
			
		} else if (myMap== 'mapa'){
			// Map for Amtrak stations
			myMap = L.map('mapdiv', {
				center: [45.50, -73.58]
				,zoom: 3
				,maxZoom: 18
				,minZoom: 3
				,layers: [CartoDB_Positron, OpenStreetMap_Mapnik]
			});
	
			//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
			let baseLayers = {
				"CartoDB": CartoDB_Positron,
				"OpenLayer": OpenStreetMap_Mapnik
				//,...
			};

			//declare basemap selector widget
			let lcontrol = L.control.layers(baseLayers);
			//add it to the map
			lcontrol.addTo(myMap);
	
			//fetching the data with points
			fetchData_A();
		}
	}
};



//window.onload = initialize();
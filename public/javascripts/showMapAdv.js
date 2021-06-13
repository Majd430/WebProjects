//const campMap = JSON.parse(campground);
const campMap = campground;
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    zoom: 16, //13.1
    center: campMap.geometry.coordinates,
    pitch: 40,//85
    bearing: 0, //80 //mine 90
    style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y'
});

map.on('load', function () {
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

    // add a sky layer that will show when the map is highly pitched
    map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
        }
    });

    map.addControl(new mapboxgl.NavigationControl());
});

const marker = new mapboxgl.Marker()
    .setLngLat(campMap.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${campMap.title}</h4><p>${campMap.location}</p>`
            )
    )
    .addTo(map);

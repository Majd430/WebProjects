//const campMap = JSON.parse(campground);
const campMap = campground;

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campMap.geometry.coordinates,
    zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campMap.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${campMap.title}</h4><p>${campMap.location}</p>`
            )
    )
    .addTo(map);
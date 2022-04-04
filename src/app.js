let latLng;
const markers = L.markerClusterGroup();

const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const pop =
    `Type to submit:
    <input type="text" id="popupText"> 
    <button onclick="buttonFunction()">submit</button>`;

map.on('click', e => {
    const popup = L.popup()
        .setLatLng(e.latlng)
        .setContent(pop)
        .openOn(map);
    latLng = e.latlng;
})

buttonFunction = () => {
    const text = document.getElementById("popupText").value;
    map.closePopup()

    let marker = L.marker(latLng)
        .bindPopup(text)
        .addTo(map)
        .openPopup()

    markers.addLayer(marker)
}

document.querySelector('#clearAllMarkers').addEventListener('click', () => {
    markers.clearLayers()
})
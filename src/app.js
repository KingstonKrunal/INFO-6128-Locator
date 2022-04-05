loadMarkers()

let latLng
let marker = []

let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const pop =
    `Data:
    <input type="text" id="popupText"> 
    <button onclick="submitButton()">submit</button>`;

const removeMarkerPop = `<button onclick="removeSingleMarker()">Remove</button>`

map.on('click', (e) => {
    let marker = L.popup().setLatLng(e.latlng)
        .setContent(pop)
        .openOn(map);

    marker.addEventListener('click', () => {
        marker.bindPopup(removeMarkerPop).openPopup()
    })

    latLng = e.latlng;
})

// for (let i = 0; i < marker.length; i++) {
//     marker[i].addEventListener('click', () => {
//         marker[i].bindPopup(removeMarkerPop).openPopup()
//     })
// }

submitButton = () => {
    const text = document.getElementById("popupText").value;
    map.closePopup()

    marker.push(L.marker(latLng).bindPopup(text).addTo(map).openPopup())

    marker = JSON.parse(marker.toLocaleString())
    window.localStorage.setItem('markers', JSON.stringify(marker))
}

removeSingleMarker = () => {
    map.removeLayer(marker[_leaflet_id])
}

document.querySelector('#clearAllMarkers').addEventListener('click', () => {
    for (let i = 0; i < marker.length; i++) {
        map.removeLayer(marker[i])
    }
})

document.querySelector('#myLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log('--- Your Position: ---');
            console.log('Lat: ' + position.coords.latitude);
            let latit = position.coords.latitude;
            console.log('Long: ' + position.coords.longitude);
            let longit = position.coords.longitude;
            console.log('---------------------');

            // L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            // map.remove()

            map.setView([latit, longit], 13);
        })
    }
})

function loadMarkers() {
    let markers = window.localStorage.getItem('markers')

    if (!markers) {
        return
    } else {
        markers = JSON.parse(markers)

        markers.forEach((entry) => {
            let latLong = JSON.parse(entry)

            var geojsonFeature = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [latLong.lat, latLong.lng]
                }
            }

            var marker;

            L.geoJson(geojsonFeature, {
                pointToLayer: function (feature) {
                    marker = L.marker(latlng, {
                        title: "Resource Location",
                        alt: "Resource Location",
                        riseOnHover: true,
                        draggable: true,
                        icon: redmarker
                    }).bindPopup("<<span>X: " + latlng.lng + ", Y: " + latlng.lat + "</span><br><a href='#' id='marker-delete-button'>Delete marker</a>");

                    marker.on("popupopen", onPopupOpen);

                    return marker;
                }
            }).addTo(map);
        })
    }
}
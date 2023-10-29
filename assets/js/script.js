let map;
let address;
let addressGeo = {
    lat: 0,
    lng: 0,
};
let geocoder;
let marker;
let fuelCity;
let searchResults = $('#searchResults');

// google map default map
async function initMap() {
    addressGeo = { lat:-34.92863765279679, lng:138.59994054479728 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(document.getElementById("map"), {
        zoom: 15,
        center: addressGeo,
        mapId: "DEMO_MAP_ID",
    });
    marker = new AdvancedMarkerElement({
        map: map,
        position: addressGeo,
        title: "",
    });
}
initMap();

// search button to trigger the function to center the location in the map and get fuel detail and weather detail from different Apis.
$('#searchBtn').on('submit', function(event){
    event.preventDefault();
    address = $("#location").val().trim();
    marker.setMap(null);
    searchResults.empty();

    geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location,12);
          marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
        } else {
        // this alert should be change to a jquery UI
          alert('Geocode was not successful for the following reason: ' + status);
        }
        addressGeo.lat = results[0].geometry.location.lat();
        addressGeo.lng = results[0].geometry.location.lng();
        fuelCity = results[0].address_components[0].long_name;
        showSearchResult();
      });
})

function showSearchResult(){
      //weather function goes in here, use variable 'addressGeo' to get the lat & Lng
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+addressGeo.lat+"&lon="+addressGeo.lng+"&appid=da82657bac27586df572d5d5edb91ad0&units=metric")
    .then(function(response){
        return response.json();
    })
    .then (function (data){
        for (i=1; i<6;i++) {
            $("#city"+i).text(fuelCity);
            y=i*8-4;
            $("#temp"+i).text(data.list[y].main.temp + "°C");
            $("#description" + i).text(data.list[y].weather[0].description);
        }
    })


    // fuel price function:
    const fuelPrice = $('<iframe>');
    fuelPrice.attr("src","https://fuelprice.io/widget/small/?city=" + fuelCity + "&height=300&width=200");
    searchResults.append(fuelPrice);
    }
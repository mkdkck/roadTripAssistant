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
$('#searchBtn').on('submit', function(event){
    event.preventDefault();
    address = $("#location").val().trim();
    marker.setMap(null);
    searchResults.empty();
    // requestGeo(request);
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
        showSearchResult(fuelCity,addressGeo);
      });
})
function showSearchResult(){
  fetch("https://api.openweathermap.org/data/2.5/forecast?lat="+addressGeo.lat+"&lon="+addressGeo.lng+"&appid=da82657bac27586df572d5d5edb91ad0&units=metric")
  .then(function(response){
    return response.json();
  })
  .then (function (response){
    console.log(response);
    const infosection = document.querySelector('.infosection');
    const infodiv1 = document.getElementById('day1');
    const infodiv2 = document.getElementById('day2');
    const infodiv3 = document.getElementById('day3');
    const infodiv4 = document.getElementById('day4');
    const infodiv5 = document.getElementById('day5');
    const cityname1 = document.createElement('p');
    const cityname2 = document.createElement('p');
    const cityname3 = document.createElement('p');
    const cityname4 = document.createElement('p');
    const cityname5 = document.createElement('p');
    cityname1.innerText = fuelCity;
    cityname2.innerText = fuelCity;
    cityname3.innerText = fuelCity;
    cityname4.innerText = fuelCity;
    cityname5.innerText = fuelCity;
    const temp1 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= Number(response.list[4].main.temp)};
    temp1.innerText = Number(response.list[4].main.temp)+ "°C";
    const description1 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= response.list[4].description};
    description1.innerText = response.list[4].weather[0].description;
    const temp2 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= Number(response.list[12].main.temp)};
    temp2.innerText = Number(response.list[12].main.temp)+ "°C";
    const description2 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= response.list[12].description};
    description2.innerText = response.list[12].weather[0].description;
    const temp3 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= Number(response.list[20].main.temp)};
    temp3.innerText = Number(response.list[20].main.temp)+ "°C";
    const description3 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= response.list[20].description};
    description3.innerText = response.list[20].weather[0].description;
    const temp4 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= Number(response.list[28].main.temp)};
    temp4.innerText = Number(response.list[28].main.temp)+ "°C";
    const description4 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= response.list[28].description};
    description4.innerText = response.list[28].weather[0].description;
    const temp5 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= Number(response.list[36].main.temp)};
    temp5.innerText = Number(response.list[36].main.temp)+ "°C";
    const description5 = document.createElement('p');
    for(i=0;i<40;i++){((i+1)).innerText= response.list[36].description};
    description5.innerText = response.list[36].weather[0].description;
    infodiv1.appendChild(cityname1);
    infodiv1.appendChild(temp1);
    infodiv1.appendChild(description1);
    infodiv2.appendChild(cityname2);
    infodiv2.appendChild(temp2);
    infodiv2.appendChild(description2);
    infodiv3.appendChild(cityname3);
    infodiv3.appendChild(temp3);
    infodiv3.appendChild(description3);
    infodiv4.appendChild(cityname4);
    infodiv4.appendChild(temp4);
    infodiv4.appendChild(description4);
    infodiv5.appendChild(cityname5);
    infodiv5.appendChild(temp5);
    infodiv5.appendChild(description5);
    infosection.appendChild(infodiv1);
    infosection.appendChild(infodiv2);
    infosection.appendChild(infodiv3);
    infosection.appendChild(infodiv4);
    infosection.appendChild(infodiv5);
  })
  //weather function goes in here, use variable 'addressGeo' to get the lat & Lng
  // fuel price function:
  const fuelPrice = $('<iframe>');
  fuelPrice.attr("src","https://fuelprice.io/widget/small/?city=" + fuelCity + "&height=300&width=200");
  searchResults.append(fuelPrice);
}
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
let itinerary;
$( "#geocodeAlert" ).hide();

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


// Load currenty Date
window.onload = function() {

  // Get the current date
  const currentDate = new Date();

  // Number of elements to loop through
  const numOutputs = 5;
  
  for(let i = 0; i < numOutputs; i++){

    const nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + i);

    // Format the date as a string in dd/mm/yyyy format
    const day = nextDay.getDate();
    const month = nextDay.getMonth() + 1; // Month is zero-indexed
    const year = nextDay.getFullYear();

    // Extract the day of the week
    const dayOfWeek = nextDay.toLocaleDateString('en-US', { weekday: 'long' });

    // Ensure day and month are displayed with leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Construct the date string in dd/mm/yyyy format
    const dateStr = `${formattedDay}/${formattedMonth}/${year}`;

    // Find the element with the 'currentDate' ID and update its content
    const dateElement = document.getElementById('currentDate_' + i);
    dateElement.textContent = dateStr;
    const dayOfWeekElement = document.getElementById('dayOfWeek_' + i);
    dayOfWeekElement.textContent = dayOfWeek;
  } 
};


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
          
        // JQuery UI show box integrated
        $( "#geocodeAlert" ).show("blind", 500, callback);
          function callback() {
          setTimeout(function() {
            $( "#geocodeAlert:visible" ).removeAttr( "style" ).fadeOut();
          }, 1500 );
        }
        $( "#geocodeAlert" ).hide();
        };
           
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
    // loop to put the weather data into each box
    for (i=1; i<6;i++) {
      // see if the day has saved plan already, if it does, new search won`t over write it.
      const dayCard= $("#day"+i);
      if (dayCard.hasClass("cards")){
      } else {
        $("#city"+i).text(fuelCity);
        y=i*8-4;
        $("#temp"+i).text(data.list[y].main.temp + "°C");
        $("#description" + i).text(data.list[y].weather[0].description);
      }       
    }
  })

  // fuel price function:
  const fuelPrice = $('<iframe style="width:200px">');
  fuelPrice.attr("src","https://fuelprice.io/widget/small/?city=" + fuelCity + "&height=200&width=200");
  searchResults.append(fuelPrice);
  renderPage()
}

// event listener to the cards, when click on anyone of it, the data stored into the local storage
for (i=1; i<6;i++) {
  $('#day'+i).on('click',function(event){
    const cardTargeted = event.currentTarget;
    itinerary = {
      cardID: cardTargeted.id,
      city:cardTargeted.children[2].textContent,
      temp:cardTargeted.children[3].textContent,
      description:cardTargeted.children[4].textContent,
    }

    //prevent to save empty data into local storage.
    if (itinerary.city == "") {
    } else {
      localStorage.setItem(itinerary.cardID,JSON.stringify(itinerary))
    }
    renderPage()
})};

// clear the itinerary to restart the day planners.
$("#clear").on('click', function(){
  localStorage.clear();
  for (i=1; i<6;i++) {
    $("#day"+i).removeClass('background-color:rgb(124, 74, 9) cards')
    $("#city"+i).text("");
    $("#temp"+i).text("");
    $("#description" + i).text("");
  };
})

// renderPage with the data storaged in the local Storage
function renderPage(){
  for (i=1; i<6;i++) {
    itinerary= JSON.parse(localStorage.getItem("day"+i));
    if (itinerary == null) {
    } else {
      $("#day"+i).addClass('background-color:rgb(124, 74, 9) cards')
      $("#city"+i).text(itinerary.city);
      $("#temp"+i).text(itinerary.temp);
      $("#description" + i).text(itinerary.description);
    }
}};
renderPage()





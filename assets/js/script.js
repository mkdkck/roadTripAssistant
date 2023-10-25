function initMap() {
    let mapOptions = {
      center: { lat: -33.860664, lng: 151.208138 },
      zoom: 14
    };
    let mapDiv = document.getElementById('map');
    let map = new google.maps.Map(mapDiv, mapOptions);
    return map;
  }


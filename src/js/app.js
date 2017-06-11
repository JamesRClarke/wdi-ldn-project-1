
$(() => {
  console.log('Js Loaded');
  $('#validate').validate();
  initMap();
});

function initMap() {
  const uluru = {lat: 51.335726, lng: -0.086432};
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  });
  const marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

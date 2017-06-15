/* global google:ignore */

$(() => {
  var movementStrength = 80;
  var height = movementStrength / $(window).height();
  var width = movementStrength / $(window).width();
  $('#top-image').mousemove(function(e){
    var pageX = e.pageX - ($(window).width() / 2);
    var pageY = e.pageY - ($(window).height() / 2);
    var newvalueX = width * pageX * -1 - 25;
    var newvalueY = height * pageY * -1 - 50;
    $('#top-image').css('background-position', newvalueX+'px     '+newvalueY+'px');
  });
  // const map = $('#map');

  $('#validate').validate();

  $('#myselect').change(function() {
    const id = $(this).children(':selected').attr('id');
    const selection = selectedOptions(id);
    googlePlaces(lat, lng, selection);
  });

  const lat = $('#map').data('lat');
  const lng = $('#map').data('lng');
  parseFloat(lat, lng);

  if($('#map').length > 0) initMap(lat,lng);

  if($('#validate').length > 0) document.getElementById('image').addEventListener('change', handleFileSelect, false); googleVision();

});

//End point of document.ready

//Image preview
function handleFileSelect(evt) {
  const files = evt.target.files;
  const listContainer = document.getElementById('list');

  listContainer.innerHTML = '';
  // Loop through the FileList and render image files as thumbnails.
  for (let i = 0, f; f = files[i]; i++) {

    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        const span = document.createElement('span');
        span.innerHTML =
        [
          '<img class="image is-3by4" src="',
          e.target.result,
          '" title="', escape(theFile.name),
          '"/>'
        ].join('');

        listContainer.insertBefore(span, null);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}


let map = null;
let marker = null;

function initMap(lat, lng) {
  const landmark = {lat: lat, lng: lng};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: landmark
  });

  const marker = new google.maps.Marker({
    position: landmark,
    map: map
  });
}


function googleVision () {
  // Grabbing the file upload element from the form
  var $file = document.querySelector('input[type="file"]');

  // When the user chooses an image, or changes the image they've chosen, grab the file, and pass it into the base64 function
  $file.addEventListener('change', () => {
    const file = $file.files[0];
    getBase64(file); // prints the base64 string
  });

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      sendVisionRequest(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  function sendVisionRequest(base64String) {
    const base64 = base64String.match(/base64,(.*)$/)[1];
    const data = {
      requests: [{
        image: { content: base64 },
        features: [{ type: 'LANDMARK_DETECTION' }, { type: 'WEB_DETECTION' }]
      }]
    };

    $.ajax({
      method: 'POST',
      url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCXfxsSIGwf1O04Ldk8xM8Vb3RacgHJ3ZU',
      data: JSON.stringify(data),
      contentType: 'application/json'
    }).done((response) => {
      console.log(response);
      if(response.responses[0].landmarkAnnotations) {
        const title = response.responses[0].landmarkAnnotations[0].description;

        const lat = response.responses[0].landmarkAnnotations[0].locations[0].latLng.latitude;

        const lng = response.responses[0].landmarkAnnotations[0].locations[0].latLng.longitude;

        $('#lat').val(lat);
        $('#lng').val(lng);
        $('#title').val(title);

        $('.inputDisabled').prop('disabled', false);
      } else {
        const webLocation = response.responses[0].webDetection.webEntities[0].description;
        findLocation(webLocation);
        $('.inputDisabled').prop('disabled', false);

      }
    });
  }
}

function findLocation (webLocation){
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${webLocation}&key=AIzaSyCXfxsSIGwf1O04Ldk8xM8Vb3RacgHJ3ZU`,
    method: 'POST'
  })
  .done((data)=> {
    const title = webLocation;
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;

    $('#lat').val(lat);
    $('#lng').val(lng);
    $('#title').val(title);
  });
}

function selectedOptions(id) {

  const options = {
    transport: ['taxi_stand|train_station|transit_station|bus_station|parking|car_rental'],
    foodDrink:
    ['food|restaurant|cafe|bar'],
    health:
    ['pharmacy|doctor|dentist|hospital']
  };

  const selection = options[id][0];
  return selection;

}

function googlePlaces(lat, lng, selection) {

  const location = {
    lat,
    lng,
    selection
  };

  $.ajax({
    url: '/google',
    method: 'POST',
    data: location
  }).
  done((response) => {
    console.log(response);
    const dataResults = response.results;
    console.log(dataResults);

    placeMarkers(dataResults);
  });



  function placeMarkers(dataResults) {

    dataResults.forEach((data) => {
      const lat = data.geometry.location.lat;
      const lng = data.geometry.location.lng;
      console.log(lat);
      console.log(lng);

      //Info Windows
      const contentString = `<div id="content">
      <div id="siteNotice">
      <div id="bodyContent">
      <img src="${data.icon}">
      <p><strong>${data.name}</strong></p>
      <p><strong>${data.rating}</strong></p>
      <p><strong>${data.types[0].toUpperCase()}</strong></p>
      <p><strong>${data.international_phone_number}</strong></p>
      </div>
      </div>
      </div>`;

      const infoWindow = new google.maps.InfoWindow({
        content: contentString
      });


      //Place markers
      const latLng = new google.maps.LatLng(lat, lng);

      marker = new google.maps.Marker({
        position: latLng,
        map: map
      });

      google.maps.event.addListener(marker,'click', (
        function(marker, contentString, infoWindow){

          return function() {
            infoWindow.setContent(contentString);
            infoWindow.open(map,marker);
          };

        })(marker,contentString,infoWindow));

      });
    }
  }

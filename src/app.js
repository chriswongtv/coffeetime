/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var locationOptions = {
  maximumAge: 10000, 
  timeout: 10000
};

var id;

var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 0, 
  timeout: 5000
};

function locationSuccess(pos) {
  console.log('Location changed!');
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('ready',
  function(e) {
    // Get location updates
    id = navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
  }
);

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDM2Tl_TQVRohTGqoezx7v5Z1T_Djodetk&location=37.3169361%2C-122.0439579&radius=1000&keyword=coffee",
  "method": "GET",
  "headers": {
    "cache-control": "no-cache",
    "postman-token": "975f33c0-e625-1022-79ed-3646979faf40"
  }
};

ajax(settings, function (response) {
  var res = JSON.parse(response);
  var locations = [res.results.length];
  
  console.log('location array declared');
  
  for (var i = 0; i < res.results.length; i++) {
    locations[i] = { title: res.results[i].name, subtitle: res.results[i].vicinity };
    //console.log(res.results[i].name);
    //console.log(res.results[i].vicinity);
    console.log(locations[i].title);
  }
  
  console.log('loading ui');
  var main = new UI.Menu({
    sections: [{
      title: 'Nearby coffee shops',
      items: locations
    }]
  });

  console.log('showing ui');
  main.show();

  main.on('select', function(e) {
    var details = new UI.Card();
    details.title(locations[e.itemIndex].title);
    details.subtitle(locations[e.itemIndex].subtitle);
    details.body('test');
    details.show();
  });
});
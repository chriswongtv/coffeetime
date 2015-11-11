var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

navigator.geolocation.getCurrentPosition(function(loc) {
  console.log('location is: ' + loc.coords.latitude + ' ' + loc.coords.longitude);
  getCoffeeShops(loc.coords.latitude, loc.coords.longitude);
}, function(err) {
    console.log(err.code);
}, 
{
  timeout: 15000,
  maximumAge: 10000
});

function getCoffeeShops(latitude, longitude) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDM2Tl_TQVRohTGqoezx7v5Z1T_Djodetk&location=" + latitude + "%2C" + longitude + "&radius=1000&keyword=coffee",
    "method": "GET",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "975f33c0-e625-1022-79ed-3646979faf40"
    }
  };

  ajax(settings, function (response) {
    var res = JSON.parse(response);
    var locations = [res.results.length];

    for (var i = 0; i < res.results.length; i++) {
      locations[i] = { title: res.results[i].name, subtitle: res.results[i].vicinity };
    }
    
    displayUI(locations);
  });
}

function displayUI(locations) {
  var main = new UI.Menu({
    sections: [{
      title: 'Nearby coffee shops',
      items: locations
    }]
  });
  main.show();

  main.on('select', function(e) {
    var details = new UI.Card();
    details.title(locations[e.itemIndex].title);
    details.subtitle(locations[e.itemIndex].subtitle);
    details.body('test');
    details.show();
  });
}
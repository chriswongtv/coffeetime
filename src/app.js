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

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  var locations = [
    {
      title: 'Peets',
      subtitle: '250 feet away'
    }
  ];
  
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

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('ready',
  function(e) {
    // Request current position
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  }
);
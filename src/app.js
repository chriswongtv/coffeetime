/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

navigator.geolocation.getCurrentPosition(function(loc) {
  console.log('location is: ' + loc.coords.latitude + ' ' + loc.coords.longitude);
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDM2Tl_TQVRohTGqoezx7v5Z1T_Djodetk&location=" + loc.coords.latitude + "%2C" + loc.coords.longitude + "&radius=1000&keyword=coffee",
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
}, function(err) {
    console.log(err.code);
}, 
{
  timeout: 15000,
  maximumAge: 10000
});
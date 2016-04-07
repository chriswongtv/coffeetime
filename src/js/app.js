var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var loading = new UI.Card({
  backgroundColor: 'black',
  bodyColor: 'white',
  body: 'Brewing CoffeeTime...'
});

var locationError = new UI.Card({
  backgroundColor: 'black',
  bodyColor: 'white',
  body: 'Please enable location services on your device and relaunch CoffeeTime.'
});

function init() {
  loading.show();
  navigator.geolocation.getCurrentPosition(function(loc) {
    getCoffeeShops(loc.coords.latitude, loc.coords.longitude);
  }, function(err) {
    loading.hide();
    locationError.show();
  }, 
  {
    timeout: 3000,
    maximumAge: 10000
  });
}

function getCoffeeShops(latitude, longitude) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://coffeetime.rocks/api/v1/list?lat=" + latitude + "&lng=" + longitude,
    "method": "GET",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "80bd0349-82c9-2945-fda1-ec88c69b5f43"
    }
  }

  ajax(settings, function (response) {
    var res = JSON.parse(response);
    var locations = [res.results.length];

    for (var i = 0; i < res.results.length; i++) {
      locations[i] = { title: res.results[i].name, subtitle: getDistance(latitude, res.results[i].geometry.location.lat, longitude, res.results[i].geometry.location.lng), address: res.results[i].vicinity, rating: res.results[i].rating };
    }

    displayUI(locations);
  });
}

function displayUI(locations) {
  var main = new UI.Menu({
    backgroundColor: 'black',
    textColor: 'white',
    highlightBackgroundColor: 'blue',
    highlightTextColor: 'white',
    sections: [{
      title: 'Nearby Coffee Shops',
      items: locations
    }]
  });
  loading.hide();
  main.show();

  main.on('select', function(e) {
    var details = new UI.Card({
      title: locations[e.itemIndex].title,
      body: locations[e.itemIndex].address,
      scrollable: true,
      backgroundColor: 'black',
      titleColor: 'white',
      subtitleColor: 'white',
      bodyColor: 'white',
      icon: 'images/coffee.png'
    });

    details.show();
  });
}

function getDistance(lat1, lat2, lon1, lon2) {
  var radlat1 = Math.PI * lat1/180;
  var radlat2 = Math.PI * lat2/180;
  var theta = lon1-lon2;
  var radtheta = Math.PI * theta/180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180/Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist.toFixed(1);
  
  if (dist >= (1000/5280))
    return dist + ' miles away';
  else
    return (dist * 5280) + ' feet away';
}

init();
var TABLET_WIDTH = 768;
var DESKTOP_WIDTH = 1300;
var SMALL_PIN = {width: 62, height: 62};
var BIG_PIN = {width: 124, height: 106};

function debounce(f, ms) {
  var timer = null;

  return function (cb) {
    var onComplete = function() {
      f.apply(this, cb);
      timer = null;
    };
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(onComplete, ms);
  };
}

function initialize() {
  var viewport = document.documentElement.clientWidth || window.innerWidth;
  var mapCenter = viewport < DESKTOP_WIDTH ? {lat: 59.938882, lng: 30.32323} : {lat: 59.939065, lng: 30.319335};
  var pinCenter = viewport < TABLET_WIDTH ? {lat: 59.93871,lng: 30.32323} : {lat: 59.93871,lng: 30.32299};
  var pinSize = viewport < TABLET_WIDTH ? SMALL_PIN : BIG_PIN;

  var mapOptions = {
    zoom: 17,
    center: mapCenter
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var image = {
    url: "../img/map-pin.png",
    scaledSize: pinSize
  };

  var pin = new google.maps.Marker({
    position: pinCenter,
    map: map,
    icon: image
  });
}

google.maps.event.addDomListener(window, "load", initialize);
google.maps.event.addDomListener(window, "resize", debounce(initialize, 250));

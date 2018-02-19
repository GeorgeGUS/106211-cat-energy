(function (){
  var TABLET_WIDTH = 768;
  var DESKTOP_WIDTH = 1300;
  var SMALL_PIN = {width: 62, height: 53};
  var BIG_PIN = {width: 124, height: 106};

  function debounce(f, ms) {
    var timer = null;

    return function (cb) {
      var onComplete = function () {
        f.apply(this, cb);
        timer = null;
      };
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(onComplete, ms);
    };
  }

  window.initialize = function() {
    var viewport = document.documentElement.clientWidth || window.innerWidth;
    var mapCenter = viewport < DESKTOP_WIDTH ? {lat: 59.938882, lng: 30.32323} : {lat: 59.939065, lng: 30.319335};
    var pinCenter = viewport < TABLET_WIDTH ? {lat: 59.93871, lng: 30.32323} : {lat: 59.93871, lng: 30.32299};
    var pinSize = viewport < TABLET_WIDTH ? SMALL_PIN : BIG_PIN;


    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: mapCenter
    });

    var image = {
      url: "img/raster/map-pin.png",
      scaledSize: pinSize
    };

    var beachMarker = new google.maps.Marker({
      position: pinCenter,
      map: map,
      optimized: true,
      icon: image
    });
  };

  window.addEventListener("resize", debounce(initialize, 1000));
})();

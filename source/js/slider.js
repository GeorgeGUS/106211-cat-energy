(function () {
  var slider = document.querySelector(".slider");
  var scale = slider.querySelector(".slider__scale");
  var grip = scale.querySelector(".slider__grip");
  var before = slider.querySelector(".slider__image--before");
  var after = slider.querySelector(".slider__image--after");
  var btnBefore = slider.querySelector(".slider__btn--before");
  var btnAfter = slider.querySelector(".slider__btn--after");

  var getElemWidth = function (elem) {
    return parseInt(getComputedStyle(elem).width, 10);
  };

  var sliderWidth = getElemWidth(slider);
  var gripWidth = getElemWidth(grip);

  window.addEventListener("resize", function () {
    sliderWidth = getElemWidth(slider);
    gripWidth = getElemWidth(grip);
  });

  btnBefore.onclick = function (evt) {
    evt.preventDefault();
    before.style.width = "100%";
    after.style.width = "0";
    grip.style.marginLeft = "0";
  };

  btnAfter.onclick = function (evt) {
    evt.preventDefault();
    before.style.width = "0";
    after.style.width = "100%";
    grip.style.marginLeft = "calc(100% - " + gripWidth + "px)";
  };

  grip.ondblclick = function () {
    before.style.width = "50%";
    after.style.width = "50%";
    grip.style.marginLeft = "calc(50% - " + gripWidth / 2 + "px)";
  };

  var getCoords = function (elem) {
    var box = elem.getBoundingClientRect();
    return box.left + pageXOffset;
  };

  grip.onmousedown = function (evtDown) {
    // var afterWidth = getElemWidth(after);
    // var gripCoords = getCoords(grip);
    // var scaleCoords = getCoords(scale);
    var gripCoords = getComputedStyle(elem).marginLeft;
    grip.style.transition = "none";

    var shiftX = evtDown.pageX - gripCoords;

    document.onmousemove = function (evtMove) {
      var newLeft = evtMove.pageX - shiftX - scaleCoords;

      if (newLeft < 0) {
        newLeft = 0;
      }
      var rightEdge = scale.innerWidth - grip.offsetWidth;
      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
      var gripPos = newLeft / rightEdge * 100;

      grip.style.left = newLeft + "px";

      after.style.clip = "rect(auto, auto, auto, " + (sliderWidth - sliderWidth * gripPos / 100) + "px)";
    };

    document.onmouseup = function () {
      document.onmousemove = document.onmouseup = null;
      grip.style.transition = "all 0.3s ease-out";
    };

    return false;
  };
})();

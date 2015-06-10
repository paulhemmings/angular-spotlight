angular
    .module('AngularSimpleboxModule')
    .service('simpleBoxService', [ '$window', '$document', function($window, $document) {

        var currentImageElement = null;
        var options = {
          fadeInDistance: 50,
          animationSpeed: 50,
          quitOnImageClick: true,
          imageSize : 1,
          animationSpeed : 20
        };

        function getcss3prop (cssProperty) {
            var vendors = ["", "-moz-", "-webkit-", "-o-", "-ms-", "-khtml-"],
                camelCase = function (str) {
                    return str.replace(/\-([a-z])/gi, function (match, p1) {
                        return p1.toUpperCase();
                    });
                };

            for (var i = 0; i < vendors.length; i++) {
                var css3propcamel = camelCase(vendors[i] + cssProperty)

                if (css3propcamel.substr(0,2) == "Ms") {
                    css3propcamel = "m" + css3propcamel.substr(1);
                }

                if (css3propcamel in document.documentElement.style) {
                    return css3propcamel;
                }
            }

            return "undefined";
        }

        function openImage(imageSource, imageElementId) {

          var bodyElem = document.getElementsByTagName("body")[0],
              documentFragment = document.createDocumentFragment(),
              imageElement = document.createElement("img"),
              imageElementControl = document.getElementById(imageElementId);

          // remove existing image element if already on page

          if (imageElementControl) {
              bodyElem.removeChild(imageElementControl);
              return;
          }

          // Set attributes of new image element.

          imageElement.setAttribute("id", imageElementId);
          imageElement.setAttribute("src", imageSource);
          imageElement.setAttribute("style", "position: fixed; cursor: pointer; opacity: 0;") ;

          // Append to fragment and append fragment to body.

          documentFragment.appendChild(imageElement);
          bodyElem.appendChild(documentFragment);

          // Set current image element.

          currentImageElement = document.getElementById(imageElementId);
          currentImageElement.style.filter = 'alpha(opacity=0)'; // IE 8 opacity

          // Calculate image position and size and set them.

          calculateImagePositionAndSize(currentImageElement, false);

          // Add event listener.

          if (options.quitOnImageClick) {
              currentImageElement.addEventListener("click", function (event) {
                  if (event.preventDefault) {
                      event.preventDefault();
                  }

                  if (window.event) {
                      window.event.returnValue = false;
                  }

                  removeImageElement();
              });
          }
      }

      function calculateImagePositionAndSize (imageElement, imageResize) {
          var temporaryImageObject = new Image(),
              imageWidth = 0,
              imageHeight = 0,
              imageSizeRatio = 0;

          // If no element provided, quit.
          if (!imageElement) {
              return;
          }

          var imageSource = imageElement.getAttribute("src"); // Get element's source attribute for loading image.
          var screenHeight = window.innerHeight || document.documentElement.offsetHeight; // Get window height.
          var screenWidth = window.innerWidth || document.documentElement.offsetWidth; // Get window width.

          temporaryImageObject.onload = function () {

              var imageProperties = {
                  width: this.width,
                  height: this.height
              };

              var imageWidth = imageProperties.width;
              var imageHeight = imageProperties.height;
              var imageSizeRatio = imageWidth / imageHeight;

              // Height of image is too big to fit in viewport
              if (Math.floor(screenWidth / imageSizeRatio) > screenHeight) {
                  imageWidth = screenHeight * imageSizeRatio * options.imageSize;
                  imageHeight = screenHeight * options.imageSize;
              } else { // Width of image is too big to fit in viewport
                  imageWidth = screenWidth * options.imageSize;
                  imageHeight = screenWidth / imageSizeRatio * options.imageSize;
              }

              if (imageWidth > imageProperties.width) {
                  imageWidth = imageProperties.width;
              }

              if (imageHeight > imageProperties.height) {
                  imageHeight = imageProperties.height;
              }

              // Set style attributes.
              imageElement.style.top = ((screenHeight - imageHeight) / 2) + "px";
              imageElement.style.left = ((screenWidth - imageWidth) / 2) + "px";
              imageElement.style.width = Math.floor(imageWidth) + "px";
              imageElement.style.height = Math.floor(imageHeight) + "px";

              if (!imageResize) {
                  setTimeout(function () {

                      var toOpacity = 1;
                      animate({
                          delay: 16,
                          duration: options.animationSpeed,
                          delta: linear,
                          step: function (delta) {
                              imageElement.style.opacity = (toOpacity * delta);
                              imageElement.style.filter = "alpha(opacity=" + ((toOpacity * delta) * 100 ) + ")";
                          }
                      });

                  }, 100);
              }
          };

          // Must be last because otherwise onload function won't be load.
          temporaryImageObject.src = imageSource;
      }

      function removeImageElement() {

          if (!currentImageElement) {
              return;
          }

          var toOpacity = 0;
          animate({
              delay: 16,
              duration: 250,
              delta: linear,
              step: function (delta) {
                  currentImageElement.style.opacity = (toOpacity * delta);
                  currentImageElement.style.filter = "alpha(opacity=" + ((toOpacity * delta) * 100 ) + ")"; // IE 8
              }
          });

          setTimeout(function () {
              if (currentImageElement) {
                  currentImageElement.parentNode.removeChild(currentImageElement);
              }

          }, 350); // Duo animate delay, add 100ms.
      }

      function animate(animationOptions) {
          var start = new Date();
          var id = setInterval(function () {
              var timePassed = new Date() - start,
                  progress = timePassed / animationOptions.duration;

              if (progress > 1) {
                  progress = 1;
              }

              var delta = animationOptions.delta(progress);
              animationOptions.step(delta);

              if (progress == 1) {
                  clearInterval(id);
              }
          }, animationOptions.delay || 10);
      }

      function linear(progress) {
          return progress;
      }

      return {
        openImage: openImage
      };

}]);

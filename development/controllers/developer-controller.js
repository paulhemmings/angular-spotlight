angular
    .module('DeveloperModule')
    .controller('DeveloperController', ['$scope', 'simpleBoxService', function($scope, simpleBoxService) {

      $scope.showFullsize = showFullsize;
      $scope.images = [
        {
          id: 1,
          fullsize: "./images/fullsize.png",
          thumbnail: "./images/thumbnail1.jpeg"
        },
        {
          id: 1,
          fullsize: "./images/fullsize.png",
          thumbnail: "./images/thumbnail2.gif"
        }
      ];

      function showFullsize(image) {
          simpleBox.openImage(image.fullsize, image.id);
      }

      function initialize() {
      }

      initialize();

    }]);

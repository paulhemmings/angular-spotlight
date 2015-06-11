'use strict';

/**
 * @ngdoc directive
 * @name velge-angularjs:velge
 * @description
 * # velge
 */
angular.module('AngularSimpleboxModule')
  .directive('simpleBox', ['$parse', 'simpleBoxService', function ($parse, simpleBoxService) {
    return {
      restrict: 'A',

      controller: function($scope, $element, $attrs) {

        // $element[0].setAttribute("data-fullsize", $attrs.fullSize);
        // $element[0].setAttribute("data-thumbnail", $attrs.identity);

        $element[0].addEventListener('click', function() {
          simpleBoxService.openImage($attrs.simpleBox, $attrs.ngSrc);
        });


      }


    };
  }]);

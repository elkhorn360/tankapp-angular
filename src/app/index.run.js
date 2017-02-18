(function() {
  'use strict';

  angular
    .module('tankappWebapp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();

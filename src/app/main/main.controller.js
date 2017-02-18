(function() {
  'use strict';

  angular
    .module('tankappWebapp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout) {
    var connection = null;
    $scope.ip = '192.168.0.100';
    var options = {
        zone: document.getElementById('zone_joystick'),                  // active zone
        mode: 'static',
        position: {left: '50%', top: '50%'},
        color: 'red'           // transition time joystick in
    };
    var manager = nipplejs.create(options);
    var starPosition = null;
    manager.on('start end', function(evt, data) {
      //console.log(evt.type);
      starPosition = data.position
      var x = data.position.x - starPosition.x;
      var y = starPosition.y - data.position.y;
      sendCommand(x, y)
      console.log(data.position);
    }).on('move', function(evt, data) {
      var x = data.position.x - starPosition.x;
      var y = starPosition.y - data.position.y;
      //console.log(x + "   " + y);
      sendCommand(x, y)
    })

    function sendCommand(x, y) {
      var forward = 512 + Math.round( ((y /100.0) * 1024.0) );
      var diff = Math.round( ((x /100.0) * 1024.0) );
      console.log(Math.max(0, Math.min(1024,(forward-diff))) +"-"+ Math.max(0,Math.min(1024,(forward+diff))));
      connection.send(Math.max(0, Math.min(1024,(forward-diff))) +"-"+ Math.max(0,Math.min(1024,(forward+diff))));
    }

    $scope.toggleConnect = function() {
      if ($scope.connected) {
        connection.close();
        $scope.connected = false;
      } else {
        connectTank();
      }
    }


    function connectTank() {
      connection = new WebSocket('ws://' + $scope.ip + ':81/', ['arduino']);
      connection.onopen = function() {
        $scope.connected = true;
        connection.send('Connect ' + new Date());
      };
      connection.onerror = function(error) {
        $scope.connected = false;
        console.log('WebSocket Error ', error);
      };
      connection.onmessage = function(e) {
        console.log('Server: ', e.data);
      };
      connection.onclose = function(e) {
        $scope.connected = false;
        console.log('Server: ', e.data);
      };
    }

  }
})();

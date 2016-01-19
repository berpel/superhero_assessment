angular.module('superApp', ['ngAnimate', 'ngDraggable', 'ngDialog'])
  .directive('heroBackground', ['$rootScope', '$timeout', function($rootScope, $timeout){
    return {
      restrict: 'A',
      scope: {
        heroName: '=heroName'
      },
      link: function(scope, element, attr) {
        var heroesColors = {
          'batman': ['#050100', '#526687', '#8D98AA', '#A39586'],
          'wonder_woman': ['#AD282C', '#BD8842', '#CE8F80', '#003553'],
          'super_man': ['#8B2521', '#025589', '#B89412'],
          'flash': ['#E3B73D', '#D44C4E'],
          'iron_man': ['#FFC370', '#FFAE3D', '#F79914', '#BD1000', '#A60E00'],
          'spider_man': ['#145994', '#BD3711', '#8D2816'],
          'captain_marvel': ['#BD442F', '#C49A70', '#CEBAB1'],
          'daredevil': ['#D80F33', '#A90433', '#710422'],
          'black_canary': ['#000000', '#454545', '#E0DC87', '#2D1D3B'],
          'hawkgirl': ['#F5E760', '#070B0C', '#8E3F44', '#242623', '#A49C87'],
          'captain_america': ['#FFFFFF', '#CC1414', '#256697']
        }
        if (!heroesColors.hasOwnProperty(scope.heroName.toLowerCase().replace(' ', '_'))) return;
        var heroColors = heroesColors[scope.heroName.toLowerCase().replace(' ', '_')]
        var percentage = 100 / heroColors.length;
        var background = 'linear-gradient(60deg'
        for (var i = 0; i < heroColors.length; i++) {
          if (i > 0) background += ','+' '+(percentage*i+.1)+'%';
          background += ','+heroColors[i]+' '+(percentage*i)+'%';
        }
        background += ')';
        element.css('background', background);
      }
    }
  }])
  .factory('heroService', ['$http', '$q', function($http, $q) {
    var key = null;
    return {
      key: function() {
        var promise = $http.get('https://hero-merge.herokuapp.com/getApiKey')
          .then(function(response) {
            key = response.data.apiKey;
            return true;  
          })
        return promise;
      },
      get: function(id) {
        var promise = $http.get('https://hero-merge.herokuapp.com/'+key+'/heroes')
          .then(function(response) {
            return response.data;
          })
        return promise;
      },
      patch: function(id) {

      },
      post: function(newHero) {
        var promise = $http.post('https://hero-merge.herokuapp.com/'+key+'/heroes', newHero)
          .then(function(response) {
            return response;
          })
        return promise;
      }
    }
  }])
  .controller('main', ['heroService', '$scope', function(heroService, $scope) {
    $scope.attributes = ['combat', 'durability', 'intelligence', 'power', 'speed', 'strength'];
    $scope.loading = true;
    $scope.heroes = [];
    
    function init() {
      $scope.newHero = {
        powers: [],
        weaknesses: []
      }
      $scope.merge = {
        powers: []
      }
      $scope.creating = false;
      $scope.isMerge = false;
      $scope.temp = {
        power: '',
        weakness: ''
      }
    }
    init();

    // get key first
    heroService.key()
      .then(function() {
    
        // get hero list
        heroService.get()
          .then(function(data) {

            $scope.heroes = data;
            $scope.loading = false;
          })

      })

    // create hero
    $scope.create = function(newHero) {
      if ($scope.isMerge) {
        newHero.powers = $scope.merge.powers;
      }

      $scope.attributes.forEach(function(attribute) {
        newHero.attributes[attribute] = parseInt(newHero.attributes[attribute]); // cast attributes as ints
      });
      heroService.post(newHero)
        .then(function(response){
        })
      $scope.heroes.unshift(newHero);
      init();
    }

    $scope.addItem = function(e, key) {
      var pluralKey = (key == 'power') ? 'powers' : 'weaknesses';
      if (this.temp[key].length <= 0) return; // nothing added
      if ((e.type == 'keypress') && (e.keyCode != 13)) return; // keypressed but not enter
      e.preventDefault();

      $scope.newHero[pluralKey].push(this.temp[key]);
      this.temp[key] = '';
    }

    $scope.checkItem = function() {
      if (this.power.length <= 0) $scope.newHero.powers.splice(this.$index, 1);
    }

    $scope.selectPower = function() {
      var index = $scope.merge.powers.indexOf(this.power)
      if (index >= 0) $scope.merge.powers.splice(index, 1);
      else {
        if ($scope.merge.powers.length >= 5) return; // don't allow more than 5
        $scope.merge.powers.push(this.power);
      }
    }

    $scope.selected = function() {
      return ($scope.merge.powers.indexOf(this.power) >= 0);
    }

    $scope.startMerge = function() {
      return ($scope.merge.hasOwnProperty('hero1') && $scope.merge.hasOwnProperty('hero2'));
    }

    $scope.onDropComplete = function(hero, e, key) {
      var concatArraysUniqueWithSort = function (thisArray, otherArray) {
        var newArray = thisArray.concat(otherArray).sort(function (a, b) {
          return a > b ? 1 : a < b ? -1 : 0;
        });

        return newArray.filter(function (item, index) {
          return newArray.indexOf(item) === index;
        });
      };
      $scope.merge[key] = hero;
      if ($scope.startMerge()) {
        $scope.isMerge = true;
        $scope.newHero.powers = concatArraysUniqueWithSort($scope.merge.hero1.powers, $scope.merge.hero2.powers);
        $scope.newHero.weaknesses = concatArraysUniqueWithSort($scope.merge.hero1.weaknesses, $scope.merge.hero2.weaknesses);

        $scope.creating = true;

      }
    }

    $scope.cancelHero = function() {
      init();
    }

  }])

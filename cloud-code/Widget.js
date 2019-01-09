$( document ).ready(function() {
    //définition des variables pour l'API
    var TOKEN = 'BBFF-Z5AN16ZYdPc9HtHi99reO9gByurLMh';
    var VARIABLE = '5c35cdf973efc3303a8f56b3';
    var map, donnees;
    var icons = {
      parking: 'https://img.icons8.com/color/32/000000/parking.png',
      fall: 'https://img.icons8.com/color/100/000000/stop-sign.png/32',
      tracking: 'https://img.icons8.com/color/32/000000/search.png'
    };

    //==========================MAIN============================
    
    //récupération du script google map
    $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyBauLg15skwuMQTT1q9aNw7g9oAL4Qvw68&callback=initMap");
    //récupération des données du cloud
    recuperationDonnees(VARIABLE,TOKEN,initMap);

    //==========================FONCTIONS============================

    //fonction qui créer la carte google map
    function initMap(donnees) {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.7838533, lng: 4.8668179},
        zoom: 5
      });

        var paths = [];

        //parcours des données
        donnees.forEach(function(element) {
          var valeur = element.value;
          var latitude = element.context.lat;
          var longitude = element.context.lng;
          var type = element.context.type;
          var date = new Date();
          date.setTime(element.timestamp);
        
          //création du marker
          var marker = new google.maps.Marker({
            position: {lat: parseFloat(latitude), lng: parseFloat(longitude)},
            icon: icons[type],
            map: map
          });

          //création de l'info bulle
          var infowindow = new google.maps.InfoWindow({
            content: '<label>Type: </label>' + type + '</br>' +
            '<label>Valeur: </label>' + valeur + '</br>' +
            '<label>Date: </label>' + date.toLocaleString() + '</br>' +
            '<label>Position: </label> {lat: ' + latitude + ', lng: ' + longitude + '}'
          });

          //ajout de l'info bulle au marker
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });

          //création du tableau de points
          paths.push({lat:parseFloat(latitude), lng:parseFloat(longitude)});
        });

        //création des liens entre markers
         var lines = new google.maps.Polyline({
            path: paths,
            geodesic: true,
            strokeColor: '#249C4A',
            strokeOpacity: 1.0,
            strokeWeight: 3
          });

        lines.setMap(map);
    }

    //fonction qui permet de récupérer les données depuis le cloud
    function recuperationDonnees(variable, token, callback) {
        var url = 'https://industrial.api.ubidots.com/api/v1.6/variables/' + variable + '/values';
        var headers = {
          'X-Auth-Token': token,
          'Content-Type': 'application/json'
        };
        
        $.ajax({
          url: url,
          method: 'GET',
          headers: headers,
          success: function (res) {
            callback(res.results);
          }
        });
    }
});









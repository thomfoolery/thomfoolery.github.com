define(['jquery','velocity-ui','reveal','parallax','scroll-to'],
  function ( $ ) {
    $(document).trigger('scroll');
    $(document).on('click','h1 .full-name', function (e) {
      var $target = $( e.currentTarget )
      if ( $target.data('split') == undefined ) {
        var name = $target.html().trim().replace(/&nbsp;/gi,' ')
          , html = ''
          ;
        $.each( name.split(''), function ( k, v ) {
          if ( v == ' ' ) return html += '&nbsp;';
          html += "<span>" + v + "</span>";
        });
        $target.data('split', true );
        $target.html( html );
      }
      $target.find('span').velocity('transition.flipXIn',{stagger:200});
    });
    // gMaps
    function initialize() {
      var geocoder = new google.maps.Geocoder();
      var mapOptions = {
        "disableDefaultUI": true,
        "scrollwheel": false,
        "styles": [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill"},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#7dcdcd"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]}],
        "zoom": 12
      };
      geocoder.geocode({ 'address': 'Philadelphia, USA'}, function( results, status ) {
        if (status == google.maps.GeocoderStatus.OK) {
          mapOptions.center = results[0].geometry.location;
          var map = new google.maps.Map(document.getElementById('map-canvas-philadelphia'), mapOptions);
          var marker = new google.maps.Marker({
              "map": map,
              "position": results[0].geometry.location
          });
        }
      });
      geocoder.geocode({ 'address': 'Toronto, Canada'}, function( results, status ) {
        if (status == google.maps.GeocoderStatus.OK) {
          mapOptions.center = results[0].geometry.location;
          var map = new google.maps.Map(document.getElementById('map-canvas-toronto'), mapOptions);
          var marker = new google.maps.Marker({
              "map": map,
              "position": results[0].geometry.location
          });
        }
      });
    };
    window.initializeGoogleMap = initialize;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGoogleMap';
    document.body.appendChild(script);
    return 'App started';
  }
);
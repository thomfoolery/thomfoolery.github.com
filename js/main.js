var TBY = TBY || {};

(function() {

  var $body = document.querySelector('body')
    , $script = null
    ;

  TBY.$canvas = document.createElement('canvas');
  TBY.context = TBY.$canvas.getContext('2d');

  TBY.$canvas.style.position = 'absolute';
  TBY.$canvas.style.left = 0;
  TBY.$canvas.style.top = 0;

  resize();
  function resize () {
    TBY.$canvas.width = window.innerWidth;
    TBY.$canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize );

  document.querySelector('body').appendChild( TBY.$canvas );

  readHash();
  function readHash () {

    var hash = window.location.hash;

    if ( ! hash ) return;

    if ( $script )
      $script.remove();

    if ( typeof TBY.unload === 'function' )
      TBY.unload();

    $script = document.createElement('script');
    $script.src = '/js/experiment/' + hash.split('#').pop() + '.js';
    document.querySelector('head').appendChild( $script );
  }
  window.addEventListener('hashchange', readHash );

  TBY.decorate = function decorate ( base, decorator, options ) {
    return decorator( base, options );
  }
})();
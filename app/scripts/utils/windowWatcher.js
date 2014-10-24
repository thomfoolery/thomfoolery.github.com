define(['jquery'], function windowWatcher ( $ ) {

  var $document = $(document)
    , $window   = $(window)

    , $LG       = $('.visible-lg')
    , $MD       = $('.visible-md')
    , $SM       = $('.visible-sm')

    , breakpointChangeCallbacks = []

    , exports = {
      "width":      $window.width(),
      "height":     $window.height(),
      "scrollTop":  0,
      "scrollDir":  'down',
      "breakpoint": getScreenSize(),
      "onBreakpointChange": function( callback ) {
        breakpointChangeCallbacks.push( callback );
      }
    };

  $document.on('scroll', function () {
    var newScroll = $( document ).scrollTop();
    exports.scrollDir = ( exports.scrollTop <= newScroll ) ? 'down' : 'up' ;
    exports.scrollTop = newScroll;
  });

  $window.on('resize', function () {
    exports.width      = $window.width();
    exports.height     = $window.height();
    var breakpoint = getScreenSize();
    if ( breakpoint != exports.breakpoint ) {
      exports.breakpoint = breakpoint;
      $.each( breakpointChangeCallbacks, function ( index, callback ) {
        callback.call( $window, breakpoint );
      });
    }
  });

  // get screen size
  function getScreenSize () {
    if ( $LG.is(':visible') ) return 'lg';
    if ( $MD.is(':visible') ) return 'md';
    if ( $SM.is(':visible') ) return 'sm';
    return 'xs';
  }

  return exports;

});
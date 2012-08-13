/*
 * Author: Thomas Yuill 2012
 * 
 * DISCLAIMER
 * ----------
 * This is my hackspace. Code is not as elegant as could be.
 * I constantly change and update this space to try out new things.
 * Things might break, things could be optimized. I'm working on it.
 *
 * More things to come...
 */

var TBY = TBY || {};
if ( ! TBY.experiment ) TBY.experiment = {};

Modernizr.load({ both: ['js/utils/animation.js'] });

var $canvas, ctx,
    CANVAS_WIDTH,  canvasWidth,
    CANVAS_HEIGHT, canvasHeight,

    MOUSE_X, mouseX,
    MOUSE_Y, mouseY

    KEY_PRESSED = false,
    KEY_UP      = false,
    KEY_LEFT    = false,
    KEY_RIGHT   = false,
    KEY_DOWN    = false
    ;

// create canvas
$canvas = $('<canvas>').css({
    'position': 'absolute',
    'left': 0,
    'top': 0,
});

CANVAS_WIDTH = canvasWidth = $canvas[0].width = $('header').outerWidth();
CANVAS_HEIGHT = canvasHeight = $canvas[0].height = $('header').outerHeight();

// store context
ctx = $canvas[0].getContext('2d');

// position canvas in header
$('header').prepend( $canvas )
  .css('position', 'relative')
  .css('cursor', 'crosshair')
  .find('hgroup')
  .css('position', 'relative');


// EXPERIMENT SELECTOR
//====================

var experiments = ['5','6','7', '8'];

    $experiments = $('<div class="experiment-selector">'),
    $content     = $('<div class="content"/>'),
    $toggle      = $('<a href="#" class="btn-toggle-experiment-selector">+</a>'),
    $tooltip     = $('<span class="tool-tip">Click here to change the header doodle.</span>')
    ;

for ( var i = 0, len = experiments.length; i < len; i++ ){
  $content.append('<a href="/?exp=' + experiments[ i ] + '" class="exp-' + experiments[ i ] + '">' + ( i +1 ) + '</a>' );
}

$toggle.css({
    position: 'absolute',
    right: 0,
    top: '-.25em',
    fontSize: '3em'
  })
  .click( function ( e ) {

    if ( $toggle.hasClass('open') ){

      $toggle.removeClass('open');
      $experiments.slideUp();
    }else{

      $toggle.addClass('open');
      $experiments.slideDown();
    }
  })
  .append( $tooltip )
  .mouseenter( function( e ){ $tooltip.stop().fadeIn(); })
  .mouseleave( function( e ){ $tooltip.stop().fadeOut(); });
  
$tooltip
  .hide()
  .delay( 500 )
  .fadeIn()
  .delay( 3000 )
  .fadeOut();

$experiments.append( $content ).insertAfter( $('header') ).slideUp(0);
$('#wrap').prepend( $toggle );

// EVENTS
//========

// on resize
$( window ).resize(function( e ){
    CANVAS_WIDTH = canvasWidth = $canvas[0].width = $('header').outerWidth();
});

// on mouse move
$( window ).mousemove(function( e ){
    MOUSE_X = mouseX = e.clientX;
    MOUSE_Y = mouseY = e.clientY;
});

// on key down
$( window ).keydown( function( e ){

  KEY_PRESSED = true;
  if ( e.keyCode == 38 ){
      KEY_UP = true;
  }
  else if ( e.keyCode == 37 ){
      KEY_LEFT = true;
      KEY_RIGHT = false;
  }
  else if ( e.keyCode == 39 ){
      KEY_RIGHT = true;
      KEY_LEFT = false;
  }
  else if ( e.keyCode == 40 ){
      e.preventDefault();
      KEY_DOWN = true;
  }
});
// on key up
$( window ).keyup( function( e ){

  KEY_PRESSED = false;
  if ( e.keyCode == 38 ){
      KEY_UP = false;
  }
  else if ( e.keyCode == 37 ){
      KEY_LEFT = false;
  }
  else if ( e.keyCode == 39 ){
      KEY_RIGHT = false;
  }
  else if ( e.keyCode == 40 ){
      KEY_DOWN = false;
  }
});

// calculations
function degToRad ( degrees ) {
    return (( degrees *Math.PI ) / 180 );
}
function radToDeg ( radians ) {
    return (( radians *180 ) / Math.PI );
}
function angle( x1, y1, x2, y2 ){
    return Math.atan(( y2 - y1 ) / ( x2 - x1 ));
}
function distance( x1, y1, x2, y2 ){
    return Math.sqrt(( Math.pow( ( x2 - x1 ), 2 ) + Math.pow( ( y2 - y1 ), 2 ) ));
}
function BBhitTest( a, b ){
    a = a.getBoundingBox();
    b = b.getBoundingBox();
    return ( a.x + a.width > b.x )  &&
           ( a.x < b.x + b.width  ) &&
           ( a.y + a.height > b.y ) &&
           ( a.y < b.y + b.height )
}


// EXPERIMENT LOADER
//==================

var currentExperimentNumber;

start_experiment( parseInt( getParamByName('exp') ) )

function getParamByName( name ) {

  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

  var regexS = "[\\?&]" + name + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(window.location.search);

  if ( results == null )
    return null;
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

// load experiment
function start_experiment( number ) {

  if ( isNaN( number ) )
    number = 7;

  if ( currentExperimentNumber ) TBY.expriment[ currentExperimentNumber ].stop();
  currentExperimentNumber = number;

  if (  TBY.experiment[ number ] ) {
    TBY.experiment[ number ].init();
  }
  else {
    Modernizr.load({
      both: ['js/experiment/' + number + '.js'],
      complete: function () {
        TBY.experiment[ number ].init();
        $experiments.find('.exp-' + number ).addClass('active');
      }
    });
  }
}

// LOOK BEHIND YOU! A 3 HEADED MONKEY!
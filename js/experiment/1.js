/*
 * TEST 1
 * ======
 *   testing the use of basic classes
 */
var canvas, ctx, canvasWidth, canvasHeight;

window.onload = init;

// INIT
function init () {
	
	canvas			= document.getElementById('stage');
	canvas.width	= canvasWidth	= window.innerWidth;
	canvas.height	= canvasHeight	= window.innerHeight;
	
	setup();
}

var points		= Math.ceil( Math.random() * 10 ),
	circles		= Math.ceil( Math.random() * 10 ),
	balls		= Math.ceil( Math.random() * 10 ),
	
	gravity		= 10,
	friction	= .95,
	
	i;

function setup () {
	
	ctx = canvas.getContext('2d');
	
	var opt;
	
	i = points, points = [];
	while ( i-- ){
		
		opt = { 'x':		Math.round( Math.random() * canvasWidth ),
				'y':		Math.round( Math.random() * canvasHeight ),
				'color':	'rgb(' + Math.round( Math.random() * 255 ) + ', ' + Math.round( Math.random() * 255 ) + ', ' + Math.round( Math.random() * 255 ) + ')' };
		
		points[ i ] = new Point( opt );
	}
	
	i = circles, circles = [];
	while ( i-- ){
		
		opt = { 'x':		Math.round( Math.random() * canvasWidth ),
				'y':		Math.round( Math.random() * canvasHeight ),
				'radius':	Math.ceil( Math.random() * 25 ),
				'color':	'rgb(' + Math.round( Math.random() * 255 ) + ', ' + Math.round( Math.random() * 255 ) + ', ' + Math.round( Math.random() * 255 ) + ')' };
		
		circles[ i ] = new Circle( opt );
	}
	
	i = balls, balls = [];
	while ( i-- ){
		
		opt = { 'x':		Math.round( Math.random() * canvasWidth ),
				'y':		Math.round( Math.random() * canvasHeight ),
				'speed':	Math.round( Math.random() * 900 ) + 100,
				'angle':	Math.round( Math.random() * 360 ),
				'gravity':	gravity,
				'friction':	friction,
				'color':	'rgb(' + Math.round( Math.random() * 255 ) + ', ' + Math.round( Math.random() * 255 ) + ', ' + Math.round( Math.random() * 255 ) + ')' };
		
		balls[ i ] = new Ball( opt );
	}
	
	ANIMATOR.start();
}

function ANIMATE ( timeToCall ) {
	
	var time = ( new Date ).getTime(),
		timeElapsed = 
		
	
	ctx.clearRect ( 0, 0, canvasWidth, canvasHeight );
	
	i = points.length;
	while ( i-- ){
		
		points[ i ].draw();
	}
	
	i = circles.length;
	while ( i-- ){
		
		circles[ i ].draw();
	}
	
	i = balls.length;
	while ( i-- ){
		balls[ i ].update( timeToCall );
	}
}

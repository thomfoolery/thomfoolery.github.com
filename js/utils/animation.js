/* REQUEST ANIMATION FRAME POLYFILL */
(function() {

    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];

    for( var x = 0; x < vendors.length && ! window.requestAnimationFrame; ++x ) {

        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if ( ! window.requestAnimationFrame ){

        window.requestAnimationFrame = function( callback, element ) {

            var currTime	= new Date().getTime(),
                timeToCall	= Math.max( 0, 16 - ( currTime - lastTime ) ),
                id			= window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall );

            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if ( ! window.cancelAnimationFrame ) {

        window.cancelAnimationFrame = function( id ) {

            clearTimeout( id );
        };
    }
}());

/* ANIMATION LOOP
 *
 *  start: 		function
 *  stop: 		function
 *  draw: 		function
 * */
ANIMATOR = (function(){

    var time,
        lastTime				= ( new Date() ).getTime(),
        timeLapsed,
        isAnimating				= false,
        isAnimationRendering	= false;

    // LOOP
    function LOOP () {

        if ( isAnimating ) { // Only draw if we are drawing

            isAnimationRendering = true;

            time = ( new Date ).getTime();
            timeLapsed = time - lastTime;

            try {

                ANIMATOR.draw( timeLapsed ); // function defined elsewhere which draws animated elements
                lastTime = time;
            }
            catch (e) { log(e); }

            requestAnimationFrame( LOOP );
            isAnimationRendering = false;
        }
    }

    return {

        start: function () { // START ANIMATION

            isAnimating = true;

            if ( ! isAnimationRendering ) {
                LOOP();
            }
        },

        stop: function () { // STOP ANIMATION

            isAnimating = false;
        },

        draw: function () {} // DRAW A SINGLE FRAME

    };
}());

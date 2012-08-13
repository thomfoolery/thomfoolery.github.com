/*
 * STIR DEMO
 * =========
 *
 *   a group of particles follow and convene on the mouse
 *   clicking spreads the particles to a certain distance
 */

var canvas, ctx, canvasWidth, canvasHeight;

window.onload = function init () {

    canvas			= document.getElementById('stage');
    canvas.width	= canvasWidth	= window.innerWidth;
    canvas.height	= canvasHeight	= window.innerHeight;

    setup();
}

var PI_2 = Math.PI * 2,

    numberOfParticles = 100,
    particles = [],
    friction = .96,

    mouseX = 0,
    mouseY = 0,
    prevMouseX = 0,
    prevMouseY = 0,
    isMouseDown = false;

function setup() {

    ctx = canvas.getContext('2d');

    var i = numberOfParticles,
        m;

    while ( i-- ){

        m = new Particle();

        m.x		= canvasWidth * 0.5;
        m.y		= canvasHeight * 0.5;
        m.vX	= Math.cos(i) * Math.random() * 34;
        m.vY	= Math.sin(i) * Math.random() * 34;
        particles[ i ] = m;
    }

    mouseX = prevMouseX = canvasWidth * 0.5;
    mouseY = prevMouseY = canvasHeight * 0.5;

    document.onmousedown	= onMouseDown;
    document.onmouseup		= onMouseUp;
    document.onmousemove	= onMouseMove;

    ANIMATOR.start();
}

function Particle(){

    this.color	= 'rgb('
        + Math.floor( Math.random()*255 ) + ','	// R
        + Math.floor( Math.random()*255 ) + ','	// G
        + Math.floor( Math.random()*255 ) 		// B
        + ')';
    this.y		= 0;
    this.x		= 0;
    this.vX		= 0;
    this.vY		= 0;
    this.size	= 1;
}

function onMouseMove( e ){
    var ev = e ? e : window.event;
    mouseX = ev.clientX;
    mouseY = ev.clientY;
}

function onMouseDown( e ){
    isMouseDown = true;
    //ANIMATOR.stop();
    return false;
}

function onMouseUp( e ){
    isMouseDown = false;
    //ANIMATOR.start();
    return false;
}

/*
 * ANIMATION FUNCTION
 * ==================
 *   called on every requestAnimationFrame
 */
function ANIMATE ( lastTime ) { // RENDER FRAME

    canvas.width	= canvasWidth	= window.innerWidth;
    canvas.height	= canvasHeight	= window.innerHeight;

    mouseVX		= mouseX - prevMouseX;
    mouseVY		= mouseY - prevMouseY;
    prevMouseX	= mouseX;
    prevMouseY	= mouseY;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(8,8,12,0.65)';
    ctx.fillRect( 0 , 0 , canvasWidth , canvasHeight );
    ctx.globalCompositeOperation = 'lighter';

    toDist   = canvasWidth * 0.86,
    stirDist = canvasWidth * 0.125,
    blowDist = canvasWidth * 0.25,

    Mrnd = Math.random,
    Mabs = Math.abs;

    var i = numberOfParticles;
    while ( i-- ){

        var m  = particles[i],
            x  = m.x,
            y  = m.y,
            vX = m.vX,
            vY = m.vY,

            dX = x - mouseX,
            dY = y - mouseY,
            d  = Math.sqrt( dX * dX + dY * dY ) || 0.001;

        dX /= d;
        dY /= d;

        if ( isMouseDown ){
            if ( d < blowDist ){
                var blowAcc = ( 1 - ( d / blowDist ) ) * 14;
                vX += dX * blowAcc + 0.5 - Mrnd();
                vY += dY * blowAcc + 0.5 - Mrnd();
            }
        }

        if ( d < toDist ){
            var toAcc = ( 1 - ( d / toDist ) ) * canvasWidth * 0.0014;
            vX -= dX * toAcc;
            vY -= dY * toAcc;
        }

        if ( d < stirDist ){
            var mAcc = ( 1 - ( d / stirDist ) ) * canvasWidth * 0.00026;
            vX += mouseVX * mAcc;
            vY += mouseVY * mAcc;
        }

        vX *= friction;
        vY *= friction;

        var avgVX = Mabs( vX );
        var avgVY = Mabs( vY );
        var avgV  = ( avgVX + avgVY ) * 0.5;

        if ( avgVX < .1 ) vX *= Mrnd() * 3;
        if ( avgVY < .1 ) vY *= Mrnd() * 3;

        var sc = avgV * 0.45;
        sc = Math.max( Math.min( sc , 3.5 ) , 0.4 );

        var nextX = x + vX;
        var nextY = y + vY;

        if ( nextX > canvasWidth ){

            nextX = canvasWidth;
            vX *= -1;
        }
        else if ( nextX < 0 ){

            nextX = 0;
            vX *= -1;
        }

        if ( nextY > canvasHeight ){

            nextY = canvasHeight;
            vY *= -1;
        }
        else if ( nextY < 0 ){

            nextY = 0;
            vY *= -1;
        }

        m.vX = vX;
        m.vY = vY;
        m.x  = nextX;
        m.y  = nextY;

        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc( nextX , nextY , sc , 0 , PI_2 , true );
        ctx.closePath();
        ctx.fill();
    }
}

function rect( context , x , y , w , h ){

    context.beginPath();
    context.rect( x , y , w , h );
    context.closePath();
    context.fill();
}

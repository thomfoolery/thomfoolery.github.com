var TBY = TBY || {};
if ( ! TBY.experiment ) TBY.experiment = {};

TBY.experiment[ 6 ] = ( function () {

  var line,
      iterations = 8,

      delay = 0,
      DRAW_DELAY = 500;

  function start(){

    ANIMATOR.start();
  }

  function _draw( timeLapsed ){

    delay += timeLapsed;

    if ( delay < DRAW_DELAY ) return;

    delay = 0;
    line = fractalSubdivision( iterations );

    drawLine();
  }

  function drawLine(){

    ctx.fillStyle = 'rgba(0,0,0,.25)';
    ctx.lineWidth = 2;

    ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );



    point = line;

    var grad = ctx.createLinearGradient( 0, 0, 0, ctx.canvas.height );
    grad.addColorStop(0, 'rgba(127,0,0,1)');
    grad.addColorStop(1, 'rgba(255,0,0,.1)');

    ctx.strokeStyle = 'red';
    ctx.fillStyle = grad;

    ctx.beginPath();

      ctx.moveTo( ctx.canvas.width * point.x, ctx.canvas.height * point.y );
      while ( point.next ) {
        point = point.next;
        ctx.lineTo( ctx.canvas.width * point.x, ctx.canvas.height * point.y );
      }
      ctx.lineTo( ctx.canvas.width +2, ctx.canvas.height * point.y );
      ctx.lineTo( ctx.canvas.width +2, ctx.canvas.height +2 );
      ctx.lineTo( -2, ctx.canvas.height +2 );
      ctx.lineTo( -2, ctx.canvas.height * point.y );

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  }

  function fractalSubdivision( iterations ){

    var firstPoint = { x: 0, y: 1 },
        lastPoint = { x: 1, y: 1 },

        minY = maxY = 1,

        point, nextPoint, newPoint,
        dx, newX, newY,
        normalizeRate
        ;

    firstPoint.next = lastPoint;

    for ( var i = 0; i < iterations; i++ ){

      point = firstPoint;
      while ( point.next ){

        nextPoint = point.next;

        dx = nextPoint.x - point.x; // distance between the 2 points
        newX = .5 * ( point.x + nextPoint.x ); // mid X point
        newY = .5 * ( point.y + nextPoint.y ); // mid Y point
        newY += dx * ( Math.random() * 2 - 1 ); // add random value between -1 and +1 multiplied by the dx

        newPoint = { x: newX, y: newY };

        if ( newY < minY )
          minY = newY;
        else if ( newY > maxY )
          maxY = newY;

        newPoint.next = nextPoint;
        point.next = newPoint;

        point = nextPoint;
      }
    }

    //normalize to values between 0 and 1
    if ( maxY != minY ) {

      normalizeRate = 1 / ( maxY - minY );

      point = firstPoint;
      while ( point ) {

        point.y = normalizeRate * ( point.y - minY );
        point = point.next;
      }
    }
    //unlikely that max = min, but could happen if using zero iterations. In this case, set all points equal to 1.
    else {

      point = firstPoint;
      while ( point ) {

        point.y = 1;
        point = point.next;
      }
    }

    return firstPoint;
  }
  return {

    init: function(){

      ANIMATOR.draw = _draw;

      this.start();
    },

    start: function(){
      ANIMATOR.start();
    },

    stop: function(){
      ANIMATOR.stop();
    },

    destroy: function(){

      ANIMATOR.stop();
      ANIMATOR.draw = function(){};
    },

    clear: function(){
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }
  }
})();

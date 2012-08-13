var TBY = TBY || {};
if ( ! TBY.experiment ) TBY.experiment = {};

TBY.experiment[ 7 ] = ( function () {

  var CHANGE_DURATION = 500,
      stepTime = 0,
      phase,

      iterations = 8,
      deviation = ctx.canvas.height / 2 ,

      line1 = fractalSubdivision( iterations ),
      line2 = fractalSubdivision( iterations );

      radius  = ctx.canvas.height / 2 - ( deviation + 5 ),
      originX = - ( ctx.canvas.height / 2 ),
      originY = ctx.canvas.height / 2
      ;

   function _draw ( timeLapsed ){

    stepTime += timeLapsed;
    originX++;

    if ( stepTime > CHANGE_DURATION ) {

      stepTime = 0;

      line1 = line2;
      line2 = fractalSubdivision( iterations );
    }

    if ( originX > ctx.canvas.width + ( ctx.canvas.height / 2 + ( deviation + 5 ) ) ) {
      ANIMATOR.stop();
    }

    phase = stepTime / CHANGE_DURATION || 0;

    //ctx.fillStyle = 'rgba(0,0,0,.005)';
    //ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

    drawCircle( line1, line2, phase );
  }

  function drawCircle( line1, line2, phase ){

    var x, y, diff,

        point1 = line1,
        point2 = line2,

        grad = ctx.createLinearGradient( originX - radius - deviation, originY - radius - deviation, originX + radius + deviation, originY + radius + deviation );

    grad.addColorStop(0, 'rgba(255,0,0,.1)');
    grad.addColorStop(1, 'rgba(0,0,255,.1)');

    diff = point1.y + ( ( point2.y - point1.y ) * phase );
    x = originX + ( radius + ( deviation * diff )) * Math.cos( Math.PI * 2 * point1.x );
    y = originY + ( radius + ( deviation * diff )) * Math.sin( Math.PI * 2 * point1.x );

    ctx.strokeStyle = grad; //'rgba(255,0,0,.05)';
    ctx.lineWidth = 2;
    //ctx.fillStyle = 'rgba(0,0,0,.01)';

    ctx.beginPath();
      ctx.lineTo( x, y );
      while ( point1.next && point2.next ){

        point1 = point1.next;
        point2 = point2.next;

        diff = point1.y + ( ( point2.y - point1.y ) * phase );
        x = originX + ( radius + ( deviation * diff )) * Math.cos( Math.PI * 2 * point1.x );
        y = originY + ( radius + ( deviation * diff )) * Math.sin( Math.PI * 2 * point1.x );

        ctx.lineTo( x, y );
      }
    ctx.closePath();

    ctx.stroke();
    //ctx.fill();
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

      $canvas.bind('click.ex7', function(e){
        TBY.experiment[ 7 ].stop();
        TBY.experiment[ 7 ].clear();

        if ( originX > ctx.canvas.width + ( ctx.canvas.height / 2 + ( deviation + 5 ) ) )
          originX = - ( ctx.canvas.height / 2 );

        TBY.experiment[ 7 ].start();
      });

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
      $canvas.unbind('.ex7');
      ANIMATOR.draw = function(){};
    },

    clear: function(){
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }
  }
})();

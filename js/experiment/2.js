Modernizr.load({
  load: [

  ],
  complete: function () {

    var time      = ( new Date ).getTime()
      , $canvas   = TBY.$canvas
      , ctx       = TBY.context
      ;


    // * - * - * -  * //
    // CLEAR          //
    // * - * - * -  * //
    ctx.canvas.width = ctx.canvas.width;


    // * - * - * -  * //
    // SETUP          //
    // * - * - * -  * //


    // * - * - * -  * //
    // MAIN DRAW LOOP //
    // * - * - * -  * //
    var i = 0,
        x = 360;

    draw( 0 );
    function draw ( timeDelta ) {

      //console.log( timeDelta );

      i %= x;

      if ( timeDelta > 200 ) return next(); // EXIT

      ctx.save();

        var boxWidth = ctx.canvas.height / 4;

        ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 4 );
        ctx.rotate( Math.PI / 4 );

        var grad = ctx.createLinearGradient( -boxWidth / 2, -boxWidth / 2, boxWidth, boxWidth );
        grad.addColorStop(0,'hsl(' + i + ',50%,50%)');
        grad.addColorStop(1,'hsl(' + ( i + 50 ) + ',50%,50%)');

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 25;

        ctx.fillStyle = grad;
        ctx.fillRect( -boxWidth / 2, -boxWidth / 2, boxWidth, boxWidth );

      ctx.restore();

      ctx.save();

        ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 4 );
        ctx.rotate( Math.PI / 4 );

        ctx.fillStyle = 'black';
        ctx.fillRect( 0, 0, boxWidth, boxWidth );

      ctx.restore();

      ctx.save();

        boxWidth = ctx.canvas.height / 16;

        ctx.translate( ctx.canvas.width / 2, ( ctx.canvas.height / 8 ) * 3 );
        ctx.rotate( Math.PI / 4 );

        ctx.fillStyle = grad;
        ctx.fillRect( -boxWidth / 2, -boxWidth / 2, boxWidth, boxWidth );

      ctx.restore();

      i += .25;

      next();
    }

    function next () {
      window.requestAnimationFrame( function() { var Time = ( new Date ).getTime(), delta = Time - time; time = Time; draw( delta ); });
    }


    // * - * - * -  * //
    // UNLOAD         //
    // * - * - * -  * //
    TBY.unload = function () {

    };
  }
});
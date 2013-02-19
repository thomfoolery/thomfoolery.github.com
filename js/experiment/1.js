Modernizr.load({
  load: [

    "/js/classes/Point.js",

    "/js/decorators/Swim.js",
    "/js/decorators/Flock.js",
    "/js/decorators/Contain.js",
    "/js/decorators/ColorShift.js"

  ],
  complete: function () {

    var time      = ( new Date ).getTime()
      , $canvas   = TBY.$canvas
      , ctx       = TBY.context

      , MAX_ENTITIES = 100
      , entities = []
      , entity_radius = 5
      , entities_per_round = 5

      , interval_addEntity
      , interval_addEntity_duration = 1000
      ;


    function resize ( e ) {
      entities = []
    }
    window.addEventListener('resize', resize );

    // * - * - * -  * //
    // CLEAR          //
    // * - * - * -  * //
    ctx.canvas.width = ctx.canvas.width;


    // * - * - * -  * //
    // SETUP          //
    // * - * - * -  * //
    addEntity();
    function addEntity () {

      for ( var i = 0; i < entities_per_round; i++ ) {

        var entity
          , props
          , dir = Math.round( Math.random() * 360 )

          , flockOptions = {
              "entities": entities,
              "seperation": 20,
              "cohersion": 100
            }
          ;

        props = {
          x:      0,
          y:      0,
          vx:     -1,
          vy:     -1,
          dir:    dir,
          color: { h:  160 + Math.round( Math.random() * 100 ), s: '50%', l: '50%' },
          radius: entity_radius
        };

        entity = new Point( ctx, props );
        entity = TBY.decorate( entity, ColorShift );
        entity = TBY.decorate( entity, Contain );
        entity = TBY.decorate( entity, Flock, flockOptions );
        entity = TBY.decorate( entity, Swim );

        if ( entities.length > MAX_ENTITIES ) delete entities.shift();
        entities.push( entity );
      }
    }

    interval_addEntity = setInterval( addEntity, interval_addEntity_duration );


    // * - * - * -  * //
    // MAIN DRAW LOOP //
    // * - * - * -  * //
    draw( 0 );
    function draw ( timeDelta ) {

      //console.log( timeDelta );

      if ( timeDelta > 200 )
        return next();

      ctx.fillStyle = "rgba(0,0,0,.05)";
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.width );

      for ( var i = 0, len = entities.length; i < len; i++ ) {
        ctx.save();
          entities[ i ].update( timeDelta );
          entities[ i ].draw();
        ctx.restore();
      }

      next();
    }

    function next () {
      window.requestAnimationFrame( function() { var Time = ( new Date ).getTime(), delta = Time - time; time = Time; draw( delta ); });
    }


    // * - * - * -  * //
    // UNLOAD         //
    // * - * - * -  * //
    TBY.unload = function () {
      delete entities;
      clearInterval( interval_addEntity );
    };
  }
});
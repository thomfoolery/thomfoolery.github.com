  Modernizr.load({
  load: [

    "js/utils/trig.js",

    "js/classes/Entity.js",
    "js/classes/Vector.js",

    "js/decorators/Swim.js",
    "js/decorators/Flock.js",
    "js/decorators/Avoid.js",
    "js/decorators/Attract.js",
    "js/decorators/Contain.js",
    "js/decorators/ColorShift.js"

  ],
  complete: function () {

    var time    = ( new Date ).getTime()
      , $canvas = TBY.$canvas
      , ctx     = TBY.context

      , MOUSE = {
          "properties": {
            "position": new Vector()
          }
        }

      , predator

      , MAX_ENTITIES = 50
      , entities = []
      , entity_radius = 5
      , entities_per_round = 50
      , round_duration = 1000

      , totalTimeLapsed = 0
      ;

    // function mousemove ( e ) {
    //   MOUSE.properties.position.x = e.clientX;
    //   MOUSE.properties.position.y = e.clientY;
    // }
    // window.addEventListener('mousemove', mousemove );

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

    // predator = new Entity( ctx, {
    //   "position": new Vector(
    //     ctx.canvas.width  / 2,
    //     ctx.canvas.height / 4,
    //     0
    //   ),
    //   "color": {
    //     "h":  20,
    //     "s": '80%',
    //     "l": '50%'
    //   },
    //   "radius": 10
    // });

    // predator = TBY.decorate( predator, Contain, { avoid: true } );
    // predator = TBY.decorate( predator, Attract, { target: MOUSE, distance: 100 } );
    // predator = TBY.decorate( predator, Swim, {
    //   "direction":  Math.round( Math.random() * 360 )
    // });

    function spawnRound () {

      for ( var i = 0; i < entities_per_round; i++ ) {

        var props
          , entity
          , direction = new Vector (
               1, //Math.cos( Math.PI * 2 / entities_per_round * i ),
               0, //Math.sin( Math.PI * 2 / entities_per_round * i ),
               0
            ).heading( true )
          , offset = Math.random()
          ;

        props = {
          "position": new Vector(
            ( ctx.canvas.width  / 2 ) + Math.cos( Math.PI * 2 / entities_per_round * i ) * 40,
            ( ctx.canvas.height / 4 ) + Math.sin( Math.PI * 2 / entities_per_round * i ) * 40,
            0
          ),
          "color": {
            "h": 160 + Math.round( Math.random() * 100 ),
            "s": '50%',
            "l": '50%'
          },
          "radius": entity_radius
        };

        entity = new Entity( ctx, props );
        entity = TBY.decorate( entity, ColorShift );
        entity = TBY.decorate( entity, Contain, { wrap: true } );

        // entity = TBY.decorate( entity, Avoid, {
        //   "obsticle": predator,
        //   "distance": 100
        // });

        entity = TBY.decorate( entity, Flock, {
          "neighbours": entities
        });

        entity = TBY.decorate( entity, Swim, {
          "direction": direction
        });

        //if ( entities.length > MAX_ENTITIES ) delete entities.shift();
        entities.push( entity );
      }
    }
    spawnRound();


    // * - * - * -  * //
    // MAIN DRAW LOOP //
    // * - * - * -  * //
    draw( 0 );
    function draw ( timeDelta ) {

      if ( timeDelta > 200 )
        return next();

      totalTimeLapsed += timeDelta;

      // if ( totalTimeLapsed >= round_duration && entities.length < MAX_ENTITIES )
      //   spawnRound();

      totalTimeLapsed %= round_duration;

      ctx.fillStyle = "rgba(0,0,0,.05)";
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.width );

      for ( var i = 0, len = entities.length; i < len; i++ ) {
        entities[ i ].update( timeDelta );
        entities[ i ].draw();
      }

      // predator.update( timeDelta );
      // predator.draw();

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
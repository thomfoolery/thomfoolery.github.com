function Contain ( base, options ) {

  var Contain = Object.create( base )

    , RETURN_DEGREES = true
    ;

  if ( options.avoid === true ) {

    Contain.update = function ( timeDelta ) {

      var props = this.properties
        , ctx = this.ctx

        , direction = props.direction
        , position  = props.position
        , velocity  = props.velocity
        , speed     = props.speed

        , margin = 100
        , angle
        , copy
        ;

      if (
           velocity.x < 0 && Math.round( position.x ) === margin
        || velocity.x > 0 && Math.round( position.x ) === ctx.canvas.width - margin
      ) {

        copy = velocity.copy();
        copy.x *= -1;
        this.changeOfDirection( copy.heading( RETURN_DEGREES ) );
      }

      if (
           velocity.y < 0  && Math.round( position.y ) === margin
        || velocity.y > 0  && Math.round( position.y ) === ctx.canvas.height - margin
      ) {

        copy = velocity.copy();
        copy.y *= -1;
        this.changeOfDirection( copy.heading( RETURN_DEGREES ) );
      }

      if ( position.x < props.radius || position.x > ctx.canvas.width - props.radius ) {

        velocity.x *= -1;
        this.suddenChangeOfDirection( velocity.heading( RETURN_DEGREES ) );
      }

      if ( position.y < props.radius || position.y > ctx.canvas.height - props.radius ) {

        velocity.y *= -1;
        this.suddenChangeOfDirection( velocity.heading( RETURN_DEGREES ) );
      }

      base.update.call( this, timeDelta );
    }
  }

  else if ( options.wrap === true ) {

    Contain.update = function ( timeDelta ) {

      var props = this.properties
        , ctx = this.ctx

        , position = props.position
        , velocity = props.velocity
        , speed = props.speed
        ;

      if ( position.x + ( velocity.x * speed ) < 0 ) {
        position.x = ctx.canvas.width;
      }
      else if ( position.x + ( velocity.x * speed ) > ctx.canvas.width ) {
        position.x = 0;
      }

      if ( position.y + ( velocity.y * speed ) < 0 ) {
        position.y = ctx.canvas.height;
      }
      else if ( position.y + ( velocity.y * speed ) > ctx.canvas.height ) {
        position.y = 0;
      }

      base.update.call( this, timeDelta );
    };
  }

  else {

    Contain.update = function ( timeDelta ) {

      var props = this.properties
        , ctx = this.ctx

        , position = props.position
        , velocity = props.velocity
        , speed = props.speed

        , angle
        ;

      if ( position.x + ( velocity.x * speed ) < 0 || position.x + ( velocity.x * speed ) > ctx.canvas.width )
        velocity.x *= -1;

      if ( position.y + ( velocity.y * speed ) < 0 || position.y + ( velocity.y * speed ) > ctx.canvas.height )
        velocity.y *= -1;

      angle = velocity.heading( RETURN_DEGREES );
      this.changeOfDirection( angle );

      base.update.call( this, timeDelta );
    };
  }

  return Contain;
}
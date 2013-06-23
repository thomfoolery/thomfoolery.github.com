function Move ( base, options ) {

  if ( typeof options.direction != 'number' ) return base;// EXIT

  var Move      = Object.create( base )
    , options   = options || {}
    , props     = Move.properties

    , heading   = options.direction || 0
    , duration  = 0
    , increment = 1

    , range = options.range || Math.random() * 300 + 200

    , RETURN_DEGREES = true
    ;

  props.direction = heading = normalizeAngle( heading );

  applyHeading( heading );

  Move.update = function ( timeDelta ) {

    var props = this.properties;

    if ( this.flock )
      heading = normalizeAngle( props.velocity.heading( RETURN_DEGREES ) );

    if ( options.swim )
      this.swim();

    applyHeading( heading );

    props.velocity.multiply( props.speed );

    base.update.call( this, timeDelta );

  };

  Move.swim = function () {

    duration += 1;

    if ( options.descision && duration >= range ) {
      props.direction += ( Math.round( Math.random() ) * 2 -1 ) * Math.ceil( Math.random() * 90 );
      range            = Math.random() * ( options.range || 300 ) + 200;
      props.direction  = normalizeAngle( props.direction );
    }

    if ( ( increment ===  1 && heading + increment > props.direction + 20 )
      || ( increment === -1 && heading + increment < props.direction - 20 ) ) {
        increment *= -1;
    }

    duration %= range;
    heading  += increment;
  }

  Move.changeOfDirection = function ( angle ) {

    angle = normalizeAngle( angle );

    var diff = Math.abs( props.direction - angle );

    if ( diff > 180 )
      increment = -1;
    else
      increment = 1;

    props.direction = angle;
    duration        = 0;
    range           = 250;
  };

  Move.suddenChangeOfDirection = function ( angle ) {

    props.direction = heading = normalizeAngle( angle );

    applyHeading( heading );

    duration = 0;
    range    = 250;
  };

  return Move;

  // === === === === ===

  function degToRads ( angle ) {
    return ( ( angle * Math.PI ) / 180 );
  }

  function normalizeAngle ( angle ) {
    if ( angle < 0 ) angle += 360;
    if ( angle > 360 ) angle %= 360;
    return angle;
  }

  function applyHeading ( heading ){

    props.velocity = new Vector(
      Math.cos( degToRads( heading ) ),
      Math.sin( degToRads( heading ) ),
      0
    );
  }
}
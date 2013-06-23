function Flock ( base, options ) {

  if ( ! options.neighbours ) return base;

  var Flock = Object.create( base )
    , options = options || {}
    , props = Flock.properties

    , neighbours = options.neighbours || []

    , MAX_SPEED           = options.MAX_SPEED           || 2
    , MAX_FORCE           = options.MAX_FORCE           || 0.05
    , DESIRED_SEPARATION  = options.DESIRED_SEPARATION  || 5

    , NEIGHBOUR_RADIUS    = options.NEIGHBOUR_RADIUS    || 35

    , SEPERATION_WEIGHT   = options.SEPERATION_WEIGHT   || 2
    , ALIGNMENT_WEIGHT    = options.ALIGNMENT_WEIGHT    || 1
    , COHESION_WEIGHT     = options.COHESION_WEIGHT     || 1
    ;

  Flock.flock = true;

  Flock.update = function ( timeDelta ) {

    var props = this.properties

      , seperation    = seperate( neighbours ).multiply( SEPERATION_WEIGHT )
      , alignment     = align( neighbours).multiply( ALIGNMENT_WEIGHT )
      , cohesion      = cohere( neighbours ).multiply( COHESION_WEIGHT )
      , acceleration  = seperation.add( alignment ).add( cohesion )
      ;

    props.velocity.add( acceleration.limit( MAX_SPEED ) );

    base.update.call( this, timeDelta );
  };

  return Flock;

  function cohere ( neighbours ) {

    var sum  = new Vector()
      , count = 0
      , nProps
      , delta
      ;

    for ( var i = 0, len = neighbours.length; i < len; i++ ) {

      nProps = neighbours[ i ].properties;
      delta = props.position.distance( nProps.position  );

      if ( delta > 0 && delta < NEIGHBOUR_RADIUS ) {
        sum.add( nProps.position );
        count++;
      }
    }

    if ( count > 0 )
      return steerTo( sum.divide( count ) );
    else
      return sum;
  }

  function steerTo ( target ) {

    var desired = props.position.copy().subtract( target )
      , magnitude = desired.magnitude()
      , steer
      ;

    if ( magnitude > 0 ) {

      desired.normalize();

      if ( magnitude < 100.0 )
        desired.multiply( MAX_SPEED * ( magnitude / 100 ) );
      else
        desired.multiply( MAX_SPEED );

      steer = desired.subtract( props.velocity );
      steer.limit( MAX_FORCE );
    }
    else
      steer = new Vector();

    return steer;
  }

  function align ( neighbours ) {

    var mean = new Vector()
      , count = 0
      , distance
      ;

    for ( var i = 0, len = neighbours.length; i < len; i++ ) {

      nProps = neighbours[ i ].properties;
      distance = props.position.distance( nProps.position );

      if ( distance > 0 && distance < NEIGHBOUR_RADIUS ) {
        mean.add( nProps.velocity );
        count++;
      }
    }

    if ( count > 0 )
      mean.divide( count );

    mean.limit( MAX_FORCE );
    return mean;
  }

  function seperate ( neighbours ) {

    var mean = new Vector()
      , count = 0
      , distance
      ;

    for ( var i = 0, len = neighbours.length; i < len; i++ ) {

      nProps = neighbours[ i ].properties;
      distance = props.position.distance( nProps.position );

      if ( distance > 0 && distance < DESIRED_SEPARATION ) {

        mean.add( props.position.subtract( nProps.position ).normalize().divide( distance ) );
        count++;
      }
    }

    if ( count > 0 )
      mean.divide( count );

    return mean;
  }
}
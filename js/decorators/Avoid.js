function Avoid ( base, options ) {

  if ( ! options ) return; // EXIT

  var Avoid = Object.create( base )
    , props = Avoid.properties

    , RETURN_DEGREES = true
    ;

  if ( options.obsticle ) {

    Avoid.update = function ( timeDelta ) {

      var props = this.properties
        , obsticle = options.obsticle
        , distance = props.position.distance( obsticle.properties.position )
        , direction
        ;

      if ( distance < options.distance ) {
        direction = obsticle.properties.position.angle( props.position, RETURN_DEGREES );
        this.suddenChangeOfDirection( direction );
      }

      base.update.call( this, timeDelta );
    }
  }
  else if ( options.obsticles.length ) {
    /* TO DO
    Avoid.update = function ( timeDelta ) {

      var props = this.properties;



      base.update.call( this, timeDelta );
    }
    */
  }

  return Avoid;
}
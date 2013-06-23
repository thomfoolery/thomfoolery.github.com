function Attract ( base, options ) {

  if ( ! options ) return; // EXIT

  var Attract = Object.create( base )
    , props = Attract.properties

    , RETURN_DEGREES = true
    ;

  if ( options.target ) {

    Attract.update = function ( timeDelta ) {

      var props = this.properties
        , target = options.target
        , distance = props.position.distance( target.properties.position )
        , direction
        ;

      if ( distance < options.distance && distance > options.distance / 4 ) {
        direction = props.position.angle( target.properties.position, RETURN_DEGREES );
        this.changeOfDirection( direction )
      }

      base.update.call( this, timeDelta );
    }
  }
  else if ( options.targets.length ) {
    /* TO DO
    Attract.update = function ( timeDelta ) {

      var props = this.properties;

      base.update.call( this, timeDelta );
    }
    */
  }

  return Attract;
}
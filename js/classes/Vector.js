function Vector ( x, y, z ) {

  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;

  this.copy = function () {

    return new Vector( this.x, this.y, this.z );
  };

  this.magnitude = function () {

    return Math.sqrt(
      ( this.x * this.x ) +
      ( this.y * this.y ) +
      ( this.z * this.z )
    );
  };

  this.normalize = function () {

    var m = this.magnitude();

    if ( m > 0 )
      this.divide( m );

    return this;
  };

  this.limit = function ( max ) {

    if ( this.magnitude() > max ) {

      this.normalize();
      return this.multiply( max );
    }
    else
      return this;
  };

  this.heading = function ( returnDegrees ) {
    var heading = Math.atan2( -1 * this.y, this.x ) * -1;
    if ( returnDegrees )
      return ( ( heading * 180 ) / Math.PI );
    return heading;
  };

  this.distance = function ( other, dimensions ) {

    var dx = Math.abs( this.x - other.x )
      , dy = Math.abs( this.y - other.y )
      , dz = Math.abs( this.z - other.z )
      ;

    if ( dimensions ) {
      dx = ( dx < dimensions.width  / 2 ) ? dx : dimensions.width  - dx ;
      dy = ( dy < dimensions.height / 2 ) ? dy : dimensions.height - dy ;
    }

    return Math.sqrt(( dx * dx )+( dy * dy )+( dz * dz ));
  };

  this.eucl_distance = function ( other ) {

    var dx = this.x - other.x
      , dy = this.y - other.y
      , dz = this.z - other.z
      ;

    return Math.sqrt(( dx * dx )+( dy * dy )+( dz * dz ));
  };

  this.angle = function ( other, returnDegrees ) {

    var x, y, radians;

    // find horizontal distance (x)
    x = other.x - this.x;
    // find vertical distance (x)
    y = other.y - this.y;

    radians = Math.atan2( y, x );

    if ( returnDegrees )
      return ( ( radians * 180 ) / Math.PI );
    return radians;
  }

  this.add = function ( other ) {

    this.x += other.x;
    this.y += other.y;
    this.z += other.z;

    return this;
  };

  this.subtract = function ( other ) {

    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;

    return this;
  };

  this.multiply = function ( n ) {

    this.x *= n;
    this.y *= n;
    this.z *= n;

    return this;
  };

  this.divide = function ( n ) {

    this.x /= n;
    this.y /= n;
    this.z /= n;

    return this;
  };

  this.invalid = function () {
    return ( this.x == Infinity || isNaN( this.x )
          || this.y == Infinity || isNaN( this.y )
          || this.z == Infinity || isNaN( this.z ) )
  }

}
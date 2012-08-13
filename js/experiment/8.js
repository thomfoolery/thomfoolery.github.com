var TBY = TBY || {};
if ( ! TBY.experiment ) TBY.experiment = {};

TBY.experiment[ 8 ] = ( function () {

  var phase = 'FADE IN',
      fade_in_duration = 5000,
      lapsed = 0,

      UI = {
        mouse: {
          over: null,
          click: null
        }
      },

      PLAYER,
      OBJECTS = {
        background: [],
        foreground: []
      },
      LIGHTS = [],
      SCENE
      ;


  function _init(){

    SCENE = new Scene({ width: 2000 }, { sceneDataURL: 'json/scene-1.json' });

    createObject( 'sign', Sign, {}, {}, 'background' );

    createObject( 'door', Door, {
      x: getObject('sign').x - 175
    }, {}, 'background' );

    createObject( 'bike', Bike, {
      x: getObject('sign').x - 400,
    }, {}, 'foreground' );

    Light.prototype.createLight({
      x: getObject('sign').x - 400
    }, {});
    Light.prototype.createLight({
      x: getObject('sign').x + getObject('sign').width + 175
    }, {});
    Light.prototype.createLight({
      x: getObject('sign').x + getObject('sign').width + 400
    }, {});

    PLAYER = new Player({ x: getObject('door').x - 100, }, {} );

    $canvas.bind('mouseup.ex8', mouseUp );
    function mouseUp ( e ){

      if ( e.which === 1 ) {
        PLAYER.walkTo( MOUSE_X + ( SCENE.offset * -1 ) );
        if ( UI.mouse.over != null ){
          UI.mouse.click = UI.mouse.over;
        }
      }
    }
  }

  function _draw ( timeLapsed ){

    if ( timeLapsed > 100 ) return;

    ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

    ctx.save();
    if ( SCENE.offset != 0 ){
      ctx.translate( SCENE.offset, 0 );
    }

    //draw wall
    SCENE.draw( timeLapsed );

    // draw background OBJECTS
    for( var i = 0, len = OBJECTS.background.length; i < len; i++ ){
      OBJECTS.background[ i ].update();
      OBJECTS.background[ i ].draw();
    }

    // draw PLAYER
    PLAYER.update( timeLapsed );
    PLAYER.draw( timeLapsed );

    // draw background OBJECTS
    for( var i = 0, len = OBJECTS.foreground.length; i < len; i++ ){
      OBJECTS.foreground[ i ].update();
      OBJECTS.foreground[ i ].draw();
    }

    // draw LIGHTS
    i = LIGHTS.length;
    while( i-- ){
      LIGHTS[ i ].draw();
    }

    if ( phase === 'FADE IN' ){
      lapsed += timeLapsed;
      ctx.fillStyle = 'rgba(0,0,0,' + ( 1 - ( lapsed / fade_in_duration )) + ')';
      ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
      if ( lapsed > fade_in_duration ){
        phase = ''
      }
    }

    ctx.restore();
  }


  function Scene ( properties, _properties ){

    var _P = {
      x: ( $( window ).width() - ( ( $( window ).width() - $('#wrap').width() ) / 2 ) ) - ( $('#wrap').width() / 4 ),
      y: parseInt( ctx.canvas.height ) + 100,
      sprite:       new Image(),
      spritePath:   '/img/sprites/scene-1-sprites.png',
      spriteIsReady:  false,
      sceneDataURL: null,
      sceneData : {}
    }

    this.width = ctx.canvas.width * 2;
    this.height = ctx.canvas.height;
    this.offset = 0;

    $.extend( true, this, properties );
    $.extend( true, _P, _properties );


    _init();
    function _init() {

      if ( _P.sceneDataURL != null ){

        $.getJSON( _P.sceneDataURL, function( data ){ _P.sceneData = data; });
      }

      // setup sprite canvas
      _P.sprite.onload = function(){

        _canvas         = document.createElement( 'canvas' );
        _canvas.width   = _P.sprite.width;
        _canvas.height  = _P.sprite.height;

        _ctx = _canvas.getContext( '2d');
        _ctx.drawImage( _P.sprite, 0, 0, _P.sprite.width, _P.sprite.height );

        var imageData = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );

        for ( var i = 0, len = _canvas.width * _canvas.height * 4; i < len; i += 4 ){ // turn turqoise to transparent
          if ( imageData.data[ i + 1 ] === 128 && imageData.data[ i + 2 ] === 128 && imageData.data[ i + 3 ] === 255 ){
            imageData.data[ i ] = 0; imageData.data[ i + 1 ] = 0; imageData.data[ i + 2 ] = 0; imageData.data[ i + 3 ] = 0;
          }
        }

        _ctx.clearRect( 0, 0, _canvas.width, _canvas.height );
        _ctx.putImageData( imageData, 0, 0 );

        _P.spriteIsReady = true;
      };
      _P.sprite.src = _P.spritePath;
    }

    this.getData = function( objectId, action ){

      var o = _P.sceneData[ objectId ];

      if ( o === null || o.action[ action ] === undefined ) return null;
      return o.action[ action ];
    };

    this.draw = function( timeLapsed ){

      var wall_gradient = ctx.createRadialGradient( _P.x, _P.y, 0, _P.x, _P.y, parseInt( ctx.canvas.height *10 ) );
      wall_gradient.addColorStop( 0, '#2e2e41' );
      wall_gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
      ctx.fillStyle = wall_gradient;
      ctx.fillRect( 0, 0, SCENE.width, SCENE.height );

      if ( _P.spriteIsReady ) {
        ctx.drawImage(
          _canvas,
          0,
          0,
          9,
          24,
          getObject('door').x + 50,
          150,
          18,
          48
        );
      }
    };
  }

  function Player( properties ){

      var _isDead = false,
          _P = {
            sprite:       new Image(),
            spritePath:   '/img/sprites/guybrush-walk-3.png',
            spriteIsReady:  false,
            animation:    'stand',
            index:        1,

            walk: {
              destinationX: null,
              offsetX:      0,
              offsetY:      0,
              spriteWidth:  32,
              spriteHeight: 48,
              spriteCount:  6,

              index:        0,
              phase:        0,
              phaseLength:  20,

              direction:    1, // -1: left | 1: right
              speed:        120  // px/sec
            },

            stand: {
              offsetX:      192,
              offsetY:      0,
              spriteWidth:  32,
              spriteHeight: 48,

              idle:    0,
              front:   1,
              back:    2
            },

            talk: {
              speech: [],
              duration: 0,
              lapsed: 0
            }
          },

          _canvas,
          _ctx
          ;

      this.x      = 0,
      this.y      = ctx.canvas.height,
      this.width  = 60;
      this.height = 85;

      $.extend( true, this, properties );

      _P.walk.destinationX = this.x;

      // setup sprite canvas
      _P.sprite.onload = function(){

        _canvas         = document.createElement( 'canvas' );
        _canvas.width   = _P.sprite.width;
        _canvas.height  = _P.sprite.height;

        _ctx = _canvas.getContext( '2d');
        _ctx.drawImage( _P.sprite, 0, 0, _P.sprite.width, _P.sprite.height );

        var imageData = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );

        for ( var i = 0, len = _canvas.width * _canvas.height * 4; i < len; i += 4 ){ // turn turqoise to transparent
          if ( imageData.data[ i + 1 ] === 128 && imageData.data[ i + 2 ] === 128 && imageData.data[ i + 3 ] === 255 ){
            imageData.data[ i ] = 0; imageData.data[ i + 1 ] = 0; imageData.data[ i + 2 ] = 0; imageData.data[ i + 3 ] = 0;
          }
        }

        _ctx.clearRect( 0, 0, _canvas.width, _canvas.height );
        _ctx.putImageData( imageData, 0, 0 );

        _P.spriteIsReady = true;
      };
      _P.sprite.src = _P.spritePath;

      this.update = function( timeLapsed ){

          // KEYBOARD
          if ( KEY_PRESSED ) {}
          else {}



          // STAND: up & down
          if ( KEY_UP || KEY_DOWN ){

             if ( KEY_UP ) {
               _P.animation  = 'stand';
               _P.index = _P.stand.back;
             }
             else if ( KEY_DOWN ){
               _P.animation  = 'stand';
               _P.index = _P.stand.front;
             }
          }



          // WALK: left & right
          else if ( KEY_LEFT || KEY_RIGHT ){

            _P.walk.destinationX = null

            if ( _P.animation != 'walk' ) {
              _P.animation  = 'walk';
              _P.index = _P.walk.index;
            }

            if ( KEY_LEFT ) {
              _P.walk.direction = -1;
            }

            else if ( KEY_RIGHT ) {
              _P.walk.direction = 1;
            }

            PLAYER.walk( ( timeLapsed / 1000 ) * _P.walk.speed );
          }
          // WALK: to destination
          else if ( _P.walk.destinationX != null && _P.walk.destinationX != PLAYER.x ) {

            if ( _P.animation != 'walk' ) {
              _P.animation = 'walk';
              _P.index     = _P.walk.index;
            }
            if ( _P.walk.destinationX > PLAYER.x ){
              _P.walk.direction = 1;
            }
            else {
              _P.walk.direction = -1;
            }

            PLAYER.walk( ( timeLapsed / 1000 ) * _P.walk.speed );

            // WALK: to destination finished
            if ( Math.abs( _P.walk.destinationX - PLAYER.x ) < 1 ){
              PLAYER.x             = _P.walk.destinationX;
              _P.walk.destinationX = null;
              _P.animation         = 'stand';
              _P.index             = _P.stand.idle;

              if ( UI.mouse.click != null ){

                if ( UI.mouse.click.getStack() === 'foreground' ) {
                  _P.animation  = 'stand';
                  _P.index = _P.stand.front;
                }
                else{
                  _P.animation  = 'stand';
                  _P.index = _P.stand.back;
                }

                PLAYER.talk( SCENE.getData( UI.mouse.click.getId(), 'look' ).slice(0) );
                UI.mouse.click = null;
              }
            }
          }

          // WALK: stopped
          else if ( _P.animation === 'walk' && ! KEY_LEFT && ! KEY_RIGHT ) {
            _P.animation = 'stand';
            _P.index     = _P.stand.idle;
          }


          PLAYER.contain();
      }

      this.contain = function() {
            // left wall
        if ( PLAYER.x < PLAYER.width / 2 ) {
          PLAYER.x = PLAYER.width / 2;
          _P.walk.destinationX = null;
        }
            // right wall
        if ( PLAYER.x > SCENE.width - ( PLAYER.width / 2 ) ) {
            PLAYER.x = SCENE.width - ( PLAYER.width / 2 );
            _P.walk.destinationX = null;
        }
            // floor
        if ( PLAYER.y >= canvasHeight ) {

        }
      };

      this.walk = function( distance ){

        PLAYER.x      += _P.walk.direction * distance;
        _P.walk.phase += distance;

        var quarter   = ctx.canvas.width / 4;
            min = Math.abs( SCENE.offset ) + quarter,
            max = Math.abs( SCENE.offset ) + ( quarter * 3 )
            ;

        if ( _P.walk.phase > _P.walk.phaseLength ) {
          _P.index++;
          _P.walk.phase = 0;
        }

        if ( _P.index >= _P.walk.spriteCount ) {
          _P.index = _P.walk.index;
        }


        if ( ( _P.walk.direction === -1 && PLAYER.x < min && SCENE.offset < 0 ) ) {
          SCENE.offset -= _P.walk.direction * distance;
        }
        else if ( _P.walk.direction === 1 && PLAYER.x > max && Math.abs( SCENE.offset ) < SCENE.width - ctx.canvas.width ){
          SCENE.offset -= _P.walk.direction * distance;
        }
      };

      this.walkTo = function ( x ){

        if ( ! isNaN( parseInt( x ) ) ) {
          _P.walk.destinationX = x;
        }
      };

      this.talk = function( speech, duration ){

        if ( ! speech ){
          _P.talk.speech = [],
          _P.talk.duration = 0;
          _P.talk.lapsed = 0;
        }

        if ( $.isArray( speech ) ) {
          _P.talk.speech = speech;
        }
        else {
          _P.talk.speech = [ speech ];
        }

        _P.talk.duration = _P.talk.speech[0].length * 100;
        _P.talk.lapsed = 0;
      };

      this.die = function(){
        _isDead = true;
      };

      this.isDead = function(){
        return _isDead;
      };

      this.draw = function( timeLapsed ){

        if ( _isDead || ! _P.spriteIsReady ) return;

        var anim = _P[ _P.animation ];

        ctx.save();

        if ( _P.walk.direction < 0 ) {
          ctx.translate( PLAYER.x * 2, 0 );
          ctx.scale( -1, 1 );
        }

          ctx.drawImage(
            _canvas,
            anim.offsetX + ( _P.index * anim.spriteWidth ),
            0,
            anim.spriteWidth,
            anim.spriteHeight,
            PLAYER.x - ( PLAYER.width / 2 ),
            PLAYER.y - PLAYER.height,
            PLAYER.width,
            PLAYER.height
          );

        ctx.restore();

        if ( _P.talk.speech.length ){

          if ( _P.talk.lapsed > _P.talk.duration ){
            _P.talk.speech.shift();
            _P.talk.lapsed = 0;
            if ( _P.talk.speech.length === 0 ) return;
          }
          else{
            _P.talk.lapsed += timeLapsed;
          }

          ctx.font = 'bold 12px Helvetica';
          ctx.fillStyle = 'white';
          ctx.fillText( _P.talk.speech[0], PLAYER.x + ( PLAYER.width / 2 ), PLAYER.y - PLAYER.height );
        }
      };

      this.getBoundingBox = function(){

          var halfWidth = PLAYER.width / 2;
          return {
              x: ( PLAYER.x - halfWidth ),
              y: ( PLAYER.y - PLAYER.height ),
              width: PLAYER.width,
              height: PLAYER.height
          };
      };
  }

  function createObject( id, type, properties, _properties, stack ){

    if ( id === undefined ) throw Error('id parameter must be defined.');
    if ( type === undefined ) throw Error('type parameter must be defined.');

    _properties.id = id;
    _properties.stack = stack;

    var o = new type( properties, _properties );

    OBJECTS[ id ] = o;

    if ( stack === 'foreground') OBJECTS.foreground.push( o );
    else OBJECTS.background.push( o );
  }

  function getObject( id ){

    if ( id && OBJECTS[ id ] ) return OBJECTS[ id ];
    return null;
  }

  function Sign ( properties, _properties ){

    var _P = {
          isReady: false,
        font: [
          '52px Yanone Kaffeesatz',
          'italic 31px Yanone Kaffeesatz'
        ],
        text: [
          $('.page-title h1').text(),
          $('.page-title h2').text().toUpperCase()
        ],
        color: '0,242,255'
      },

      self = this,

      _canvas,
      _ctx;

    this.x = 0;
    this.y = 0;

    this.width = 0;
    this.height = 0;

    $.extend( true, this, properties );
    $.extend( true, _P, _properties );

    init();

    function init() {

      _canvas = document.createElement( 'canvas' );
      _ctx    = _canvas.getContext( '2d');

      ctx.font = _P.font[0];
      self.width = _canvas.width = 390;//_ctx.measureText( _P.text[0] ).width + 20;
      self.height = 103;
      _canvas.height =  self.height * 2;

      self.x = ( $( window ).width() - ( ( $( window ).width() - $('#wrap').width() ) / 2 ) ) - self.width;
      self.y = 40;

    // 1ST

      // backboard
      _ctx.fillStyle = 'rgba(16,16,16,1)';
      _ctx.strokeStyle = 'rgba(16,16,16,.2)';
      _ctx.lineWidth = 8;

      _ctx.fillRect( 4, 0, self.width -8, self.height -8 );
      _ctx.strokeRect( 4, 16, self.width -8, self.height -20 );

      // title
      _ctx.font = _P.font[0];
      _ctx.strokeStyle = 'rgba(' + _P.color +',.2)';
      _ctx.fillStyle = 'rgba(' + _P.color +',.7)';

      _ctx.lineWidth = 8;
      _ctx.strokeText( _P.text[0], 12, 48 );

      _ctx.lineWidth = 4;
      _ctx.strokeText( _P.text[0], 12, 48 );

      _ctx.fillText( _P.text[0],  12, 48 );

      // subtitle
      _ctx.font = _P.font[1];
      _ctx.lineWidth = 2;

      _ctx.strokeText( _P.text[1], 50, 85 );
      //_ctx.fillText( _P.text[1], 50,85 );


    // 2ND
       // backboard
      _ctx.fillStyle = 'rgba(16,16,16,1)';
      _ctx.strokeStyle = 'rgba(16,16,16,.2)';
      _ctx.lineWidth = 8;

      _ctx.fillRect( 4, 0 + self.height, self.width -8, self.height -8 );
      _ctx.strokeRect( 4, 16 + self.height, self.width -8, self.height -20 );

      // title
      _ctx.font = _P.font[0];
      _ctx.strokeStyle = 'rgba(' + _P.color +',.2)';
      _ctx.fillStyle = 'rgba(' + _P.color +',.7)';

      _ctx.lineWidth = 8;
      _ctx.strokeText( _P.text[0], 12, 48 + self.height );

      _ctx.lineWidth = 4;
      _ctx.strokeText( _P.text[0], 12, 48 + self.height );

      _ctx.fillText( _P.text[0],  12, 48 + self.height );

      // subtitle
      _ctx.font = _P.font[1];
      _ctx.lineWidth = 2;

      _ctx.strokeText( _P.text[1], 50, 85 + self.height );
      _ctx.fillText( _P.text[1], 50,85 + self.height );

      _P.isReady = true;
    };

    this.getId = function(){
      return _P.id;
    };

    this.getStack = function(){
      return _P.stack;
    };

    this.update = function( timeLapsed ){
      this.isMouseOver();
    };

    this.isMouseOver = function(){

      var x = this.x + SCENE.offset;

      if ( MOUSE_X > x
        && MOUSE_X < x + this.width
        && MOUSE_Y > this.y
        && MOUSE_Y < this.y + this.height ){

        UI.mouse.over = this;
        $canvas.css('cursor', 'pointer');
      }
      else if ( UI.mouse.over === this ){

        UI.mouse.over = null;
        $canvas.css('cursor', 'crosshair');
      }
    };

    this.draw = function( timeLapsed ){

      if ( ! _P.isReady ) return;

      var offset = 0;

      if ( Math.random() < .05 ){ //flicker
        offset = this.height;
      }

      ctx.drawImage(
        _canvas,
        0,
        0 + offset,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    };
  }

  function Door ( properties, _properties ){

    var _P = {
          width: 60,
          height: 100
        },

        _canvas,
        _ctx
        ;

    this.x = parseInt( $('.page-title h1').offset().left ) - 400;
    this.y = ctx.canvas.height;

    $.extend( true, this, properties );
    $.extend( true, _P, _properties );

    _init( this );
    function _init ( self ){

      Light.prototype.createLight({ x: self.x }, {});
    }

    this.getId = function(){
      return _P.id;
    };

    this.getStack = function(){
      return _P.stack;
    };

    this.update = function( timeLapsed ){
      this.isMouseOver();
    };

    this.isMouseOver = function(){

      var x = this.x + SCENE.offset;

      if ( MOUSE_X > x - ( _P.width / 2 )
        && MOUSE_X < x + ( _P.width / 2 )
        && MOUSE_Y > this.y - _P.height
        && MOUSE_Y < this.y ){

        UI.mouse.over = this;
        $canvas.css('cursor', 'pointer');
      }
      else if ( UI.mouse.over === this ){

        UI.mouse.over = null;
        $canvas.css('cursor', 'crosshair');
      }
    }

    this.draw = function( timeLapsed ){

      ctx.beginPath();
        ctx.fillStyle = 'rgba(24,24,24,1)';
        ctx.strokeStyle = 'rgba(64,64,64,.5)';
        ctx.lineWidth = 8;
        ctx.clearRect( this.x - ( _P.width / 2 ), this.y - _P.height, _P.width, _P.height );
        ctx.strokeRect( this.x - ( _P.width / 2 ), this.y - _P.height, _P.width, _P.height );
        ctx.fillRect( this.x - ( _P.width / 2 ) + 4,this.y - _P.height + 4, _P.width - 8, _P.height - 8 );

        // window
      ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeRect( this.x - ( _P.width / 2 ) + 16, this.y - _P.height + 16 , _P.width - 32 , 10 );
        ctx.fillRect( this.x - ( _P.width / 2 ) + 16, this.y - _P.height + 16 , _P.width - 32 , 10 );

        // knob
      ctx.beginPath();
        ctx.arc( this.x + ( _P.width / 4 ), this.y - ( _P.height * .6 ), 5, 0, 2 * Math.PI );
        ctx.fill();
    }
  }

  function Light ( properties, _properties ){

    var _P = {
          width: 180,
          height: 150
        },

        _canvas,
        _ctx
        ;

    this.x = 0;
    this.y = ctx.canvas.height;

    $.extend( true, this, properties );
    $.extend( true, _P, _properties );

    _init( this );
    function _init ( self ){

    }

    this.draw = function( timeLapsed ){

      ctx.beginPath();
        ctx.moveTo( this.x, this.y - _P.height );
        ctx.lineTo( this.x + _P.width / 2, this.y );
        ctx.lineTo( this.x - _P.width / 2, this.y );

        var light_gradient = ctx.createLinearGradient( this.x, this.y - _P.height, this.x, this.y + 100 );
        light_gradient.addColorStop( 0, 'rgba(254,255,151,.1)' );
        light_gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
        ctx.fillStyle = light_gradient;
        ctx.fill();
      ctx.closePath();

      ctx.beginPath();
        ctx.arc(this.x, this.y - _P.height + 10, 10, 0, Math.PI, true );
        ctx.fillStyle = 'black';
        ctx.fill();
      ctx.closePath();

      ctx.beginPath();
        ctx.moveTo( this.x -5, this.y - _P.height + 10 );
        ctx.lineTo( this.x +5, this.y - _P.height + 10 );
        ctx.strokeStyle = 'rgba(254,255,151,.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
  }
  Light.prototype.createLight = function( properties, _properties ){

    LIGHTS.push( new Light( properties, _properties ) );
  }

  function Bike( properties, _properties ){

    var _P = {
        sprite:       new Image(),
        spritePath:   '/img/sprites/bike.png',
        spriteIsReady:  false,
      },

      _canvas,
      _ctx
      ;

    this.x = 0;
    this.y = ctx.canvas.height;

    this.width = 130;
    this.height = 86;

    $.extend( true, this, properties );
    $.extend( true, _P, _properties );

    init( this );
    function init ( self ) {
      // setup sprite canvas
      _P.sprite.onload = function(){

        _canvas         = document.createElement( 'canvas' );
        _canvas.width   = _P.sprite.width;
        _canvas.height  = _P.sprite.height;

        _ctx = _canvas.getContext( '2d');
        _ctx.drawImage( _P.sprite, 0, 0, _P.sprite.width, _P.sprite.height );

        var imageData = _ctx.getImageData( 0, 0, _canvas.width, _canvas.height );

        for ( var i = 0, len = _canvas.width * _canvas.height * 4; i < len; i += 4 ){ // turn turqoise to transparent
          if ( imageData.data[ i + 1 ] === 128 && imageData.data[ i + 2 ] === 128 && imageData.data[ i + 3 ] === 255 ){
            imageData.data[ i ] = 0; imageData.data[ i + 1 ] = 0; imageData.data[ i + 2 ] = 0; imageData.data[ i + 3 ] = 0;
          }
        }

        _ctx.clearRect( 0, 0, _canvas.width, _canvas.height );
        _ctx.putImageData( imageData, 0, 0 );

        _P.spriteIsReady = true;
      };
      _P.sprite.src = _P.spritePath;
    }

    this.getId = function(){
      return _P.id;
    };

    this.getStack = function(){
      return _P.stack;
    };

    this.update = function( timeLapsed ){
      this.isMouseOver();
    };

    this.isMouseOver = function(){

      var x = this.x + SCENE.offset;

      if ( MOUSE_X > x - ( this.width / 2 )
        && MOUSE_X < x + ( this.width / 2 )
        && MOUSE_Y > this.y - this.height
        && MOUSE_Y < this.y ){

        UI.mouse.over = this;
        $canvas.css('cursor', 'pointer');
      }
      else if ( UI.mouse.over === this ){

        UI.mouse.over = null;
        $canvas.css('cursor', 'crosshair');
      }
    };

    this.draw = function () {

      if ( ! _P.spriteIsReady ) return;

      // bike
      ctx.drawImage(
        _canvas,
        0,
        0,
        72,
        48,
        this.x - ( this.width / 2 ),
        ctx.canvas.height - this.height,
        this.width,
        this.height
      );
    }
  }

  return {

    init: function() {

      ANIMATOR.draw = _draw;

      _init();

      $('.page-title').fadeOut( 2000, this.start );
    },

    start: function(){
      ANIMATOR.start();
    },

    stop: function(){
      ANIMATOR.stop();
    },

    destroy: function(){

      ANIMATOR.stop();
      $canvas.unbind('.ex8');
      ANIMATOR.draw = function(){};
    },

    clear: function(){
      ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
    }
  }
})();

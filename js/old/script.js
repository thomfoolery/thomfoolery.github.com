/* Author: Thomas Yuill 
 */

var TBY = (function(){
	
	var _P = {}, // private variables -- "untouchables"
		
		_M, // ref to model
		_V, // ref to view
		_C; // ref to controller
	
	_P.windowWidth	= $( window ).width();
	_P.windowHeight	= $(window).height();
	
	_P.scrollTop 		= 0;
	_P.prevScrollTop 	= 0;
	_P.scrollDirection 	= 'down';
	
	_P.goToOffset 		= 75;
	
	_P.topNavOffset		= 0;
	_P.wrapLeftOffset	= 0;
	
	_P.scrollToDuration = 1000;
	
	return {
		
		/* MODEL
		 * 
		 * get/set form fields
		 * store/retrieve document data */
		"model": {
			
			"init": function(){
				
				_M = TBY.model;
			},
			
			"setHash": function( sectionID ){
				
				window.location.hash = '/' + sectionID;
			},
			
			"getHash": function(){
				
				return window.location.hash;
			}
		},
		
		/* VIEW
		 * 
		 * DOM manipulations and Animations */
		"view": {
			
			"init": function(){
				
				_V = TBY.view;
				
				_P.topNavOffset 	= _V.el.topNav.offset().top;
				_P.wrapLeftOffset	= _V.el.wrap.offset().left;
				
				_V.el.fullName.lettering();
				_V.resizeSectionSpacing();
				_V.createLanterns();
				
				$.subscribe('fonts/complete', _V.begin );
			},
			
			"el": { // element references
				
				"window": 	$(window),
				
				"backgroundParallax": $('.background.parallax'),
				
				"wrap": 		$('#wrap'),
				"header": 		$('header'),
				"fullName": 	$('#full-name'),
				"topNav": 		$('#topNav'),
				"topNavLinks": 	$('#topNav a'),
				
				"sections": 	$('section'),
				"headings": 	$('section > h1.heading'),
				"quotes": 		$('.quote'),
				"spacers": 		$('.section-spacer')
			},
			
			"begin": function(){
				
				_V.el.wrap.animate(
					{ 'opacity': 1 },
					{
						'duration': 3000,
						'complete': _V.shine
					}
				);
				
				_V.goToSection( _M.getHash().split('/')[1] );
			},
			
			"parallaxBackground": function( scrollPosition ){
				
				_V.el.backgroundParallax.each( function( index, el ){
					
					var el = $( el );
					el.css('backgroundPosition', 'center ' + Math.round( _P.scrollTop * el.data('parallax') ) + 'px' );
				});
			},
			
			"createLanterns": function(){
				
				var $candle = $('<div class="lantern"></div>'),
					
					xOffset = ( _P.windowWidth - _V.el.wrap.width() ) / 4,
					yOffset = _P.windowHeight * .75;
				
				if ( xOffset < $candle.width() ){
					return; // EXIT
				}
				
				for ( var y = yOffset, height = $('body').height(); y < height; y += yOffset ){
					
					$('body').append( $candle.clone( false ).css( { 'top': y, 'left': xOffset } ) );
					$('body').append( $candle.clone( false ).css( { 'top': y, 'right': xOffset } ) );
				}
			},
			
			"shine": function( $container ){
				
				$container = $container || _V.el.fullName;
				
				if ( $container.find('.on').size() ) return;
					
				var $letter = $container.find('span:first');
				
				// self calling function passes in letter
				( function highlightNextCharacter( $letter ){
					
					$letter.removeClass();
					$letter.addClass('on');
					
					setTimeout( function(){
						
						var next = $letter.next();
						
						$letter.parent().find('.on').removeClass('on');
						
						if ( next.text() === '' ) next = next.next();
						
						if ( next.size() )
							highlightNextCharacter( next );
					}, 50);
				})( $letter );
			},
			
			"lockTopNav": function(){
				
				if ( _P.scrollTop <= _P.topNavOffset ){
					
					_V.el.topNav.removeClass('locked');
					_V.el.topNav.css('left', 0 );
					
				}
				else if ( _P.scrollTop > _P.topNavOffset && ! _V.el.topNav.hasClass('locked') ){
					
					_V.el.topNav.addClass('locked');
					_V.el.topNav.css('left', _P.wrapLeftOffset );
				}
			},
			
			"lockHeading": function(){
				
				_V.el.sections.each(function( index, el ){
					
					var $section 	= $( el ),
						$header 	= $section.children('.heading'),
						sectionID 	= $header.children('a').attr('href').split('/')[1],
						top 		= $section.offset().top,
						btm 		= top + $section.height() - $header.height();
					
					if ( _P.scrollTop < top - _P.windowHeight || _P.scrollTop > btm )
						_V.unhighlightNav( sectionID );
					else
						_V.highlightNav( sectionID );
						
					if ( ( _P.scrollTop < top || _P.scrollTop > btm ) && $header.hasClass('locked') ){
						
						if ( _P.scrollDirection === 'down' ){
							
							$header.fadeOut(250, function(){
								
								$header.removeClass('locked')
									.css( { "left": '', "top": ''} )
									.show();
							});
						}
						else if ( _P.scrollDirection === 'up' ){
							
							$header.removeClass('locked')
								.css( { "left": '', "top": ''} );
						}
						
					}
					else if ( ( _P.scrollTop > top && _P.scrollTop < btm ) && ! $header.hasClass('locked') ){
						
						if ( _P.scrollDirection === 'down' ){
							
							$header.addClass('locked')
								.css('left', _P.wrapLeftOffset );
						}
						else if ( _P.scrollDirection === 'up' ){
							
							$header.hide()
								.addClass('locked')
								.css('left', _P.wrapLeftOffset )
								.fadeIn(250);
						}
					}
				});
			},
			
			"scaleQuotes": function(){
				
				_V.el.quotes.each( function( index, el ){
					
					var $quote 			= $( el ),
						topOffset 		= $quote.offset().top,
						halfWinHeight 	= _P.windowHeight / 2,
						midScreenOffset = _P.scrollTop + halfWinHeight,
						
						ratio,
						diff = topOffset - _P.scrollTop;
						
						
						if ( diff >= _P.windowHeight )
							ratio = 0;
						else if ( diff < 0 )
							ratio = 1;
						else
							ratio = 1 - ( diff / _P.windowHeight );
						
					$quote.css( 'opacity', ratio );
					$quote.css( Modernizr.prefixed( 'transform' ), 'scale(' + ratio + ')' );
				});
			},
			
			"goToSection": function( sectionID ){
				
				var $section = ( sectionID === 'about' )?$('header') : $('section#' + sectionID );
				
				if ( $section.size() > 0 ){
					
					_V.scrollTo( $section.offset().top - _P.goToOffset, _P.scrollToDuration, null, 'swing' );
					return true;
				}
				else
					return false;
			},
			
			"highlightNav": function( sectionID ){
				
				var $currentHighlight = _V.el.topNav.children('.active');
				
				if ( $currentHighlight.hasClass( sectionID ) )
					return;
				
				_M.setHash( sectionID );
				
				_V.el.topNav.children('.' + sectionID )
					.addClass('active')
					.animate( { "opacity": .2 } );
			},
			
			"unhighlightNav": function( sectionID ){
				
				var $sectionNavLink = _V.el.topNav.children('.' + sectionID + '.active' );
				
				if ( $sectionNavLink.size() === 0 )
					return;
				
				$sectionNavLink.removeClass('active')
					.animate( { "opacity": 1 } );
			},
			
			"scrollTo": function( offset, duration, onComplete, easing ){
				
				if ( offset < 0 ) offset = 0;
				
				if ( _P.scrollTop === offset )
					return;
				
				$('html,body').animate( 
					{
						"scrollTop": offset
					},
					{
						"duration": duration,
						"complete": onComplete,
						"easing": easing 
					}
				);
			},
			
			"resizeSectionSpacing": function(){
				
				_V.el.spacers.last().height( ( _P.windowHeight - _V.el.sections.last().height() ) / 2 );
			}
		},

		/* CONTROLLER
		 * 
		 * assign event handlers
		 * business logic
		 */
		"controller": {
			
			"init": function(){
				
				_C = TBY.controller;
				
				// assign event handlers
				_V.el.window.scroll( _C.events.scroll.window );
				_V.el.window.resize( _C.events.resize.window );
				
				_V.el.fullName.mouseenter( _C.events.mouseenter.fullName );
				_V.el.topNavLinks.click( _C.events.click.topNavLinks );
				
				// CSS3 animation listener (!) NOT WORKING
				//_V.el.header.bind('cssAnimationKeyframe', _C.events.css3Animation.end );
			},
			
			"events": {
				
				"mouseenter":{
					
					"fullName": function( e ){
						
						_V.shine();
					}
				},
				
				"click": {
					
					"topNavLinks": function( e ){
						
						var sectionID = $( e.target ).attr('href').split('/')[1];
						
						_V.goToSection( sectionID );
					}
				},
				
				"change": {
					// change handlers
				},
				
				"scroll": {
					
					"window": function( e ){
						
						_P.prevScrollTop 	= _P.scrollTop;
						_P.scrollTop 		= $( document ).scrollTop();
						
						_P.scrollDirection 	= ( _P.scrollTop > _P.prevScrollTop )? 'down' : 'up';
						
						_V.parallaxBackground();
						_V.lockHeading();
						_V.scaleQuotes();
						_V.lockTopNav();
						
					}
				},
				
				"resize": {
					
					"window": function( e ){
						
						_P.windowWidth	= $( window ).width();
						_P.windowHeight	= $( window ).height();
						
						_P.topNavOffset 	= _V.el.topNav.offset().top;
						_P.wrapLeftOffset	= _V.el.wrap.offset().left;
						
						_V.resizeSectionSpacing();
					}
				},
				
				"css3Animation": {
					
					"end": function( e ){
						
						if ( e.originalEvent.keyText === '100%' )
							console.log( '!' );
					}
				}
				// ...
			},
			
			"logic": {
				
			}
		},
		
		"init": function(){
			
			TBY.model.init();
			TBY.view.init();
			TBY.controller.init();
		}
	}
})();

$(document).ready( function( e ){ 
	TBY.init(); 
});
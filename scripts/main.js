$( function () {

  var $body           = $('body')
    , $mainNav        = $('#main-nav')
    , $sections       = $('section')
    , $currentSection = null

    , navOffsetTop    = $('#main-nav').offset().top
    , prevScrollTop   = 0
    ;



  if ( window.location.hash.substr(1) != '' ) {
    $('html,body').animate({"scrollTop": $( window.location.hash ).offset().top });
  }

  $( document ).on('click', '.toggle-nav', function ( e ) {
    if ( $body.hasClass('nav-open') )
      $body.removeClass('nav-open');
    else
      $body.addClass('nav-open');
  });

  $( document ).on('click', 'nav a', function ( e ) {

    $('html,body').animate({"scrollTop": $( $( e.currentTarget ).attr('href') ).offset().top });
    $body.removeClass('nav-open');
  });

  $( document ).on('click', '.load-iframe', function ( e ) {

    var $target = $( e.currentTarget )
      , $iframe = $('<iframe/>')
      ;

    $iframe[0].width  = $target.attr('width');
    $iframe[0].height = $target.attr('height');
    $iframe[0].src    = $target.data('src');

    $target.replaceWith( $iframe );

  });

  $( document ).on('scroll', function () {

    var currentScrollTop = $body.scrollTop()
      , scrollTop
      ;

    prevScrollTop = currentScrollTop;

    if ( currentScrollTop > navOffsetTop )
      $('#main-nav').addClass('fixed');
    else
      $('#main-nav').removeClass('fixed');

    // scroll down
    if ( prevScrollTop <= currentScrollTop )
      scrollTop = $body.scrollTop() + ( $( window ).height() - 200 );
    // scroll down
    else
      scrollTop = $body.scrollTop() + 200;

    $sections.each( function ( index, el ) {

      var $section         = $( el )
        , sectionOffsetTop = $section.offset().top
        ;

      if ( scrollTop > sectionOffsetTop && scrollTop < sectionOffsetTop + $section.outerHeight() ){

        $currentSection && $currentSection.removeClass('current');
        $currentSection = $section.addClass('current');

        var sectionID = $currentSection.attr('id')

        $mainNav.find('.current').removeClass('current');
        $mainNav.find('.' + sectionID ).addClass('current');

        if ( history.pushState )
          history.pushState( null, null, '#' + sectionID );

        return false; // EXIT loop
      }

    });

  });

});
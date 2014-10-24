define(['jquery'], function($) {
  $(document).on('click','[data-scroll-to]', function ( e ) {
    var $target = $( $( e.currentTarget ).data('scroll-to') );
    if ( $target.size() ) e.preventDefault();
    $('html,body').animate({
      "scrollTop": $target.offset().top
    });
  });
});
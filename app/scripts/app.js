define(['jquery','velocity-ui','reveal','parallax','scroll-to'],
  function ( $ ) {
    $(document).trigger('scroll');
    $(document).on('click','h1 .full-name', function (e) {
      var $target = $( e.currentTarget )
      if ( $target.data('split') == undefined ) {
        var name = $target.html().trim().replace(/&nbsp;/gi,' ')
          , html = ''
          ;
        $.each( name.split(''), function ( k, v ) {
          if ( v == ' ' ) return html += '&nbsp;';
          html += "<span>" + v + "</span>";
        });
        $target.data('split', true );
        $target.html( html );
      }
      $target.find('span').velocity('transition.flipXIn',{stagger:200});
    });
    return 'App started';
  }
);
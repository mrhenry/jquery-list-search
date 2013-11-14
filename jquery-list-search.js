/** @preserve
 *
 * Author: Yves Van Broekhoven
 * Version: 0.0.1
 *
 */
(function($) {
  var plugin_name = 'list_search';

  function ListSearch( $element ) {
    this.$element   = $element;
    this.list_id    = $element.data('search-list-id');
    this.$list      = $('#' + this.list_id);
    this.$items     = this.$list.find('li');
    this.cache      = null;
    this.$not_found = $('<li class="search-list-not-found">Sorry, not found</li>');

    this.init();
  }


  ListSearch.prototype.init = function() {
    this.create_cache();
    this.append_not_found();

    this.$element.on('keyup.list_search', $.proxy(this.search, this));
  };


  ListSearch.prototype.append_not_found = function() {
    this.$not_found
      .hide()
      .appendTo(this.$list);
  };


  ListSearch.prototype.create_cache = function() {
    this.cache = this.$items.map( function() {
      var $item           = $(this),
          $search_columns = $item.find('.search-column'),
          columns         = [];

      if ( $search_columns.length ) {
        $search_columns.map( function() {
          columns.push( $(this).text().toLowerCase() );
        });

      } else {
        columns.push( $.trim( $item.text().toLowerCase() ) );

      }

      return columns.join(' ');
    });

  };


  ListSearch.prototype.search = function() {
    var hit_idxs  = [],
        term      = $.trim( this.$element.val().toLowerCase() );

    if ( term === '' ) {
      this.$items.show();
      this.$not_found.hide();
      return;
    }

    this.cache.each( function(idx, value) {
      if ( value.indexOf(term) > -1 ) {
        hit_idxs.push(idx);
      }
    });

    this.filter( hit_idxs );
  };


  ListSearch.prototype.filter = function( hit_idxs ) {
    var _this = this;

    this.$items.hide();

    if ( hit_idxs.length ) {
      this.$not_found.hide();

      $.each(hit_idxs, function(idx, value){
        _this.$items.eq( value ).show();
      });

    } else {
      this.$not_found.show();

    }
  };


  ListSearch.prototype.destroy = function() {
    this.$items.show();
    this.$not_found.remove();
    this.$element.off('keyup.list_search');
    this.$element.data(plugin_name, null);
  };


  $.fn.listSearch = function() {
    return this.each( function() {
      var $this = $(this);

      if ( !$this.data(plugin_name) ) {
        $this.data(plugin_name, new ListSearch($this));
      }
    });
  };

}(jQuery));

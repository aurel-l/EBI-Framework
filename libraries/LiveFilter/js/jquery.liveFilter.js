/***********************************************************/
/*                    LiveFilter Plugin                    */
/*                      Version: 1.4                       */
/*                      Mike Merritt                       */
/*        https://github.com/mikemerritt/LiveFilter        */
/***********************************************************/

/*
  NOTE: this has been forked from master for EBI needs:
  https://github.com/mikemerritt/LiveFilter/pull/14/commits/6f6023d108d4b3a70157392f3231e245610dcc72
*/

(function($){
  $.fn.liveFilter = function (settings) {
    // Default settings
    var defaults = {
      delay: 0,
      defaultText: 'Type to Filter:',
      resetText: 'Reset',
      noMatches: 'No Matches',
      fitlerTargetCustomDiv: 'div',
      hideDefault: false,
      addInputs: false,
      ignore: false,
      zebra: {
        enabled: false,
        baseColor: false,
        altColor: false
      }
    };

    // Overwrite default settings with user provided ones. Declare some vars.
    var options = $.extend(defaults, settings);
    var keyDelay, filter, child;

    // Cache our wrapper element and find our target list.
    var wrap = $(this);
    var filterTarget = wrap.find('ul, ol, table,div');

    // Add no matches text.
    wrap.append('<div class="nomatches">'+options.noMatches+'</div>');
    var nomatches = $('.nomatches');
    nomatches.hide();

    // Determine our child element type.
    if (options.fitlerTargetCustomDiv) {
      child = options.fitlerTargetCustomDiv;
    } else if (filterTarget.is('ul') || filterTarget.is('ol')) {
      child = 'li';
    } else if (filterTarget.is('table')) {
      child = 'tbody tr';
    }

    // Hide the list/table by default. If not being hidden apply zebra striping if needed.
    if (options.hideDefault === true) {
      filterTarget.find(child).hide();
    } else if (options.hideDefault === false && options.zebra.enabled != false) {
      zebraStriping();
    }

    // Add inputs if required
    if (options.addInputs === true) {
      var markup = '<input class="filter" type="text" value="" /><input class="reset" type="reset" value="' + options.resetText + '" />';
      wrap.prepend(markup);
    }

    // Used to reset our text input and show all items in the filtered list
    wrap.find('input[type="reset"]').on("click", function() {
      nomatches.hide();

      if (options.defaultText === false) {

        wrap.find('input[type="text"]').attr('value', '');

        if (options.hideDefault === false) {
          list.each(function(i) {
            $(this).show();
          });
        } else if (options.hideDefault === true) {
          list.each(function(i) {
            $(this).hide();
          });
        }

      } else {

        wrap.find('input[type="text"]').attr('value', options.defaultText);

        if (options.hideDefault === false) {
          list.each(function(i) {
            $(this).show();
          });
        } else if (options.hideDefault === true) {
          list.each(function(i) {
            $(this).hide();
          });
        }

      }
      return false;
    });

    // Used to set the default text of the text input if there is any
    if (options.defaultText != false) {

      var input = wrap.find('input[type="text"]');
      input.attr('value', options.defaultText);

      input.focus(function() {
        var currentVal = $(this).val();
        if (currentVal === options.defaultText) {
          $(this).val('');
        }
      });

      input.blur(function() {
        // var defaultVal = $(this).attr('value'); // sets the programatic value
        // if (defaultVal === '') {
        //   $(this).attr('value', options.defaultText);
        // }
        var currentVal = $(this).val(); 
        if (currentVal === '') {
          $(this).val(options.defaultText);
        }
      });

    }

    // Cache list/table elements so we don't have to keep traversing the DOM.
    var list = filterTarget.find(child);

    // Keyup event - where the magic happens.
    wrap.find('input[type="text"]').on("keyup", function() {

      var input = $(this);
      clearTimeout(keyDelay);

      // Setting timeout for performance reasons.
      keyDelay = setTimeout(function () { 

        filter = input.val().toLowerCase();
        var visible = 0;
        var words = filter.split(' ');

        if (filter === '' && options.hideDefault === true) {
          list.each(function(i) {
            $(this).hide();
          })
        } else {
          // Iterate through list and show/hide the proper elements.
          list.each(function(i) {
            text = $(this).text().toLowerCase();
              // Non consecutive filtering
              for (var t = 0; t < words.length; t++) {
                if (text.indexOf(words[t]) < 0) {
                  var match = false;
                  break;
                } else {
                  var match = true;
                }
              }

              if (match === true) {
                visible ++;
                $(this).show();
              } else if (match === false) {
                $(this).fadeOut(100);
              }
          });

          if (visible === 0) {
            nomatches.show();
          } else if (visible > 0) {
            nomatches.hide();
          }

          if (options.ignore != false) {
            options.ignore.show();
          }

          if(options.zebra.enabled != false) {
            zebraStriping();
          }
        }

        clearTimeout(keyDelay);
      }, options.delay);

    });

    // Used for zebra striping list/table.
    function zebraStriping() {
      filterTarget.find(child + ':visible:odd').css({ background: options.zebra.baseColor });
      filterTarget.find(child + ':visible:even').css({ background: options.zebra.altColor });
    }

  }
})(jQuery);

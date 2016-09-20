(function ($) {
Drupal.behaviors.FieldGroupConditional = {
  attach: function(context) {
    $('form.node-form div.field-group-conditional').each(function(){
      var $this = $(this),
        parentSelector = $this.data('parent'),
        children = $this.data('children');

      if (!parentSelector || !children) return;
      var $parentEmt = $this.find(parentSelector), childMap = [];

      if (!$parentEmt.length) {
//        console.log('parentEmt error', $parentEmt, parentSelector);
        return;
      }

      for (var childSelector in children) {
        var $child = $this.find(childSelector);
        if (!$child.length) continue;

        childMap.push({obj:$child, ifvalue:children[childSelector]});
      }

      $parentEmt.on('change input', function(){
        var parentVal = $parentEmt.not(':disabled').filter(':checked').val(), disabled, changeQueue = [];

        // console.log('parentChange', $parentEmt, parentVal);
        $.each(childMap, function(cid, child) {
          // console.log('childmap', parentSelector, parentVal, child);
          if (parentVal === undefined) {
            disabled = true;
          }
          else {
            if (child.ifvalue instanceof Array) {
              disabled = child.ifvalue.indexOf(parentVal) < 0;
            }
            else {
              disabled = child.ifvalue !== parentVal;
            }
          }

          child.obj.attr('disabled', disabled);
//          console.log('childToggle', child.obj.attr('name'), disabled, $parentEmt.attr('name'));
          if (disabled) changeQueue.push(child.obj.first());
          else changeQueue.push(child.obj.filter(':checked').first());
          
          if (disabled && !child.obj.data('emptyInput.conditional')) {
            var $emptyInput = $('<input type="hidden" value="" class="field-group-conditional-empty-input">');
            $emptyInput.attr('name', child.obj.attr('name'));

            // empty disabled fields
            if (child.obj.is('input[type=text], input[type=number], textarea')) {
              if (child.obj.val().length) {
                $emptyInput.insertBefore(child.obj);
              }

            } else if (child.obj.is('select')) {
              if (child.obj.val() != '_none') {
                var emptyVal = null;

                if (child.obj.find('option[value="_none"]').length) emptyVal = '_none';
                else if (child.obj.find('option[value="0"]').length) emptyVal = '0';

                if (emptyVal !== null) {
                  $emptyInput.val(emptyVal);
                  $emptyInput.insertBefore(child.obj);
                }
              }

            } else if (false && child.obj.is('input[type=radio]')) {
              var $container = child.obj.closest('div.form-radios');

              if ($container) {
                if (!$container.find('input.field-group-conditional-empty-input').length && $container.find('input[type=radio]:selected')) {
                  var emptyVal = null;

                  if ($container.find('input[value="_none"]').length) emptyVal = '_none';
                  else if ($container.find('input[value="0"]').length) emptyVal = '0';

                  if (emptyVal !== null && emptyVal !== '') {
                    $emptyInput.val(emptyVal);
                    $emptyInput.prependTo($container);
                  }
                }
              } else {
//                console.log('CO list without container', child.obj.attr('name'), child.obj);
              }
            } else {
//              console.log('CO unknown input type', child.obj.attr('name'), child.obj);
            }

            child.obj.data('emptyInput.conditional', 1);
          }
        });
        $.each(changeQueue, function(cid, $changeEmt) {
          $changeEmt.change();
        });
      }).change();
    });
  }
};
})(jQuery);


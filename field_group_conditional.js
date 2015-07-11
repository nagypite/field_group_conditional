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
        console.log('parentEmt error', $parentEmt, parentSelector);
        return;
      }

      for (childSelector in children) {
        var $child = $this.find(childSelector);
        if (!$child.length) continue;

        childMap.push({obj:$child, ifyes:children[childSelector]});
      }

      $parentEmt.change(function(){
        var parentVal = $parentEmt.not(':disabled').filter(':checked').val(), disabled, changeQueue = [];

//        console.log('parentChange', $parentEmt, parentVal);
        $.each(childMap, function(cid, child) {
          disabled = parentVal === undefined || child.ifyes ? parentVal !== '1' : parentVal !== '0'; // TODO disable when undefined
          child.obj.attr('disabled', disabled);
//          console.log('childToggle', child.obj.attr('name'), disabled, $parentEmt.attr('name'));
          if (disabled) changeQueue.push(child.obj.first());
          else changeQueue.push(child.obj.filter(':checked').first());
        });
        $.each(changeQueue, function(cid, $changeEmt) {
          $changeEmt.change();
        });
      }).change();
    });
  }
};
})(jQuery);


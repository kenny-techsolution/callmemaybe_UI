'use strict';
app.directive('sortableList',function(){
  return {
    link:function(scope,el,attrs){
      el.sortable({
        revert: true,
        placeholder: 'drag-placeholder',
        cancel: '.not-draggable',
        update: scope.onSortUpdate
      });
      el.disableSelection();

      el.on( "sortdeactivate", function( event, ui ) {
        var from = angular.element(ui.item).scope().$index;
        var to = el.children().index(ui.item);
        if(to>=0){
          scope.$apply(function(){
            if(from>=0){
              scope.$emit('list-sorted', {from:from,to:to});
            }else{
              scope.$emit('list-item-created', {to:to, name:ui.item.text()});
              ui.item.remove();
            }
          })
        }
      });
    }
  }
});
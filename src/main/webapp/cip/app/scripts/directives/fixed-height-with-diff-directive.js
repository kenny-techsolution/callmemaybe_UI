app.directive('fixedHeightWithDiff', function(){
   return {
       restrict: 'A',
       scope: {
           heightDiff: '=fixedHeightWithDiff'
       },
       link: function(scope, el){
           var parent = el.parent();

           var heightDiff = parseInt(scope.heightDiff);
           var parentHeight = parent.height();
           el.height(parentHeight - heightDiff);

            parent.on('resize', function(){
                el.height(parentHeight - heightDiff);
                console.log(parent.height());
            });
       }
   }
});
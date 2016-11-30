var myApp = angular.module('myAppDirectives',[]);
myApp.directive('compile', ['$compile', function ($compile) {

				return function(scope, element, attrs) {

				var ensureCompileRunsOnce = scope.$watch(

						function(scope) {

						return scope.$eval(attrs.compile);

						},

						function(value) {

						console.log(value);

						element.html(value);

						$compile(element.contents())(scope);

						}

				);

				};

}]);
myApp.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});
myApp.directive('sidebarDir', function(){
    return {
        restrict: 'AEC',
        link: function(scope, element, attrs){
            $("#accordion").click(function(){
            	// check if any open
            	var open = false;
            	alert("hey");
            	$(".card").find("a").each(function(){
            		var elem = $(this);
            		alert($(this).value);
            		if(!$(elem).hasClass("collapsed"))
            		{
            			open = true;
            			break;
            		}
            	});
            	if(open)
                	$(".footer").addClass("toBottom");
                else
                	$(".footer").removeClass("toBottom");
            });
        }
    };
});

myApp.directive('glAnim', function() {
       console.log("glAnim");
        return{
        scope:{},
        restrict: 'AEC',
        replace:'true',
        link: function(scope,elem,attrs){
  $(".card a").click(function(){
  				var open = false;
            	if($(this).hasClass("collapsed"))
                		{
                			$(".footer").addClass("toBottom");
                			open = true;
                			$(this).removeClass("collapsed");
            			}
            	else
            	{
                			$(this).addClass("collapsed");
            	}
          	$(".card a").each(function(){
				  		if(!$(this).hasClass("collapsed"))// anything is open
				  		{
				  			open = true;
				  			
				  		}

				  });
          	if(!open)
  				$(".footer").removeClass("toBottom");
  
            	});        

}
};
});

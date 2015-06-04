angular.module("myDirectives",[])
	.directive("imageMove", function($window){
		return {
			link: function(scope, element, attrs){

				//needed this because it keeps on calling keypress for every new scope created here and help do necessary clean ups to avoid memory leaks
				scope.$on("$destroy", function(){
					angular.element($window).unbind("keypress");
					angular.element(document.querySelector("#leftArrow")).unbind("click");
					angular.element(document.querySelector("#rightArrow")).unbind("click");
				});

				//controls the left arrow
				angular.element(document.querySelector("#leftArrow")).bind("click", function(e){
					scope.$apply(scope.leftArrow());
				});

				//controls the right arrow
				angular.element(document.querySelector("#rightArrow")).bind("click", function(e){
					scope.$apply(scope.rightArrow());
				})


				//global keypress for arrow 
				angular.element($window).bind("keypress", function(e){
					if(e.which == 44){
					
						scope.$apply(scope.leftArrow());
					}
					else if(e.which == 46){
						
						scope.$apply(scope.rightArrow());
					}
				})

			},
			restrict: "A"
		}
		
	})	
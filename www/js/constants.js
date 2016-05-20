
angular.module('starter.constants',[])
			 .constant('StarterConstants', StarterConstants);

		function StarterConstants () {
				var cons = {
					ref : 'https://imoneybanko.firebaseio.com'
				};
				
				return cons;
		}

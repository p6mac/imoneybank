(function(){

	angular.module('starter.services', [])
				 .service('AuthService', AuthService)
				 .service('UtilityService', UtilityService)
				 .service('TransactionService', TransactionService)


	function AuthService () {
		 var auth_service = {
					account : account,
					changePassword : changePassword
		 }

		 return auth_service;

		 function account(account) {
				return {
					email : account.email,
					password : account.password
				}
			}
			function changePassword(account) {
				return {
					email : account.email,
					oldPassword : account.oldpassword,
					newPassword : account.newpassword
				}
			}
	}

	UtilityService.$inject = ['$ionicPopup', '$ionicLoading'];

	function UtilityService ($ionicPopup, $ionicLoading) {
			var utility_service = {
					transformDate : transformDate,
					notification : notification,
					startLoading : startLoading,
					endLoading : endLoading
			}

			return utility_service;

			function transformDate(date) {
					var monthNames = ['January', 'February', 'March' , 'April',
					 									'May', 'June', 'July', 'August' ,
														'September', 'October', 'November', 'December'];
					var inputDate = new Date(date),
							day = inputDate.getDate(),
							monthIndex = inputDate.getMonth(),
							year = inputDate.getFullYear(),
							hours = inputDate.getHours(),
							minutes = inputDate.getMinutes(),
							seconds = inputDate.getSeconds();

					return (hours + ':' + minutes + ' -- ' + monthNames[monthIndex] + ' ' + day + ', ' + year );
			}

			function notification (title, content) {
				return $ionicPopup.alert({
						title : title,
						template : content
				});
			}

			function startLoading () {
				return $ionicLoading.show({ template : '<ion-spinner icon="ios"></ion-spinner>'});
			}

			function endLoading () {
				return $ionicLoading.hide()
			}
	}

	TransactionService.$inject = ['UtilityService'];

	function TransactionService (UtilityService) {
			var transaction_service = {
				transaction : transaction,
				logs : logs
			}

			return transaction_service;

			function transaction(amount, current_balance, transaction_name){
				var computeBalance;

				if (transaction_name === 'Deposit' || transaction_name === 'deposit') {
					computeBalance = current_balance + amount;
				} else {
					computeBalance = current_balance - amount;
				}

				return {
					amount :  amount,
					transaction_date : UtilityService.transformDate(Date.now()),
					transaction_name : transaction_name,
					current_balance : computeBalance,
				}
			}

			function logs(transact, amount, current_balance){
				return {
					transaction :  transact,
					transaction_date : UtilityService.transformDate(Date.now()),
					transaction_amount : amount,
					current_balance : current_balance
				}
			}
	}

})();


angular.module('starter.controllers', [])
      .controller('AuthController', AuthController)
      .controller('TransactionController', TransactionController)
      .controller('AccountController', AccountController)

  function AuthController($scope, $state, UtilityService, AuthService) {
      var auth = new Firebase('https://imoneybanko.firebaseio.com/');
      var vm = this;

      vm.account = {}
      vm.newaccount = {};
      vm.sessionOnly = {
          remember : 'sessionOnly'
      }
      vm.login = login;
      vm.register = register;
      vm.logout = logout;
      vm.goRegister = goRegister;
      vm.backLogin = backLogin;

      function login() {
          auth.authWithPassword(AuthService.account(vm.account),
              checkErrorAuthentication,
              vm.sessionOnly
              )
      }

      function checkErrorAuthentication (error, authData) {
          if (error) {
            UtilityService.notification('Wrong Credentials', 'Please Try Again');
          } else {
            $state.go('app.balances');
          }
      }

      function register () {
        if (vm.newaccount.password === vm.newaccount.confirmpassword) {
            auth.createUser(
              AuthService.account(vm.newaccount),
              checkRegistration);
        } else {
          UtilityService.notification('Error', 'Password does not match.');
        }
      }

      function checkRegistration (error, userData) {
          if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                UtilityService.notification('Error', 'Email is already in use.');
                break;
              case "INVALID_EMAIL":
                UtilityService.notification('Error', 'Invalid Email')
                break;
              default:
                UtilityService.notification('Opps!', 'Error creating user');
            }
          } else {
            UtilityService.notification('Yehey!', 'Successfully Created')
            auth.child('users')
                .child(userData.uid)
                .child('account_info')
                .update({ username : vm.newaccount.email,
                          full_name : vm.newaccount.full_name });
            $state.go('login');
          }

      }

      function logout () {
        auth.unauth();
        $state.go('login');
      }

      function goRegister () {
        $state.go('register');
      }

      function backLogin () {
        $state.go('login');
      }
  }

  // Transaction Controller
  function TransactionController ($scope, $state, $timeout, $firebaseArray, TransactionService, UtilityService) {
      var url = 'https://imoneybanko.firebaseio.com/';
      var ref = new Firebase(url);
      var userRef, userTransaction, userTransactionHistory;
      var vm = this;

      vm.deposit_amount = null;
      vm.withdraw_amount = null;
      vm.ideposit = ideposit;
      vm.iwithdraw = iwithdraw;


      UtilityService.startLoading();

      ref.onAuth(checkAuth);

      $timeout(function() {
          vm.currentBalance = getCurrentBalance();
          vm.transaction_history = getTransactionHistory();
          UtilityService.endLoading();
      }, 1500);

      function checkAuth (authData) {
          if (!authData) {
          $state.go('login')
        } else {
          userRef = new Firebase(url+'/users/'+authData.uid);
          userTransaction = $firebaseArray(userRef.child('transaction'));
          userTransactionHistory = $firebaseArray(userRef.child('transaction_history'));
        }
      }

      function ideposit () {
        UtilityService.startLoading();
        if (vm.deposit_amount === null) {
            UtilityService.notification('Error', 'Invalid Input');
            UtilityService.endLoading();
        } else {
          userTransaction.$add(TransactionService.transaction(vm.deposit_amount, getCurrentBalance(), 'Deposit'));
          userTransactionHistory.$add(TransactionService.logs('Deposit', vm.deposit_amount, getCurrentBalance()));
          UtilityService.endLoading().then(UtilityService.notification('Success', 'Please Come Again'));
          vm.currentBalance = getCurrentBalance();
          vm.transaction_history = getTransactionHistory();
        }
      }
      function iwithdraw () {
        UtilityService.startLoading();
        if ($scope.withdraw_amount === null) {
            UtilityService.notification('Error', 'Invalid Input');
            UtilityService.endLoading();
        } else {
          userTransaction.$add(TransactionService.transaction(vm.withdraw_amount,getCurrentBalance(), 'Withdraw'))
          userTransactionHistory.$add(TransactionService.logs('Withdraw', vm.withdraw_amount, getCurrentBalance()));
          UtilityService.endLoading().then(UtilityService.notification('Success', 'Please come Again'));
          vm.currentBalance = getCurrentBalance();
          vm.transaction_history = getTransactionHistory();
        }
      }

      function getCurrentBalance() {
          if (_.isEmpty(userTransaction)) {
              return 0;
          } else {
              return userTransaction[userTransaction.length - 1 ].current_balance;
          }
        }

      function getTransactionHistory() {
        return userTransactionHistory;
      }

  }


  //Account Controller
  function AccountController ($scope, $state,$timeout, UtilityService) {
     var ref =  new Firebase('https://imoneybanko.firebaseio.com');
     var userRef;
     var vm = this;

     vm.account = {};
     vm.changePassword = changePassword;
     vm.getEmail = ref.getAuth().password.email;

     UtilityService.startLoading();
     ref.onAuth(checkAuth);

     $timeout(function() {
         UtilityService.endLoading();
     }, 1500);

     function checkAuth (authData){
       if (!authData) {
         $state.go('login');
       } else {
         userRef = new Firebase('https://imoneybanko.firebaseio.com/users/'+authData.uid)
       }
     }

     function changePassword(){
        if (vm.password.newpassword == vm.password.confirmnewpassword) {
            UtilityService.startLoading();
            ref.changePassword(
              AuthService.changePassword(vm.account),
              checkChangingPassword);
        } else {
            UtilityService.endLoading()
              .then(UtilityService.notification('Error','Password does not match.'));
        }
      }

      function checkChangingPassword (error) {
        if (error) {
          UtilityService.endLoading()
            .then(UtilityService.notification('Error', 'Invalid Password'));
        } else {
          UtilityService.endLoading()
            .then(UtilityService.notification('Success','Password successfully changed.'));
        }
      }
  }

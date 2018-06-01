(function () {
    'use strict';

    angular
        .module('app')
        .controller('DealFormController', Controller);


    function Controller($scope, $rootScope, $state, $stateParams, $filter, ModulesService, DealsService) {
        $scope.dealForm = getInitialDealForm();
        var tempDealForm = getInitialDealForm();
        var DATE_FORMAT = 'MM/dd/yyyy';

        //from jano's code (multiple getModuleByName)
        $scope.profileFields = [];
        $scope.processFields = [];
        $scope.distributionFields = [];
        $scope.statusFields = [];
        $scope.contentFields = [];

        function getAllFields() {
            ModulesService.getModuleByName('dealessential').then(function (response) {
                $scope.essentialFields = response.fields;
                $scope.essentialFieldsId = response._id;
                /* for (var i = 0; i < $scope.essentialFields.length; i++) {
                    $scope.dealForm.essential[$scope.essentialFields[i].name] = ($scope.essentialFields[i].type !== 'number') ? '' : 0;
                } */
            }).catch(function (err) {
                alert(err.msg_error);
            });
            ModulesService.getModuleByName('dealprofile').then(function (response) {
                $scope.profileFields = response.fields;
                $scope.profileFieldsId = response._id;
                /* for (var i = 0; i < $scope.profileFields.length; i++) {
                    $scope.dealForm.profile[$scope.profileFields[i].name] = ($scope.profileFields[i].type !== 'number') ? '' : 0;
                } */
            }).catch(function (err) {
                alert(err.msg_error);
            });
            ModulesService.getModuleByName('dealprocess').then(function (response) {
                $scope.processFields = response.fields;
                $scope.processFieldsId = response._id;
                /* for (var i = 0; i < $scope.processFields.length; i++) {
                    $scope.dealForm.process[$scope.processFields[i].name] = ($scope.processFields[i].type !== 'number') ? '' : 0;
                } */
            }).catch(function (err) {
                alert(err.msg_error);
            });
            ModulesService.getModuleByName('dealdistribution').then(function (response) {
                $scope.distributionFields = response.fields;
                $scope.distributionFieldsId = response._id;
                /* for (var i = 0; i < $scope.distributionFields.length; i++) {
                    $scope.dealForm.distribution[$scope.distributionFields[i].name] = ($scope.distributionFields[i].type !== 'number') ? '' : 0;
                } */
            }).catch(function (err) {
                alert(err.msg_error);
            });
            ModulesService.getModuleByName('dealstatus').then(function (response) {
                $scope.statusFields = response.fields;
                $scope.statusFieldsId = response._id;
                /* for (var i = 0; i < $scope.statusFields.length; i++) {
                    $scope.dealForm.status[$scope.statusFields[i].name] = ($scope.statusFields[i].type !== 'number') ? '' : 0;
                } */
            }).catch(function (err) {
                alert(err.msg_error);
            });
            ModulesService.getModuleByName('dealcontent').then(function (response) {
                $scope.contentFields = response.fields;
                $scope.contentFieldsId = response._id;

            }).catch(function (err) {
                alert(err.msg_error);
            });
        }

        getAllFields();
        
        //if there is a parameter, it means that a deal is going to be updated
        if ($stateParams.ID !== '') {
            //get one then store to $scope.dealForm;
            DealsService.getDealById($stateParams.ID).then(function(aDeal) {
                $scope.dealForm = aDeal;

                //explicitly convert dates of Due Date, Duration (Start) & Duration (End) to date objects
                $scope.dealForm.essential['Due Date'] = new Date($scope.dealForm.essential['Due Date']);
                $scope.dealForm.profile['Duration (Start)'] = new Date($scope.dealForm.profile['Duration (Start)']);
                $scope.dealForm.profile['Duration (End)'] = new Date($scope.dealForm.profile['Duration (End)']);

             }).catch(function() {
                $scope.message = 'Cannot find the deal';
            });
        }

        $scope.submit = function () {
            //use Object.assign(target, source) instead
            Object.assign(tempDealForm, $scope.dealForm);
   
            //explicitly convert dates of Due Date, Duration (Start) & Duration (End) to datestring of prescribed format
            tempDealForm.essential['Due Date'] = $filter('date')(tempDealForm.essential['Due Date'], DATE_FORMAT);
            tempDealForm.profile['Duration (Start)'] = $filter('date')(tempDealForm.profile['Duration (Start)'], DATE_FORMAT);
            tempDealForm.profile['Duration (End)'] = $filter('date')(tempDealForm.profile['Duration (End)'], DATE_FORMAT);

            console.log(tempDealForm);

            tryFunction();

            if (tempDealForm._id === undefined) {
                DealsService.addDeal(tempDealForm)
                .then(function() {
                    $state.transitionTo('dealList');
                })
                .catch(function(err) {
    
                });
            } else {
                DealsService.updateDeal(tempDealForm)
                .then(function() {
                    $state.transitionTo('dealList');
                })
                .catch(function() {
    
                });
            }            
        }

        tryFunction();

        function tryFunction() {
            var object = {
                "ID":"D8ELQ", 
                "ProjectName":"Dev B",
                "Client":"TI",
            };
            
            /*var ID = "DL-0000";
            var a = 56;

            if(a<=9){
                console.log(ID.slice(0,6)+a);
            }else if(a>9||a<=99){
                console.log(ID.slice(0,5)+a);
            }*/
            var a = "0003";
            a++;
            console.log(a);

            /*DealsService.addDeal(object)
                .then(function() {
                    //$state.transitionTo('dealList');
                })
                .catch(function(err) {
    
                });*/
        }

        //do not initialize dates to the current date since it is not required
        function getInitialDealForm() {
            return {
                essential: {

                },
                profile: {

                },
                process: {

                },
                distribution: {
                    fiscalYear: [new Date().getFullYear(), new Date().getFullYear() + 1],
                    total: {
                        resource: 0,
                        revenue: 0,
                        cm: 0,
                        percentage: 0
                    },
                    average: 0,
                    cm: {},
                    res: {
                        jp: {},
                        gd: {}
                    },
                    rev: {
                        jp: {},
                        gd: {}
                    }
                },
                status: {

                },
                content: {
                    'Main Message': ''
                }
            };
        }

        function tryFunction () {
            console.log('hmmm');
            angular.forEach(tempDealForm, function(fields, category){
                if (category === 'essential' 
                || category === 'profile' 
                || category === 'process' 
                || category === 'distribution' 
                || category === 'status' 
                || category === 'content') {
                    console.log(tempDealForm[category]);

                    angular.forEach(category, function(value, key){
                        if (tempDealForm[category][key] instanceof Date) {
                            console.log('it is a date', tempDealForm[category][key]);
                        }
                    });
                }
            });
        }

        $scope.currentFiscalYear = [];
        $scope.startingMonthYear = new Date();

        $scope.getCurrentFiscalYear = function () {
            $scope.currentFiscalYear = [];
            var setMonth = $scope.startingMonthYear.getMonth() + 1; 
            var setYear = $scope.startingMonthYear.getFullYear();
            var temp = '';
            var i;
            /* for(i = 1; i <= 12; i++) {
                //next year
                if (i < setMonth) {
                    temp = (i < 10) ? ('0' + i + '/' + (setYear + 1)) : (i + '/' + (setYear + 1));
                    $scope.currentFiscalYear.push(temp);
                } else {
                    temp = (i < 10) ? ('0' + i + '/' + setYear) : (i + '/' + setYear);
                    $scope.currentFiscalYear.push(temp);
                }
            } */
            i = setMonth;
            do {
                //next year
                if (i < setMonth) {
                    temp = (i < 10) ? ('0' + i + '/' + (setYear + 1)) : (i + '/' + (setYear + 1));
                //current year
                } else {
                    temp = (i < 10) ? ('0' + i + '/' + setYear) : (i + '/' + setYear);
                }

                $scope.currentFiscalYear.push(temp);

                i = (i % 12 === 0) ? 1 : (i + 1);
            } while (i != setMonth);

            console.log($scope.currentFiscalYear);
        }

        $scope.getCurrentFiscalYear();









    }
})();
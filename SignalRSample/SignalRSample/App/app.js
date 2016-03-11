angular.module('recordManagerModule', ["rx"])
    .controller("recordFormController", function ($scope, persistantConnectionService) {
        
        $scope.add = function () {
            var node;

            if ($scope.node1 && $scope.node2) {
                node = "all_nodes";
            }
            else if ($scope.node1) {
                node = "node1"
            } else if($scope.node2){
                node = "node2"
            }           
                
            if (node) {
                persistantConnectionService.createNewRecord({
                    message: $scope.message,
                    node: node
                });
            } else {
                alert("select a node");
            }
        };
        
    })
    .controller("node1Controller", function ($scope, persistantConnectionService) {
        $scope.messages = [];
        persistantConnectionService.addRecordHandler("node1", function (data) {
            console.log("message in node1:");
            console.log(data);
            $scope.$apply(function () {
                $scope.messages.push(data);
            });
            
        });
    })
    .controller("node2Controller", function ($scope, persistantConnectionService) {
        $scope.messages = [];
        persistantConnectionService.addRecordHandler("node2", function (data) {
            console.log("message in node2:");
            console.log(data);
            $scope.$apply(function () {
                $scope.messages.push(data);
            });

        });
    })
    .factory('persistantConnectionService', function (observableHelperService) {
        var connection = $.hubConnection();
        var hub = connection.createHubProxy("recordHub");
        //connection.start();
        connection.start().done(function () {
            //hub.on("onAddRecord", function (record) {
            //    console.log(record);
            //    observableHelperService.publishMessage(record);
            //});
        });
        var isNotRegistered = true;
        
        return {
            addRecordHandler: function (nodeName, callback) {
                if (isNotRegistered) {
                    isNotRegistered = false;
                    hub.on("onAddRecord", function (record) {
                        observableHelperService.publishMessage(record);
                    });
                }
                observableHelperService.attachHandler(nodeName, callback);
            },
            createNewRecord: function (data) {
                hub.invoke('addRecord', data);
            }
        }
    })
    .factory('observableHelperService', function (rx) {
        var observerRef;
        var observable = rx.Observable.create(function (observerp) {
            observerRef = observerp;
        });

        var connObservable = observable.publish();
        connObservable.connect();

        function attachHandler(nodeName, handler) {
            //console.log("new node attached " + nodeName)
            console.log("Listening to messages from node " + nodeName);
            connObservable
                .filter(function (item) {
                    return item.node == nodeName || item.node == "all_nodes";
                })
                .subscribe(handler, function (error) {
                    console.log("error " + error);
                });
        }

        function publishMessage(message) {
            observerRef.onNext(message);
        }

        return {
            attachHandler: attachHandler,
            publishMessage: publishMessage
        };
    });
;
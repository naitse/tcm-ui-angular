function GeneratorCtrl($scope, $http, Auth) {

    $scope.packagesUrl = "//s3.amazonaws.com/ch-automation-files/ch-automation-ui";

    function getFile(req, callback){
        var oReq = new XMLHttpRequest();
        oReq.onload = callback;
        oReq.open("get", req, true);
        oReq.send();
    }

    $scope.$watch("packagesUrl", function(val){

        getFile(val, function(){
            var that = this;
             $scope.$apply(function(){
                $scope.testngPackages = JSON.parse(that.responseText)
             })
        })


        // $http.get(val).success(function(data){
        //     $scope.testngPackages = data;
        // }).error(function(err){
        //         console.log(err);
        // });
    });

    $scope.addRemoveTest = function(_class, test){
        if(test.added != null && test.added){
          $scope.parser.suite.removeTestFromClass(_class, test);
        }else{
          $scope.parser.suite.addTestToClass(_class, test);
        }

        test.added=!test.added;
        $scope.xmlPreview = $scope.parser.getString();
    };

    $scope.uploadToS3 = function(){
        $("#modal-progress").modal('show');
        $scope.fileUploaded = false;
        $scope.jobExecuted = false;
        $scope.showLink = false;

        $http.post( basePath + 'api/uploadToS3', {rawBody:$scope.xmlPreview}).success(function(){
            $scope.fileUploaded = true;
            $http.get(basePath + 'api/execute').success(function(data){
                $scope.jobExecuted = true;
                $scope.showLink = true;
                $scope.logsLink = data.url + data.nextBuildNumber;
            });
        });
    }


    $scope.parser = {
        suite: {
            classes: [],

            addClass: function(_class){

                var c = _.find(this.classes, function(val){
                    return val.name == _class.name
                })

                if(c != null){
                    return c;
                }

                this.classes.push({
                    'name': _class.name,
                    tests: []
                })

                return this.classes[this.classes.length -1];

            },
            addTestToClass: function(_class, test){
                this.addClass(_class).tests.push(test);
            },
            removeTestFromClass: function(_class, test){
                var c = _.find(this.classes, function(val){
                    return val.name === _class.name;
                })

                c.tests = _.reject(c.tests, function(val){
                    return val.name === test.name;
                })

                if(c.tests.length ==0){
                   this.classes = _.reject(this.classes, function(val){
                       return val.name === _class.name;
                   })
                }
            }
        },

        getString: function(){
            var stringToReturn = "<!DOCTYPE suite SYSTEM \"http://testng.org/testng-1.0.dtd\" >\n";
            stringToReturn += "<suite name=\"Custom Suite\" verbose=\"1\" >\n";
            stringToReturn += "\t<test name=\"Custom Test\">\n";
            stringToReturn += "\t\t<classes>\n";
            _.each(this.suite.classes, function(c){
                stringToReturn += "\t\t\t<class name=\"{{className}}\" >\n".replace("{{className}}", c.name);
                stringToReturn += "\t\t\t\t<methods>\n";

                _.each(c.tests, function(t){

                    stringToReturn += "\t\t\t\t\t<include name=\"{{testMethod}}\" />\n".replace("{{testMethod}}", t.name);
                });

                stringToReturn += "\t\t\t\t</methods>\n";
                stringToReturn += "\t\t\t</class>\n";
            });

            stringToReturn += "\t\t</classes>\n";
            stringToReturn += "\t</test>\n";
            stringToReturn += "</suite>\n";

            return stringToReturn;
        }
    }

    $scope.xmlPreview = $scope.parser.getString();
}

GeneratorCtrl.$inject = [ '$scope','$http', 'Auth'];


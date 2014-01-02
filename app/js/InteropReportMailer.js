function InteropReportMailer( $scope, $routeParams, tcm_model) {

    $scope.loading = false;
    $scope.emails = '';

    var rlsId = $routeParams.releaseId;

    $scope.getPreview = function(){
        $scope.loading = true;
        $scope.preview = tcm_model.trustUrl('api/mailer/build?rlsId=' + $routeParams.releaseId + '&_='+Math.floor(Math.random()*10000001))
        
        tcm_model.mailer.getTeams(rlsId, function(data){
            $scope.teams = data;
            $scope.loading = false;
        })

    }

    $scope.saveTeamData = function(team){
        tcm_model.mailer.saveData(team, function(data){
            $scope.getPreview();
        })
    }

    $scope.getEmails = function(){
        tcm_model.mailer.getEmails(function(data){
            $scope.emails = data[0].emails
        })
    }

    $scope.setEmails = function(){
        var req = {
            "emails": $scope.emails
        }
        req = JSON.stringify(req);

        tcm_model.mailer.setEmails(req, function(data){})
    }

    $scope.init =  function(){
        $scope.getEmails()
        $scope.getPreview();
    }

    $scope.sendMail = function(){

        var req = {
            "emails": $scope.emails
        }
        req = JSON.stringify(req);


        tcm_model.mailer.setEmails(req,function(){
            var emailsArray = $scope.emails.split(';');

            for(var i = 0; i < emailsArray.length; i++){
                emailsArray[i] = emailsArray[i].trim();
            }

            var req = {
                send: true,
                rlsId: rlsId,
                emails: emailsArray
            }
            $scope.loading = true;
            tcm_model.mailer.sendMail(req, function(){
                $scope.loading = false;
                alert('Mail sent')
            })


        })
    }

    $scope.init();

}

InteropReportMailer.$inject = [ '$scope', '$routeParams', 'tcm_model'];

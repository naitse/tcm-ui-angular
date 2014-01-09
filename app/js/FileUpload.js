tcmModule.factory('uuid', function() {
    var svc = {
        new: function() {
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        },

        empty: function() {
            return '00000000-0000-0000-0000-000000000000';
        }
    };

    return svc;
});

tcmModule.service('fileUploader', ['$rootScope', '$q', function($rootScope, $q) {
    var svc = {
        files: [],
        globalScopeFiles: [],
        uploadUrl: basePath + 'api/features/:featureId/testcases/:tcId/attachments',
        addFile: function(tcId, file){
            
            this.globalScopeFiles[tcId].push(file);

        },
        removeFile: function(file, tcId){

            this.globalScopeFiles[tcId] = _.without(this.globalScopeFiles[tcId], _.findWhere(this.globalScopeFiles[tcId],{name: file.name}))

        },
        cleanFiles: function(tcId){
            
            this.globalScopeFiles[tcId] = [];

        },
        upload: function(uploadTo, onProgress, onDone, onError) {
            var data = null;
            var uploadUrl = this.uploadUrl.replace(":featureId", uploadTo.featureId).replace(":tcId", uploadTo.tcId);
            var filesToUpload = null;
            var containerId = (typeof uploadTo.newTcPanelId != 'undefined')?uploadTo.newTcPanelId:uploadTo.tcId;

            filesToUpload = this.globalScopeFiles[containerId]; 

            if(filesToUpload == null || filesToUpload.length == 0) {return;}


            if (angular.version.major <= 1 && angular.version.minor < 2 ) {
                //older versions of angular's q-service don't have a notify callback
                //pass the onProgress callback into the service
                this
                    .post(filesToUpload, data, function(complete) { onProgress({percentDone: complete}); })
                    .to(uploadUrl)
                    .then(function(ret) {
                        onDone({files: ret.files, data: ret.data});
                    }, function(error) {
                        onError({files: this.files[0].files, type: 'UPLOAD_ERROR', msg: error});
                    })
            } else {
                this
                    .post(filesToUpload, data)
                    .to(uploadUrl)
                    .then(function(ret) {
                        onDone({files: ret.files, data: ret.data});
                    }, function(error) {
                        onError({files: error.files, type: 'UPLOAD_ERROR', msg: error});
                    },  function(progress) {
                        onProgress({percentDone: progress});
                    });
            }

            //this.resetFileInput();
        },



        resetFileInput: function() {
            var parent = fileInput.parent();

            fileInput.remove();
            var input = document.createElement("input");
            var attr = document.createAttribute("type");
            attr.nodeValue = "file";
            input.setAttributeNode(attr);

            var inputId = uuid.new();
            attr = document.createAttribute("id");
            attr.nodeValue = inputId;
            input.setAttributeNode(attr);

            attr = document.createAttribute("style");
            attr.nodeValue = "opacity: 0;display:inline;width:0";
            input.setAttributeNode(attr);



            if (scope.maxFiles > 1) {
                attr = document.createAttribute("multiple");
                attr.nodeValue = "multiple";
                input.setAttributeNode(attr);
            }

            fileLabel.after(input);
            fileLabel.attr("for", inputId);

            fileInput = angular.element(input);
        },

        post: function(files, data, progressCb) {

            return {
                to: function(uploadUrl)
                {
                    var deferred = $q.defer();

                    if (!files || !files.length) {
                        deferred.reject("No files to upload");
                        return;
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;
                    xhr.upload.onprogress = function(e) {
                        $rootScope.$apply (function() {
                            var percentCompleted;
                            if (e.lengthComputable) {
                                percentCompleted = Math.round(e.loaded / e.total * 100);
                                if (progressCb) {
                                    progressCb(percentCompleted);
                                } else if (deferred.notify) {
                                    deferred.notify(percentCompleted);
                                }
                            }
                        });
                    };

                    xhr.onload = function(e) {
                        $rootScope.$apply (function() {
                            var ret = {
                                files: files,
                                data: angular.fromJson(xhr.responseText)
                            };
                            deferred.resolve(ret);
                        })
                    };

                    xhr.upload.onerror = function(e) {
                        var msg = xhr.responseText ? xhr.responseText : "An unknown error occurred posting to '" + uploadUrl + "'";
                        $rootScope.$apply (function() {
                            deferred.reject(msg);
                        });
                    }

                    var formData = new FormData();

                    if (data) {
                        Object.keys(data).forEach(function(key) {
                            formData.append(key, data[key]);
                        });
                    }

                    for (var idx = 0; idx < files.length; idx++) {
                        formData.append(files[idx].name, files[idx]);
                    }

                    xhr.open("POST", uploadUrl);
                    xhr.send(formData);


                    return deferred.promise;
                }
            };
        }
    };

    return svc;
}]);

tcmModule.directive('lvlFileUpload', ['uuid', 'fileUploader', '$timeout', function(uuid, fileUploader, $timeout) {
    return {
        restrict: 'E',
        //replace: true,
        transclude: true,
        scope: {
            panelid: '@',
            chooseFileButtonText: '@',
            chooseFileButtonStyle: '@',
            uploadFileButtonText: '@',
            uploadFileButtonStyle: '@',
            uploadUrl: '@',
            maxFiles: '@',
            maxFileSizeMb: '@',
            autoUpload: '@',
            getAdditionalData: '&',
            onProgress: '&',
            onDone: '&',
            onError: '&',
            onFileAdded: '&'
        },
        template: '<div style="position:relative;">' +
            '<input type="file" style="opacity: 0; height: 33px; width: 84px;position: absolute;left: 15;top: 19; cursor:pointer"/>' +
            '<div class="{{ chooseFileButtonStyle }} up-button" ng-click="choose()">{{chooseFileButtonText}}</div>' +
            // '<button class="{{ uploadFileButtonStyle }}" ng-show="showUploadButton" ng-click="upload()">{{uploadFileButtonText}}</button>' +
            '</div>',
        compile: function compile(tElement, tAttrs, transclude) {
            var fileInput = angular.element(tElement.children()[0]);
            var fileLabel = angular.element(tElement.children()[1]);

            if(!tAttrs.chooseFileButtonStyle) {
                tAttrs.chooseFileButtonStyle = 'lvl-choose-button';
            }

            if(!tAttrs.uploadFileButtonStyle) {
                tAttrs.uploadFileButtonStyle = 'lvl-upload-button';
            }

            if (!tAttrs.maxFiles) {
                tAttrs.maxFiles = 1;
                fileInput.removeAttr("multiple")
            } else {
                fileInput.attr("multiple", "multiple");
            }

            if (!tAttrs.maxFileSizeMb) {
                tAttrs.maxFileSizeMb = 50;
            }

            var fileId = uuid.new();
            fileInput.attr("id", fileId);
            fileLabel.attr("for", fileId);


            return function postLink(scope, el, attrs, ctl, $timeout) {

                fileUploader.globalScopeFiles[scope.panelid] = []

                scope.showUploadButton = false;

                el.bind('change', function(e) {
                    if (!e.target.files.length) return;
                        
                    var tooBig = [];
                    if (e.target.files.length > scope.maxFiles) {
                        raiseError(e.target.files, 'TOO_MANY_FILES', "Cannot upload " + e.target.files.length + " files, maxium allowed is " + scope.maxFiles);
                        return;
                    }

                    for (var i = 0; i < scope.maxFiles; i++) {
                        if (i >= e.target.files.length) break;

                        var file = e.target.files[i];
                        fileUploader.addFile( scope.panelid, file);
                        scope.onFileAdded({file:file});

                        if (file.size > scope.maxFileSizeMb * 1048576) {
                            tooBig.push(file);
                        }
                    }

                    if (tooBig.length > 0) {
                        raiseError(tooBig, 'MAX_SIZE_EXCEEDED', "Files are larger than the specified max (" + scope.maxFileSizeMb + "MB)");
                        return;
                    }

                    if (scope.autoUpload && scope.autoUpload.toLowerCase() == 'true') {
                        scope.upload();
                    } else {
                        scope.$apply(function() {
                            scope.showUploadButton = true;
                        })
                    }

                });

            };

            function raiseError(files, type, msg) {
                scope.onError({files: files, type: type, msg: msg});
                //resetFileInput();
            }
        }
    }
}]);
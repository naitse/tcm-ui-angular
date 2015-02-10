tcmModule.service('Automation', ['$http', '$cookieStore' , function($http, $cookieStore){

    var automation = {
        "classes": [
            {
                "name": "com.mulesoft.rest.tests.Logs.Logs",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "setup"
                        ],
                        "name": "setup",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "verify next log after thread interruption",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity"
                        ],
                        "name": "verify logs",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Applications.Applications",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "setup"
                        ],
                        "name": "setUp",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get application info",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create no file UNDEPLOYED APP",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "0 downtime - redeploy",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Stop Application",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Set Application log level started application",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Update Application log level started application",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Delete Application log level started application",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Set Application log level undeployed application",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Update Application log level undeployed application",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Delete Application log level undeployed application",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.BolsaDeGatos.Headers",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Verifying custom headers",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Alerts.Alerts",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertDeploymentFailure",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertDeploymentSuccess",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertEventThreshold",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertAppNotification",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertAppSDGDown",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertAppSDGUp",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testAlertAppWorkerProblem",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "testAlertsPaging",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "testAlertsByApp",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Environments.NoAuthAccess",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Environments unauthorized user request",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.ObjectStore.ObjectStore",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "setup"
                        ],
                        "name": "setUp",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get OS summary",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "OS CRUD",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "OS Tenant CRUD",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Delete all objects",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity"
                        ],
                        "name": "Create 150 objects",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "Get object by Id",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "Filter OS - search param",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "Create 1024k object",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "AllKeys from within worker",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "CRUD from within worker",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Applications.ApplicationPromotion",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get applications for a sandbox response validator",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get sandbox application information",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get sandbox application information NO File",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Varify file hash",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Notifications.Notifications",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testCreateNotifiactionAndMarkItAsRead",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testNotificationFilters",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Alerts.NoAuthAccess",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create Alert unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Delete Alert unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get alerts unauthorized user",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.BolsaDeGatos.Batch",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Batch simple flow",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "setup"
                        ],
                        "name": "setUp",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Schedules.Schedules",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get Schedules",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Environments.Environments",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Environments response",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Single environment response",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create sandbox Environment",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Delete sandbox Environment",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create production Environment",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Delete production Environment",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Sandbox Environments limit ",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Production Environments limit ",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Able to delete sandbox ONLY if empty",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Duplicate Env name",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Tenants.Tenants",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testCreateTenant",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression"
                        ],
                        "name": "testTenantsSearchFilters",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.BolsaDeGatos.CloudhubSettingsAndGeneric",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Application Status for an App that does not exists",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Application name NO availability",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Application name availability",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create app with an invalid mule version",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create new valid App using existent App name",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity",
                            "broken"
                        ],
                        "name": "Wrapper Config validations",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Account.NoAuthAccess",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getAccount unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Update account unauthorized user",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Applications.NoAuthAccess",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Create app unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getAppStatus unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Update Application unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getSupportedMuleVersions unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getAppAvailability unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getAllApps unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getSingleApp unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "getAppInfo unauthorized user",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Account.Accounts",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Validates account info",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Update default environment",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.zNoSuitableForCI.MuleVersions",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "No response unauthorized user",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Validates muleVersions response",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Customer specific muleVersion",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Customer specific muleVersion - unlink version using null organization id",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Customer specific muleVersion - try link corrupted OrgId",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Customer specific muleVersion - try link empty OrgId",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.zNoSuitableForCI.VPC",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Link Org to VPC",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Get Org VPC",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Update Org VPC",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [],
                        "name": "unLink Org from VPC",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.zNoSuitableForCI.Openvpn",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity",
                            "broken"
                        ],
                        "name": "generate client config",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.zNoSuitableForCI.Invites",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity",
                            "broken"
                        ],
                        "name": "Create and revoke community false invites ",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity",
                            "broken"
                        ],
                        "name": "Create and revoke community true invites ",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Organizations.Organizations",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testOrganizationsUpdate",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "sanity",
                            "regression"
                        ],
                        "name": "testOrganizationsUpdateDefaultRegion",
                        "description": ""
                    }
                ]
            },
            {
                "name": "com.mulesoft.rest.tests.Insights.Insight",
                "tests": [
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "setup"
                        ],
                        "name": "setUp",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Verify REPLAY",
                        "description": ""
                    },
                    {
                        "enabled": true,
                        "priority": 0,
                        "groups": [
                            "regression",
                            "sanity"
                        ],
                        "name": "Verify METADATA",
                        "description": ""
                    }
                ]
            }
        ]
    }

    return {
        getSuiteTypes: function() {
            var suiteTypes = []
            var response = []
            _.each(automation.classes, function(clazz){
                _.each(clazz.tests, function(test){
                    if(test.groups){
                        _.each(test.groups, function(group){
                            suiteTypes.push(group);
                        })
                    }
                })
            });

            _.each(_.uniq(suiteTypes), function(suite){
                 response.push({name:suite, hide:false})
            })
           return response;
        },

        getSuiteTests: function(suiteName){

        }
    };
}]);
const value = {
    string: {
        version: "0.4.8",
        mapbox: {
            accessToken: "pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw",
            style: {
                default: "mapbox://styles/mapbox/streets-v11",
                dark: "mapbox://styles/mapbox/dark-v10",
            },
        },
        gapiOptions: {
            apiKey: "AIzaSyCqIaS8UizqjWrIKm5zV3_S8EffCWjKR-A",
            clientId: "361295761775-qshg0f5buh495dhubp4v5bignk7i5dh1.apps.googleusercontent.com",
            discoveryDocs: [
                "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
                "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
            ],
            scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
        },
        file: {
            name: "potori.json",
            type: "application/json",
        },
        path: {
            image: "https://lh3.googleusercontent.com/",
            bsWatermeter: "http://brainstorming.azurewebsites.net/watermeter.html#",
            intel: "https://www.ingress.com/intel",
            bsDatabase: "https://oprbrainstorming.firebaseio.com",
            bsReference: "c/reviews/",
            googleDrive: {
                folder: "appDataFolder",
                uploadParam: "?uploadType=multipart",
                createFile: "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
                updateFile: "https://www.googleapis.com/upload/drive/v3/files/",
            },
        },
        html: {
            icon: {
                appBar: {
                    status:     "equalizer",
                    openFile:   "folder_open",
                    saveFile:   "save",
                    uploadFile: "cloud_upload",
                    auth:       "account_circle",
                    signout:    "cancel",
                },
                accepted: "check",
                pending: "access_time",
                rejected: "close",
                
                undeclared: "close",
                duplicated: "filter_none",
                tooClose: "compare_arrows",
            },
            css: {
                accepted: " status-accepted",
                rejected: " status-rejected",
                pending:  " status-pending",
            }
        },
        mail: {
            query: {
                redacted: {
                    confirmation: "from:ingress-support@nianticlabs.com Portal submission confirmation -edit -photo",
                    acceptance: "from:ingress-support@nianticlabs.com Portal review complete now available -edit -photo",
                    rejection: "from:ingress-support@nianticlabs.com Portal review complete reviewed -edit -photo"
                },
                prime: {
                    confirmation: "from:nominations@portals.ingress.com (有機會加入 OR 数週間 OR (few weeks))",
                    acceptance: "from:nominations@portals.ingress.com Intel Map AP",
                    rejection: "from:nominations@portals.ingress.com (完畢: OR 審査の完了 OR (REVIEW COMPLETE)) -AP"
                },
            },
            keyword: {
                redacted: {
                    subject: ["Portal submission confirmation: ", "Portal review complete: "],
                    rejectedReason: {
                        duplicated: ["duplicate of either an existing Portal"],
                        tooClose: ["too close to an existing Portal"],
                    },
                },
                prime: {
                    subject: ["Portal submission confirmation: ", "Portal review complete: "],
                    rejectedReason: {
                        duplicated: [],
                        tooClose: ["能量塔過近"],
                    },
                },
            },
        },
        key: {
            scanner: { redacted: "redacted", prime: "prime", },
            type: {
                confirmation: { mail: "confirmation", ui: "recieved", },
                acceptance:   { mail: "acceptance"  , ui: "accepted", },
                rejection:    { mail: "rejection"   , ui: "rejected", },
            },
            status: {
                accepted: "accepted", rejected: "rejected", pending: "pending",
            },
            rejectedReason: {
                undeclared: "undeclared", duplicated: "duplicated", tooClose: "tooClose",
            }
        },
        alert: {
            openFileFailed: "Failed to open file.",
            openFileEmpty: "The file is empty.",
            openFileStructError: "The file structure is wrong.",
            saveFileNoPortal: "There is nothing to save.",
            uploaded: "Uploaded",
            uploadFailed: "Failed to upload.",
            invalidDateTime: "Invalid DateTime.",
            queryLngLatFailed: "Failed to query the location.",
        },
        title: {
            appBarButton: {
                status:     "Status & About",
                openFile:   "Open file",
                saveFile:   "Save file",
                uploadFile: "Upload file",
                auth:       "Sign in",
                signout:    "Sign out",
            },
            status: {
                accepted: "Accepted", rejected: "Rejected", pending: "Pending",
                undeclared: "Undeclared", duplicated: "Duplicated", tooClose: "Too Close",
            }
        }
    },
    code: {
        status: {
            pending:  0,
            accepted: 1,
            
            undeclared: 101,
            duplicated: 102,
            tooClose:   103,
        },
    },
    map: {
        statusCode: new Map([
            [0  , { type: "pending" , }],
            [1  , { type: "accepted", }],

            [101, { type: "rejected", rejectedReason: "undeclared", }],
            [102, { type: "rejected", rejectedReason: "duplicated", }],
            [103, { type: "rejected", rejectedReason: "tooClose"  , }],
        ]),
    },
};
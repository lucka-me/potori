const value = {
    string: {
        status: {
            authOrOpenFile: "Please authorize or open a file.",
            processing: "Processing mails...",
            loading: "Loading...",
            waiting: "Waiting...",
            queryingBs: "Querying database...",
            finished: "Process finished.",
        },
        mapbox: {
            accessToken: "pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw",
            style: "mapbox://styles/mapbox/streets-v11",
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
        path: {
            image: "https://lh3.googleusercontent.com/",
            bsWatermeter: "http://kitten-114.getforge.io/watermeter.html#",
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
        file: {
            name: "potori.json",
            type: "application/json",
        },
        alert: {
            openFileFailed: "Failed to open file.",
            openFileEmpty: "The file is empty.",
            openFileStructError: "The file structure is wrong.",
            saveFileNoPortal: "There is nothing to save.",
            uploaded: "Uploaded",
        },
        css: {
            collapse: {
                up: "cursor-pointer fas fa-angle-double-up fa-fw",
                down: "cursor-pointer fas fa-angle-double-down fa-fw",
            },
            statusIconSpan: {
                accepted: "fa-stack status-accepted",
                pending: "fa-stack status-pending",
            },
            statusIcon: {
                accepted: "fas fa-check fa-stack-1x fa-inverse",
                pending: "fas fa-ellipsis-h fa-stack-1x fa-inverse",
                rejectedReason: {
                    undeclared: "fas fa-times fa-stack-1x fa-inverse",
                    duplicated: "fas fa-clone fa-stack-1x fa-inverse",
                    tooClose: "fas fa-arrows-alt-h fa-stack-1x fa-inverse",
                },
            },
            resultIcon: {
                accepted: "fas fa-check fa-fw",
                rejected: "fas fa-times fa-fw",
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
                    rejection: "from:nominations@portals.ingress.com 完畢: -AP"
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
            scanner: {
                redacted: "redacted",
                prime: "prime",
            },
            type: {
                confirmation: {
                    mail: "confirmation",
                    ui: "recieved",
                },
                acceptance: {
                    mail: "acceptance",
                    ui: "accepted",
                },
                rejection: {
                    mail: "rejection",
                    ui: "rejected"
                },
            }
        },
        rejectedReason: {
            undeclared: "Undeclared",
            duplicated: "Duplicated",
            tooClose: "Too Close",
        },
    },
    code: {
        portalStatus: {
            pending: 0,
            accepted: 1,
            rejected: {
                undeclared: 101,
                duplicated: 102,
                tooClose: 103,
            },
        },
    },
};
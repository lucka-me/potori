const value = {
    string: {
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
        version: {
            full: "0.4.1 (Full)",
            lite: "0.4.1 (Lite)",
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
            uploadFailed: "Failed to upload.",
        },
        html: {
            icon: {
                accepted: "check",
                pending: "access_time",
                rejected: "close",
                rejectedReason: {
                    tooClose: "compare_arrows",
                    duplicated: "filter_none",
                    undeclared: "close",
                },
            },
            css: {
                accepted: " status-accepted",
                pending: " status-pending",
                rejected: " status-rejected",
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
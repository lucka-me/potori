const value = {
    string: {
        status: {
            authFirst: "Please authorize first.",
            processing: "Processing mails...",
            loading: "Loading...",
            waiting: "Waiting...",
            finished: "Process finished.",
        },
        mapbox: {
            accessToken: "pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw",
            style: "mapbox://styles/mapbox/streets-v11",
        },
        gapiOptions: {
            apiKey: "AIzaSyBTuRN1Vs4bV9A3oZA1ksZsdDpS5eiLB1M",
            clientId: "326067800963-49a04e410n6k156go9jk38916p1e5b7b.apps.googleusercontent.com",
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: "https://www.googleapis.com/auth/gmail.readonly"
        },
        path: {
            image: "https://lh3.googleusercontent.com/",
            bsWatermeter: "http://kitten-114.getforge.io/watermeter.html#",
            intel: "https://www.ingress.com/intel",
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
                    confirmation: "from:nominations@portals.ingress.com 有機會加入",
                    acceptance: "from:nominations@portals.ingress.com Intel Map AP",
                    rejection: "from:nominations@portals.ingress.com 完畢: -AP"
                },
            },
            keyword: {
                redacted: {
                    duplicated: "too close to an existing Portal",
                    tooClose: "duplicate of either an existing Portal",
                },
                prime: {
                    duplicated: [],
                    tooClose: ["能量塔過近"],
                },
            },
        },
        key: {
            redacted: "redacted",
            prime: "prime",
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
        },
        rejectedReason: {
            undeclared: "Undeclared",
            duplicated: "Duplicated",
            tooClose: "Too Close",
        }
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
const value = {
    string: {
        version: {
            code: '0.4.13',
            data: '1',
        },
        mapbox: {
            accessToken: 'pk.eyJ1IjoibHVja2EtbWUiLCJhIjoiY2p2NDk5NmRvMHFreTQzbzduemM1MHV4cCJ9.7XGmxnEJRoCDr-i5BBmBfw',
            style: {
                default: 'mapbox://styles/mapbox/streets-v11',
                dark:    'mapbox://styles/mapbox/dark-v10',
            },
        },
        gapiOptions: {
            apiKey: 'AIzaSyCqIaS8UizqjWrIKm5zV3_S8EffCWjKR-A',
            clientId: '361295761775-qshg0f5buh495dhubp4v5bignk7i5dh1.apps.googleusercontent.com',
            discoveryDocs: [
                'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
            ],
            scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
        },
        file: {
            name: 'potori.json',
            type: 'application/json',
        },
        path: {
            image: 'https://lh3.googleusercontent.com/',
            bsWatermeter: 'http://brainstorming.azurewebsites.net/watermeter.html#',
            intel: 'https://www.ingress.com/intel',
            bsDatabase: 'https://oprbrainstorming.firebaseio.com',
            bsReference: 'c/reviews/',
            googleDrive: {
                folder: 'appDataFolder',
                uploadParam: '?uploadType=multipart',
                createFile: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
                updateFile: 'https://www.googleapis.com/upload/drive/v3/files/',
            },
        },
        appBar: {
            status:     { title: 'Status & About', icon: 'equalizer'      },
            openFile:   { title: 'Open file'     , icon: 'folder_open'    },
            saveFile:   { title: 'Save file'     , icon: 'save'           },
            uploadFile: { title: 'Upload file'   , icon: 'cloud_upload'   },
            auth:       { title: 'Sign in'       , icon: 'account_circle' },
            signout:    { title: 'Sign out'      , icon: 'cancel'         },
        },
        key: {
            scanner: ['redacted', 'prime'],
            type:    ['accepted', 'rejected', 'pending'],
        },
        alert: {
            openFileFailed:      'Failed to open file.',
            openFileEmpty:       'The file is empty.',
            openFileStructError: 'The file structure is wrong.',
            saveFileNoPortal:    'There is nothing to save.',
            uploaded:            'Uploaded',
            uploadFailed:        'Failed to upload.',
            invalidDateTime:     'Invalid DateTime.',
            queryLngLatFailed:   'Failed to query the location.',
        },
    },
    data: {
        type: {
            pending: {
                code: 0,
                title: 'Pending',
                icon:  'access_time',
                query: {
                    redacted: 'from:ingress-support@nianticlabs.com Portal submission confirmation -edit -photo',
                    prime:    'from:nominations@portals.ingress.com subject:("能量塔提交確認" OR "Portal申請の受領確認" OR "Portal submission confirmation") -AP',
                },
            },
            accepted: {
                code: 1,
                title: 'Accepted',
                icon:  'check',
                query: {
                    redacted: 'from:ingress-support@nianticlabs.com Portal review complete now available -edit -photo',
                    prime:    'from:nominations@portals.ingress.com Intel Map AP',
                },
            },
            rejected: {
                code: 101,
                title: 'Rejected',
                icon:  'close',
                query: {
                    redacted: 'from:ingress-support@nianticlabs.com Portal review complete reviewed -edit -photo',
                    prime:    'from:nominations@portals.ingress.com subject:("能量塔審查完畢" OR "Portal審査の完了" OR "Portal review complete") -AP',
                },
            },
        },
        rejectedReason: {
            undeclared: {
                code: 101,
                title: 'Undeclared',
                icon:  'close',
                keyword: { redacted: [], prime: [], },
            },
            duplicated: {
                code: 102,
                title: 'Duplicated',
                icon:  'filter_none',
                keyword: {
                    redacted: ['duplicate of either an existing Portal'],
                    prime:    [],
                },
            },
            tooClose: {
                code: 103,
                title: 'Too Close',
                icon:  'compare_arrows',
                keyword: {
                    redacted: ['too close to an existing Portal'],
                    prime:    ['能量塔過近'],
                },
            },
        },
    },
};
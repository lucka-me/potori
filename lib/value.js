const value = {
    string: {
        github: {
            releaseUrl: 'https://api.github.com/repos/lucka-me/potori/releases/latest',
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
            portals: 'potori.json',
            bsData: 'bsdata.json',
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
            view:       { title: 'List'     , icon: 'view_list'      },
            signin:     { title: 'Sign In'  , icon: 'account_circle' },
            menu:       { title: 'Menu'     , icon: 'more_vert'      },
        },
        menu: {
            openFile:   { title: 'Open'     },
            saveFile:   { title: 'Save'     },
            uploadFile: { title: 'Upload'   },
            import:     { title: 'Import'   },
            about:      { title: 'About'    },
            signout:    { title: 'Sign Out' },
        },
        key: {
            scanner: ['redacted', 'prime'],
            type:    ['accepted', 'rejected', 'pending'],
        },
        chart: {
            color: {
                border: 'rgba(0, 0, 0, 0.2)',
                borderHover: 'rgba(0, 0, 0, 0.4)',
            },
        },
        bs: {
            rate: {
                quality: 'Quality',
                description: 'Description',
                cultural: 'Cultural',
                uniqueness: 'Uniqueness',
                safety: 'Safety',
                location: 'Location',
            },
        },
        alert: {
            openFileFailed:      'Failed to open file.',
            openFileEmpty:       'The file is empty.',
            openFileStructError: 'The file structure is wrong.',
            openFileParseError:  'Can not parse the file.',
            saveFileNoPortal:    'There is nothing to save.',
            uploaded:            'Uploaded',
            uploadFailed:        'Failed to upload.',
            invalidDateTime:     'Invalid DateTime.',
            queryLngLatFailed:   'Failed to query the location.',
            invalidData:         'Invalid data',
        },
    },
    data: {
        version: '1',
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
        reason: {
            undeclared: {
                code: 101,
                title: 'Undeclared',
                icon:  'close',
                color: '#B0373C',
                keyword: { redacted: [], prime: [], },
            },
            duplicated: {
                code: 102,
                title: 'Duplicated',
                icon:  'filter_none',
                color: '#5E90B8',
                keyword: {
                    redacted: ['duplicate of either an existing Portal'],
                    prime:    [],
                },
            },
            tooClose: {
                code: 103,
                title: 'Too Close',
                icon:  'compare_arrows',
                color: '#009345',
                keyword: {
                    redacted: ['too close to an existing Portal'],
                    prime:    ['能量塔過近'],
                },
            },
        },
    },
};
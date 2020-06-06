window.value = {
    data: {},
};
window.value.data = {
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
};
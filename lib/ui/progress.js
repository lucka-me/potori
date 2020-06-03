ui.progress = {
    ctrl: null,
    init(parent) {
        const element = eliKit.build('div', {
            className: 'mdc-linear-progress',
            hidden: true,
            children: [
                eliKit.build('div', { className: 'mdc-linear-progress__buffering-dots' }),
                eliKit.build('div', { className: 'mdc-linear-progress__buffer' }),
                eliKit.build('div', { className: 'mdc-linear-progress__bar mdc-linear' }),
                eliKit.build('div', {
                    className: [
                        'mdc-linear-progress__bar',
                        'mdc-linear-progress__primary-bar',
                        'mdc-linear-progress-bar-color--secondary'
                    ].join(' '),
                    children: [
                        eliKit.build('span', { className: 'mdc-linear-progress__bar-inner' }),
                    ],
                }),
                eliKit.build('div', {
                    className: 'mdc-linear-progress__bar mdc-linear-progress__secondary-bar',
                    children: [
                        eliKit.build('span', { className: 'mdc-linear-progress__bar-inner' }),
                    ],
                }),
            ],
        });
        parent.appendChild(element);
        this.ctrl = new mdc.linearProgress.MDCLinearProgress(element);
    },
};
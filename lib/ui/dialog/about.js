import { DialogPrototype } from './prototype.js';

class AboutDialog extends DialogPrototype {
    constructor() {
        super();
        this.textareaJSON = null;
    }

    init(parent) {
        const linkVersion = eliKit.link(
            'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
            'Changelog', ''
        );
        const info = [
            eliKit.build('span', {
                className: 'mdc-typography--body2',
                children: [
                    eliKit.link('./intro', 'Intro', 'Intro & Privacy')
                ],
            }),
            eliKit.build('span', {
                className: 'mdc-typography--body2',
                children: [
                    eliKit.link(
                        'https://github.com/lucka-me/potori',
                        'GitHub', 'GitHub Repo'
                    ),
                ],
            }),
            eliKit.build('span', {
                className: 'mdc-typography--body2',
                children: [
                    linkVersion,
                    eliKit.text(' by '),
                    eliKit.link('https://lucka.moe', 'Blog', 'Lucka'),
                ],
            }),
        ];
        const element = eliKit.dialog([
            eliKit.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: 'About'
            }),
            eliKit.build('div', {
                className: 'mdc-dialog__content flex-box-col',
                children: info,
            }),
            eliKit.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ eliKit.dialogAction('close', 'Close') ],
            }),
        ]);
        parent.appendChild(element);
        this.ctrl = new mdc.dialog.MDCDialog(element);

        fetch(value.string.github.releaseUrl)
            .then(response => response.json())
            .then(response => {
                linkVersion.innerHTML = `${response.name}d${value.data.version}-${versionKit.code}`;
            });
    }

    open() { this.ctrl.open(); }
};

export { AboutDialog };
import { DialogPrototype } from './prototypes.js';
import Eli from "../Eli.js";
import Version from '../../service/Version.js';

class AboutDialog extends DialogPrototype {
    constructor() {
        super();
        this.textareaJSON = null;
    }

    init(parent) {
        const linkVersion = Eli.link(
            'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
            'Changelog', Version.text
        );
        const info = [
            Eli.build('span', {
                className: 'mdc-typography--body2',
                children: [
                    Eli.link('./intro', 'Intro', 'Intro & Privacy')
                ],
            }),
            Eli.build('span', {
                className: 'mdc-typography--body2',
                children: [
                    Eli.link(
                        'https://github.com/lucka-me/potori',
                        'GitHub', 'GitHub Repo'
                    ),
                ],
            }),
            Eli.build('span', {
                className: 'mdc-typography--body2',
                children: [
                    linkVersion,
                    Eli.text(' by '),
                    Eli.link('https://lucka.moe', 'Blog', 'Lucka'),
                ],
            }),
        ];
        const element = Eli.dialog([
            Eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: 'About'
            }),
            Eli.build('div', {
                className: 'mdc-dialog__content flex-box-col',
                children: info,
            }),
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
                children: [ Eli.dialogAction('close', 'Close') ],
            }),
        ]);
        parent.appendChild(element);
        this.ctrl = new mdc.dialog.MDCDialog(element);
    }

    open() { this.ctrl.open(); }
};

export default AboutDialog;
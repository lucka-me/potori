import DialogPrototype, { Eli, dialog } from './DialogPrototype';
import Version from '../../service/Version';

class AboutDialog extends DialogPrototype {
    constructor() {
        super();
    }

    init(parent: HTMLElement) {
        const linkVersion = Eli.link(
            'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
            'Changelog', Version.text
        );
        const info = [
            Eli.build('span', {
                className: 'mdc-typography--body2',
            }, [
                Eli.link('./intro', 'Intro', 'Intro & Privacy')
            ]),
            Eli.build('span', {
                className: 'mdc-typography--body2',
            }, [
                Eli.link(
                    'https://github.com/lucka-me/potori',
                    'GitHub', 'GitHub Repo'
                ),
            ]),
            Eli.build('span', {
                className: 'mdc-typography--body2',
            }, [
                linkVersion,
                ' by ',
                Eli.link('https://lucka.moe', 'Blog', 'Lucka'),
            ]),
        ];
        const element = Eli.dialog([
            Eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: 'About'
            }),
            Eli.build('div', {
                className: 'mdc-dialog__content flex-box-col',
            }, info),
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [ Eli.dialogAction('close', 'Close') ]),
        ]);
        parent.appendChild(element);
        this.ctrl = new dialog.MDCDialog(element);
    }

    open() { this.ctrl.open(); }
};

export default AboutDialog;
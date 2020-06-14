import DialogPrototype, { Eli, dialog, i18next } from './DialogPrototype';
import Version from '../../service/Version';

class AboutDialog extends DialogPrototype {

    render() {
        const linkVersion = Eli.link(
            'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
            i18next.t('Changelog'), Version.text
        );
        const info = [
            Eli.build('span', {
                className: 'mdc-typography--body2',
            }, [
                Eli.link('./docs', i18next.t('Documents'), i18next.t('Documents'))
            ]),
            Eli.build('span', {
                className: 'mdc-typography--body2',
            }, [
                Eli.link(
                    'https://github.com/lucka-me/potori',
                    i18next.t('GitHub Repo'), i18next.t('GitHub Repo')
                ),
            ]),
            Eli.build('span', {
                className: 'mdc-typography--body2',
            }, [
                linkVersion,
                ' by ',
                Eli.link('https://lucka.moe', i18next.t('Blog'), 'Lucka'),
            ]),
        ];
        const element = Eli.dialog([
            Eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('About')
            }),
            Eli.build('div', {
                className: 'mdc-dialog__content flex-box-col',
            }, info),
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [ Eli.dialogAction('close', i18next.t('Close')) ]),
        ]);
        this.parent.appendChild(element);
        this.ctrl = new dialog.MDCDialog(element);
    }

    open() {
        if (!this.ctrl) this.render();
        this.ctrl.open();
    }
};

export default AboutDialog;
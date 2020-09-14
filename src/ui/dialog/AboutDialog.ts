import DialogPrototype, { Eli, MDCDialog, i18next } from './prototype';
import version from '../../service/version';

class AboutDialog extends DialogPrototype {

    render() {
        const element = DialogPrototype.buildDialog([
            Eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('About')
            }),
            Eli.build('div', {
                className: 'mdc-dialog__content flex-box-col',
            }, [
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
                    Eli.link(
                        'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
                        i18next.t('Changelog'), version.string
                    ),
                    ' by ',
                    Eli.link('https://lucka.moe', i18next.t('Blog'), 'Lucka'),
                ]),
            ]),
            Eli.build('footer', {
                className: 'mdc-dialog__actions',
            }, [ DialogPrototype.buildDialogAction('close', i18next.t('Close')) ]),
        ]);
        this.parent.append(element);
        this.ctrl = new MDCDialog(element);
    }

    open() {
        if (!this.ctrl) this.render();
        this.ctrl.open();
    }
};

export default AboutDialog;
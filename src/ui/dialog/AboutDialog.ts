import DialogPrototype, { MDCDialog, i18next } from './prototype';
import version from '../../service/version';

class AboutDialog extends DialogPrototype {

    render() {
        const element = DialogPrototype.buildDialog([
            eli.build('h2', {
                className: 'mdc-dialog__title',
                innerHTML: i18next.t('About')
            }),
            eli.build('div', {
                className: 'mdc-dialog__content flex-box-col',
            }, [
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    eli.link('./docs', i18next.t('Documents'), i18next.t('Documents'))
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    eli.link(
                        'https://github.com/lucka-me/potori',
                        i18next.t('GitHub Repo'), i18next.t('GitHub Repo')
                    ),
                ]),
                eli.build('span', {
                    className: 'mdc-typography--body2',
                }, [
                    eli.link(
                        'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md',
                        i18next.t('Changelog'), version.string
                    ),
                    ' by ',
                    eli.link('https://lucka.moe', i18next.t('Blog'), 'Lucka'),
                ]),
            ]),
            eli.build('footer', {
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
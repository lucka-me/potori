import { eli } from './eli';

const ClassName = {
    dialog: 'mdc-dialog',
    container: 'mdc-dialog__container',
    surface: 'mdc-dialog__surface',
    content: 'mdc-dialog__content',
    title: 'mdc-dialog__title',
    actions: 'mdc-dialog__actions',
    scrim: 'mdc-dialog__scrim',

    button: 'mdc-button mdc-dialog__button',
    buttonLabel: 'mdc-button__label',
};

interface DialigAction {
    action: string,
    text: string,
}

export function eliDialog(
    name: string, title: string, content: Array<HTMLElement>, actions: Array<DialigAction>
): HTMLDivElement {
    return eli('div', {
        className: `${ClassName.dialog} ${name}`,
        role: 'dialog',
        ariaModal: true,
    }, [
        eli('div', { className: ClassName.container }, [
            eli('div', { className: ClassName.surface }, [
                eli('h2', { className: ClassName.title, innerHTML: title }),
                eli('div', { className: ClassName.content }, content),
                eli('footer', { className: ClassName.actions }, actions.map((action) => {
                    return eli('button', {
                        className: ClassName.button,
                        dataset: { mdcDialogAction: action.action, },
                    }, [
                        eli('span', {
                            className: ClassName.buttonLabel, innerHTML: action.text
                        }),
                    ]);
                }))
            ]),
        ]),
        eli('div', { className: ClassName.scrim }),
    ]);
}

export namespace eliDialog {
    /**
     * Build a hyperlink elementpm
     * @param text Text to display in the link, will use `title` if not provided
     * @param href URL
     * @param title Text to show when mouse hovers
     */
    export function link(
        text: string,
        href: string,
        title?: string
    ): HTMLAnchorElement {
        return eli('a', {
            href: href,
            title: title || text,
            target: '_blank',
            rel: 'noopener',
            innerHTML: text,
        });
    }
}
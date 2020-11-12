import { eli } from './eli';

const ClassName = {
    linearProgress: 'mdc-linear-progress',
    buffer: 'mdc-linear-progress__buffer',
    bufferBar: 'mdc-linear-progress__buffer-bar',
    bufferDots: 'mdc-linear-progress__buffer-dots',
    primaryBar: 'mdc-linear-progress__bar mdc-linear-progress__primary-bar',
    secondaryBar: 'mdc-linear-progress__bar mdc-linear-progress__secondary-bar',
    inner: 'mdc-linear-progress__bar-inner',
};

export function eliLinearProgress() {
    return eli('div', {
        className: ClassName.linearProgress,
        role: 'progressbar',
        ariaValuemin: 0,
        ariaValuemax: 1,
        ariaValuenow: 0,
    }, [
        eli('div', { className: ClassName.buffer }, [
            eli('div', { className: ClassName.bufferBar }),
            eli('div', { className: ClassName.bufferDots }),
        ]),
        eli('div', {
            className: ClassName.primaryBar,
        }, [
            eli('span', { className: ClassName.inner }),
        ]),
        eli('div', {
            className: ClassName.secondaryBar,
        }, [
            eli('span', { className: ClassName.inner }),
        ]),
    ]);
}
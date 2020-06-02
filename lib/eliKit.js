const eliKit = {
    build: (tag, options) => {
        const element = document.createElement(tag);
        for (const key of Object.keys(options)) {
            switch (key) {
                case 'styleText':
                    element.style.cssText = options[key];
                    break;
                case 'children':
                    for (const child of options[key]) {
                        element.appendChild(child);
                    }
                    break;
                default:
                    element[key] = options[key];
                    break;
            }
        }
        return element;
    },
}
const eliKit = {
    build: (tag, options) => {
        const element = document.createElement(tag);
        if (options.className) element.className = options.className;
        if (options.styleText) element.style.cssText = options.styleText;
        if (options.id) element.id = options.id;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.children) {
            for (const child of options.children) {
                element.appendChild(child);
            }
        }
        return element;
    },
}
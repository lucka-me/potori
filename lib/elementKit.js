const elementKit = {
    build: (tag, options) => {
        const element = document.createElement(tag);
        if (options.class) element.className = options.class;
        if (options.style) element.style.cssText = options.style;
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
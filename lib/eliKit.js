const eliKit = {
    build: (tag, options) => {
        const element = document.createElement(tag);
        if (options.className) element.className = options.className;
        if (options.styleText) element.style.cssText = options.styleText;
        if (options.id) element.id = options.id;
        if (options.type) element.type = options.type;
        if (options.role) element.role = options.role;
        if (options.title) element.title = options.title;
        if (options.for) element.for = options.for;
        if (options.innerHTML) element.innerHTML = options.innerHTML;
        if (options.children) {
            for (const child of options.children) {
                element.appendChild(child);
            }
        }
        return element;
    },
}
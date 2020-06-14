// Inspired by https://github.com/elxris/Turnip-Calculator/blob/master/scripts/i18n.js
const fs = require('fs');

class LanguageData {
    code: string;
    files: Array<string>;

    constructor(code: string, files: Array<string>) {
        this.code = code;
        this.files = files;
    }

    moduleName(file: string) {
        return `${file.replace('.json', '')}${this.code.replace('-', '')}`
    }

    toImport() {
        return this.files.map((file) => {
            return `import ${this.moduleName(file)} from './${this.code}/${file}';`
        }).join('\n');
    }

    toExport() {
        return `
    '${this.code}': {
        ${
            this.files.map((file) => {
                return `${file.replace('.json', '')}: ${this.moduleName(file)},`
            }).join('\n        ')
        }
    },
        `
    }
}

const root = './src/locales'
const ignore = ['index.ts', '.DS_Store'];
const filter = (filename: string) => !ignore.includes(filename);
const languages: Array<LanguageData> =
    fs.readdirSync(root).filter(filter).reduce((list: Array<LanguageData>, folder: string) => {
        list.push(new LanguageData(folder, fs.readdirSync(`${root}/${folder}`).filter(filter)));
        return list;
    }, []);

const jsFile = `// This file is generated with scripts/build-locals.js
${languages.map((language) => language.toImport()).join('\n')}

export default {
${languages.map((language) => language.toExport()).join('')}
};`;

fs.writeFileSync(require('path').join(process.cwd(), `${root}/index.ts`), jsFile);
import * as fs from 'fs';

// Inspired by https://github.com/elxris/Turnip-Calculator/blob/master/scripts/i18n.js
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
        return '\n\n'
        + `    '${this.code}': {\n`
        + '        '
        + this.files.map((file) => `${file.replace('.json', '')}: ${this.moduleName(file)},`).join('\n        ')
        + '\n'
        + '    },'
    }
}

function buildLocals() {
    const root = './src/locales';
    const ignore = ['index.ts', '.DS_Store'];
    const filter = (filename: string) => !ignore.includes(filename);
    const languages: Array<LanguageData> =
        fs.readdirSync(root).filter(filter).reduce((list: Array<LanguageData>, folder: string) => {
            list.push(new LanguageData(folder, fs.readdirSync(`${root}/${folder}`).filter(filter)));
            return list;
        }, []);

    const content = '// This file is generated with scripts/build-locals.js\n'
        + languages.map((language) => language.toImport()).join('\n')
        + '\n\n'
        + 'export default {'
        + languages.map((language) => language.toExport()).join('')
        + '\n\n'
        + '};';

    fs.writeFileSync(require('path').join(process.cwd(), `${root}/index.ts`), content);
}

buildLocals();
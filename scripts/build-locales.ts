import * as fs from 'fs';

type LocaleKey = string;
type LocaleTranslation = string;
type LocaleItem = [LocaleKey, LocaleTranslation];
type LocaleNamespace = string;

class LocaleData {

    code: string;
    data: Map<LocaleNamespace, Array<LocaleItem>> = new Map();

    constructor(code: string) {
        this.code = code;
    }

    buildFiles(root: string) {
        const dir = `${root}/${this.code}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(`dir`);
        }
        for (const [ns, items] of this.data) {
            const value: any = {};
            for (const [key, translation] of items) {
                value[key] = translation;
            }
            fs.writeFileSync(`${dir}/${ns}.json`, JSON.stringify(value, null, 4));
        }
    }

    moduleName(ns: string) {
        return `${ns}_${this.code.replace('-', '_')}`
    }

    get importCode(): string {
        const code = [];
        for (const ns of this.data.keys()) {
            code.push(`import ${this.moduleName(ns)} from './${this.code}/${ns}.json';`);
        }
        return code.join('\n');
    }

    get exportCode() {
        const code = [];
        for (const ns of this.data.keys()) {
            code.push(`${ns}: ${this.moduleName(ns)},`);
        }
        return '\n\n'
        + `    '${this.code}': {\n        `
        + code.join('\n        ')
        + '\n'
        + '    },'
    }
}

function search(dir: string, target: string, callback: (path: string) => void) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const path = `${dir}/${item}`;
        if (item === target) {
            callback(path);
            continue;
        }
        if (fs.statSync(path).isDirectory()) {
            search(path, target, callback);
        }
    }
}

function buildLocales() {
    const localeDataMap = new Map<string, LocaleData>();
    search('./src', 'locales.json', (path) => {
        console.log(`Load locales from ${path}`);
        const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
        const perfix = path.replace('./src/', '').replace('/locales.json', '').replace(/\//g, '.');
        for (const [ns, items] of Object.entries(data)) {
            // Namespace
            for (const [key, translations] of Object.entries(items)) {
                // Keys
                for (const [lang, translation] of Object.entries(translations)) {
                    // Languages
                    if (!localeDataMap.has(lang)) {
                        localeDataMap.set(lang, new LocaleData(lang));
                    }
                    const localeData = localeDataMap.get(lang);
                    if (!localeData.data.has(ns)) {
                        localeData.data.set(ns, []);
                    }
                    localeData.data.get(ns).push([`${perfix}.${key}`, translation as string]);
                }
            }
        }
    });
    // Build to temp folder temporarily
    const targetRoot = './src/locales-new';
    if (!fs.existsSync(targetRoot)) {
        fs.mkdirSync(targetRoot);
    }
    for (const data of localeDataMap.values()) {
        data.buildFiles(targetRoot);
    }
}

buildLocales();
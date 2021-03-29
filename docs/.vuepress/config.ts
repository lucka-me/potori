import { defineUserConfig, DefaultThemeOptions, UserConfig } from 'vuepress';

const themeConfig: DefaultThemeOptions = {
    repo: 'lucka-me/potori',
    locales: {
        '/': {
            selectLanguageText: 'Languages',
            selectLanguageName: 'English',
            navbar: [
                { text: 'Auth', link: '/auth/' },
                { text: 'Usage', link: '/usage/' },
                { text: 'Privacy', link: '/privacy/' },
                {
                    text: 'More',
                    children: [
                        { text: 'Contribute', link: '/contribute/' },
                        { text: 'License', link: 'https://github.com/lucka-me/potori/blob/master/LICENSE' },
                        { text: 'Changelog', link: 'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md' },
                    ]
                },
            ]
        },
        '/zh-CN/': {
            selectLanguageText: '选择语言',
            selectLanguageName: '简体中文',
            navbar: [
                { text: '验证', link: '/zh-CN/auth/' },
                { text: '使用', link: '/zh-CN/usage/' },
                { text: '隐私', link: '/zh-CN/privacy/' },
                {
                    text: '了解更多',
                    children: [
                        { text: '贡献', link: '/zh-CN/contribute/' },
                        { text: '许可', link: 'https://github.com/lucka-me/potori/blob/master/LICENSE' },
                        { text: '更新日志', link: 'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md' },
                    ],
                },
            ]
        },
    }
};

const userConfig: UserConfig = {
    base: '/docs/',
    title: 'Potori Docs',
    description: 'Documents for Potori',
    dest: 'dist/docs',
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Potori Docs',
            description: 'Documents for Potori'
        },
        '/zh-CN/': {
            lang: 'zh-CN',
            title: 'Potori文档',
            description: 'Potori的文档'
        }
    },
    themeConfig: themeConfig
};

const config = defineUserConfig(userConfig)

export default config;
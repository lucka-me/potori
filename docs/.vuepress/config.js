module.exports = {
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
  themeConfig: {
    search: false,
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        ariaLabel: 'Languages',
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh"
          }
        },
        nav: [
          { text: 'Auth', link: '/auth/' },
          { text: 'Usage', link: '/usage/' },
          { text: 'Privacy', link: '/privacy/' },
          { text: 'Repo', link: 'https://github.com/lucka-me/potori' },
          {
            text: 'More',
            items: [
              { text: 'Contribute', link: '/contribute/' },
              { text: 'License', link: 'https://github.com/lucka-me/potori/blob/master/LICENSE' },
              { text: 'Changelog', link: 'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md' },
            ],
          },
        ],
        sidebar: {
          '/': [/* ... */],
          '/nested/': [/* ... */]
        }
      },
      '/zh-CN/': {
        selectText: '选择语言',
        label: '简体中文',
        serviceWorker: {
          updatePopup: {
            message: "新内容可用",
            buttonText: "刷新"
          }
        },
        nav: [
          { text: '验证', link: '/zh-CN/auth/' },
          { text: '使用', link: '/zh-CN/usage/' },
          { text: '隐私', link: '/zh-CN/privacy/' },
          { text: '仓库', link: 'https://github.com/lucka-me/potori' },
          {
            text: '了解更多',
            items: [
              { text: '贡献', link: '/zh-CN/contribute/' },
              { text: 'License', link: 'https://github.com/lucka-me/potori/blob/master/LICENSE' },
              { text: 'Changelog', link: 'https://github.com/lucka-me/potori/blob/master/CHANGELOG.md' },
            ],
          },
        ],
        sidebar: {
          '/zh-CN/': [/* ... */],
          '/zh-CN/nested/': [/* ... */]
        },
      },
    },
  },
};
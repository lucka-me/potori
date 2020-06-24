# ![](./assets/title.png)

[![Release](https://img.shields.io/github/v/release/lucka-me/potori)](https://github.com/lucka-me/potori/releases/latest "Last release") [![Demo](https://img.shields.io/website?url=https%3A%2F%2Flucka.moe%2Fpotori)](https://lucka.moe/potori "Website") [![](https://img.shields.io/badge/author-Lucka-2578B5.svg)](https://lucka.moe "Blog") [![License](https://img.shields.io/github/license/lucka-me/potori)](./LICENSE "License")  
[![Telegram Channel](https://img.shields.io/badge/telegram-channel-37aee2)](https://t.me/potori "Telegram Channel")

## Description
Gather and visualize your Portal nominations from your Gmail inbox.

## Build & Run
```sh
$ git clone git@github.com:lucka-me/potori.git
$ cd potori
$ npm install
$ npm start
```

Open `http://localhost:8000/potori` in browser.

## Notice
Due to Google's policy (which aims to protect user's data), some features related to 3rd-party are suspended in the demo page (as a lite version).

Potori is NOT fully compatible with Prime yet, we still need more [mail samples](./samples.md) to figure out how to query all related and localized mails exactly, and how to identify each reason for rejection. If you have any trouble or want to help me, please open an issue or contact me via Telegram@SeeleUN.

## Future Style
Since Niantic launched the Niantic Wayfarer which contains a nomination manager, I've thought a lot about the future of Potori. I've learned a lot from developing it and I do not want to stop. There are still many posibilities: re-writing the entire Potori with ~~Angular~~ Vue, extending it to a data visualization tool, import from [Wayfarer Nomination Manage API response data](https://wayfarer.nianticlabs.com/api/v1/vault/manage)... I'm actually working on them, which is little bit tough for me, though.

- [x] Import from Wayfarer Nomination Manage API response data  
  Done in `0.4.19`
- [x] Extend to a data visualization tool  
  Partly done in `0.5.0`
- [x] Build with Webpack  
  Partly done in `0.7.0`
- [x] Convert to TypeScript  
  Done in `0.7.0`
- [x] Update [document](https://github.com/lucka-me/potori-docs)  
  Done in `0.7.0`
- [x] A new logo  
  Done in `0.7.0`

## Changelog
See [CHANGELOG.md](./CHANGELOG.md).

## License
The source code are [licensed under MIT](./LICENSE).

Please notice that the API Keys and Client ID included in the source code is owned by [Lucka](https://github.com/lucka-me) and **ONLY** for public useage in [the demo pages](http://lucka.moe/potori/).

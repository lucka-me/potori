# ![](./src/assets/title.png)
[![CI Status](https://img.shields.io/github/workflow/status/lucka-me/potori/CI?label=CI&logo=github-actions&logoColor=white)](https://github.com/lucka-me/potori/actions?query=workflow%3ACI "CI Workflow")
[![CD Status](https://img.shields.io/github/workflow/status/lucka-me/potori/CD?label=CD&logo=github-actions&logoColor=white)](https://github.com/lucka-me/potori/actions?query=workflow%3ACD "CD Workflow")  
[![Release](https://img.shields.io/github/v/release/lucka-me/potori)](https://github.com/lucka-me/potori/releases/latest "Last release")
[![Deployed Version](https://img.shields.io/github/package-json/v/lucka-me/potori/main?label=deployed)](https://github.com/lucka-me/potori/tree/main "Main Branch")
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fpotori.lucka.moe)](https://potori.lucka.moe "Website")
[![License](https://img.shields.io/github/license/lucka-me/potori)](./LICENSE "License")  
[![Telegram Channel](https://img.shields.io/badge/telegram-channel-37aee2?logo=telegram)](https://t.me/potori "Telegram Channel")

## Description

A web app to visualize Ingress nominations from Gmail inbox.

## Build & Run
```sh
$ git checkout main # If you want to run the version deployed on website
$ npm i
$ npm start
```

Open `http://localhost:8000/` in browser.

## Notice
Due to Google's policy (which aims to protect user's data), some features related to 3rd-party are suspended in the public web app (as a lite version).

Potori is NOT fully compatible with Prime yet, we still need more [mail samples](./samples) to figure out how to query all related and localized mails exactly and identify each reason for rejection. If you have any trouble or want to help, please open an issue or contact us via Telegram@SeeleUN.

## Future Style
> Since Niantic launched the Niantic Wayfarer which contains a nomination manager, I've thought a lot about the future of Potori. I've learned a lot during the development and I do not want to abandon. There are still many posibilities: re-writing the entire Potori with ~~Angular~~ ~~Vue~~ TypeScript and Webpack, extending it to a data visualization tool, import from [Wayfarer Nomination Manage API response data](https://wayfarer.nianticlabs.com/api/v1/vault/manage)... ~~I'm actually working on them, which is little bit tough for me, though.~~ I've done most part of them.
> 
> Lucka.

- [x] Import from Wayfarer Nomination Manage API response data  
  Done in `0.4.19`
- [x] Extend to a data visualization tool  
  Partly done in `0.5.0`
- [x] Build with Webpack  
  Partly done in `0.7.0`
- [x] Convert to TypeScript  
  Done in `0.7.0`
- [x] Update [document](./docs)  
  Done in `0.7.0`
- [x] A new logo  
  Done in `0.7.0`

## Changelog
See [CHANGELOG.md](./CHANGELOG.md).

## License
The source code are [licensed under MIT](./LICENSE).

Please notice that the API Keys and Client ID included in the source code is owned by [Lucka](https://github.com/lucka-me) and **ONLY** for public useage in [the public web app](https://potori.lucka.moe).

This project is NOT affiliated to Ingress or Niantic.

# ![](./public/assets/title.png)
[![CD Status](https://img.shields.io/github/workflow/status/lucka-me/potori/CD?label=CD&logo=github-actions&logoColor=white)](https://github.com/lucka-me/potori/actions/workflows/cd.yml "CD Workflow")
[![CI-Next Status](https://img.shields.io/github/workflow/status/lucka-me/potori/CI-Next?label=CI-Next&logo=github-actions&logoColor=white)](https://github.com/lucka-me/potori/actions/workflows/ci-next.yml "CI-Next Workflow")
[![CD-Next Status](https://img.shields.io/github/workflow/status/lucka-me/potori/CD-Next?label=CD-Next&logo=github-actions&logoColor=white)](https://github.com/lucka-me/potori/actions/workflows/cd-next.yml "CD-Next Workflow")  
[![Release](https://img.shields.io/github/v/release/lucka-me/potori)](https://github.com/lucka-me/potori/releases/latest "Last release")
[![Deployed Version](https://img.shields.io/github/package-json/v/lucka-me/potori/main?label=deployed)](https://github.com/lucka-me/potori/tree/main "Main Branch")
[![Deployed Version](https://img.shields.io/github/package-json/v/lucka-me/potori/dev?label=next)](https://github.com/lucka-me/potori/tree/dev "Dev Branch")
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fpotori.lucka.moe)](https://potori.lucka.moe "Website")  
[![Lines of code](https://img.shields.io/tokei/lines/github/lucka-me/potori)](https://github.com/lucka-me/potori "Repository")
[![License](https://img.shields.io/github/license/lucka-me/potori)](./LICENSE "License")  
[![Telegram Channel](https://img.shields.io/badge/telegram-channel-37aee2?logo=telegram)](https://t.me/potori "Telegram Channel")

## Description

A web app to manage Ingress nominations from Gmail inbox.

## Build & Run
```sh
$ git checkout main # To run the deployed version
$ git submodule update --init
$ npm i
$ npm start
```

Open `http://localhost:8080/next` (`dev` branch) or `http://localhost:8080/` (`main` branch) in browser.

The `dev` branch will also be deployed continuously to the [`next` directory in website](https://potori.lucka.moe/next).

## Related repositories
- [lucka-me/potori-docs](https://github.com/lucka-me/potori-docs): Documents of Potori
- [lucka-me/potori-swift](https://github.com/lucka-me/potori-swift): Native app built with SwiftUI for iOS / iPadOS / macOS
- [lucka-me/potori-umi](https://github.com/lucka-me/potori-umi): Status and reasons data used in Potori

## Notice
Potori is NOT fully compatible with Prime yet, we still need more [mail samples](https://github.com/lucka-me/potori-umi/tree/main/samples) to figure out how to query all related and localized mails exactly and identify each reason for rejection. If you have any trouble or want to help, please open an issue or contact us via Telegram@SeeleUN.

## Future Style
> Since Niantic launched the Niantic Wayfarer with a nomination manager, I've thought a lot about the future of Potori and realized how much I've learned from the development and I hope to keep on.  
> There are still many posibilities: re-writing the entire Potori with ~~Angular~~ ~~Vue~~ TypeScript and Webpack, extending it to a data visualization tool, import from [Wayfarer Nomination Manage API response data](https://wayfarer.nianticlabs.com/api/v1/vault/manage)...  
> ~~I'm actually working on them, which is little bit tough for me, though.~~ I've done most part of them, and hope to keep Potori evolving.
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
- [x] Upgrade data struct
  Done in `0.8.0`
- [x] Convert to Vue app  
  Done in `1.0.0`

## Changelog
See [CHANGELOG.md](./CHANGELOG.md).

## License
The source code are [licensed under MIT](./LICENSE).

Please notice that the API Keys and Client ID included in the source code is owned by [Lucka](https://github.com/lucka-me) and **ONLY** for public useage in [the public web app](https://potori.lucka.moe).

This project is NOT affiliated to Ingress or Niantic.
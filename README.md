<h1 align=center><img height=90px src="./src/logo-bg.svg" link="#"/></h1>

[![Release](https://img.shields.io/github/v/release/lucka-me/potori?include_prereleases)](https://github.com/lucka-me/potori/releases/latest "Last release") [![Demo](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Flucka.moe%2Fpotori)](https://lucka.moe/potori "Demo") [![](https://img.shields.io/badge/author-Lucka-2578B5.svg)](https://lucka.moe "Author") [![License](https://img.shields.io/github/license/lucka-me/potori)](./LICENSE "License")  
![](https://img.shields.io/badge/safari-support-brightgreen.svg) ![](https://img.shields.io/badge/chrome-support-brightgreen.svg) ![](https://img.shields.io/badge/firefox-support-brightgreen.svg)<!-- ![](https://img.shields.io/badge/edge-support-brightgreen.svg) ![](https://img.shields.io/badge/ie-broken-red.svg) ![](https://img.shields.io/badge/opera-support-brightgreen.svg)-->

## Description
Gather and visualize your Portal nominations from your Gmail inbox.

## Notice
**Due to Google's policy (which aims to protect user's data), some features related to 3rd-party were removed in the demo page (as a lite version).**  
You can download the repository [and host the full version from the master branch](https://developers.google.com/gmail/api/quickstart/js "Browser Quickstart | Gmail API | Google Developers").

**Potori is NOT fully compatible with Prime yet, we need more [mail samples](./samples.md) to figure out how to query all related and localized mails exactly, and how to identify each reason for rejection. If you have any trouble or want to help me, please contact me via Telegram@SeeleUN.**

## Future Style
Since Niantic launched the Niantic Wayfarer which contains a nomination manager, I've thought a lot about the future of Potori. I've learned a lot from developing it and I do not want to stop. There are still many posibilities: re-writing the entire Potori with ~~Angular~~ Vue, extending it to a data visualization tool, import from [Wayfarer Nomination Manage API response data](https://wayfarer.nianticlabs.com/api/v1/vault/manage)... I'm actually working on them, which is little bit tough for me, though.

## Dependencies
- [Material Components Web](https://github.com/material-components/material-components-web)  
  Material Design UI.
- [Gmail API](https://developers.google.com/gmail/api/)  
  Access Gmail inbox.
- [Mapbox GL JS API](https://docs.mapbox.com/mapbox-gl-js/overview/)  
  Display map.
- [Chart.js](https://www.chartjs.org)  
  Display charts.
- [Google Drive API](https://developers.google.com/drive/api/v3/about-sdk)  
  Save / load data in Google Drive.
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)  
  Access Brainstorming database.

## Changelog
See [CHANGELOG.md](./CHANGELOG.md).

## License
The source code are [licensed under MIT](./LICENSE).

Please notice that the API Keys and Client ID included in the source code is owned by [Lucka](https://github.com/lucka-me) and **ONLY** for public useage in [the demo pages](http://lucka.moe/potori/).

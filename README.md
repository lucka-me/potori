<h1 align=center><img height=64px src="./src/logo.svg" link="#"/></h1>

[![](https://img.shields.io/badge/version-0.2.8-green.svg)](./CHANGELOG.md "Changelog") [![](https://img.shields.io/badge/demo-unavailable-red.svg)](https://lucka.moe/PSCI "Demo") [![](https://img.shields.io/badge/author-Lucka-2578B5.svg)](https://lucka.moe "Author") [![](https://img.shields.io/badge/license-MIT-A31F34.svg)](./LICENSE "License")  
[![](https://img.shields.io/badge/safari-support-brightgreen.svg)](https://www.apple.com/safari/ "Safari Support") [![](https://img.shields.io/badge/chrome-support-brightgreen.svg)]("https://www.google.com/chrome/ "Chrome Support")<!-- [![](https://img.shields.io/badge/firefox-support-brightgreen.svg)]("https://www.mozilla.org/firefox/ "Firefox Support") [![](https://img.shields.io/badge/edge-support-brightgreen.svg)]("https://www.microsoft.com/windows/microsoft-edge "Edge Support") [![](https://img.shields.io/badge/ie-broken-red.svg)]("http://microsoft.com/ie "IE Broken") [![](https://img.shields.io/badge/opera-support-brightgreen.svg)]("https://www.opera.com/ "Opera Support")-->

Portal Submission Checker for Ingress  
**Due to Google's policy, the demo page could not work until the OAuth screen is verified.**  
You can download the repository to your computer, open the **[/docs](./docs) folder** [and host it](https://developers.google.com/gmail/api/quickstart/js "Browser Quickstart | Gmail API | Google Developers").
</p>

## Description
A web application to check the portal nomination mails from the gmail inbox and present their status.

## Notice
I've got some ideas for the next major version of PSCI and am working on it. The files of version `0.2.8` are moved into the [/docs](./docs) folder and will be used to build the [demo page](https://lucka.moe/PSCI) for Google OAuth screen verification.

### The Next Version
Here are some of my ideas for the next version.
- [ ] Re-organize the current code
- [ ] Support nominations from Ingress Prime
- [ ] Save/load data to/from file
- [ ] Saving/load data to/from Google Drive
- [ ] Fetch data from OPR Brainstorming database

The mails of nominations from Ingress Prime is localized, so I need samples of mails in every language to find out the keywords used to query the mails and extract information from the body. The samples I've collected are saved in [/samples](./samples).

## Requirement
- [Lucka's CSS](https://github.com/lucka-me/toolkit/tree/master/Web/CSS)  
  Provides basic stylesheet for the page currently.
- [Gmail API](https://developers.google.com/gmail/api/)  
  Access to gmail inbox.

## Changelog
See [CHANGELOG.md](./CHANGELOG.md).

## License
The source code are [licensed under MIT](./LICENSE).

Please notice that the API Key and Client ID included in the source code is owned by [Lucka](https://github.com/lucka-me) and **ONLY** for public useage in [the demo pages](http://lucka.moe/PSCI/).

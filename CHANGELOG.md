# Changelog
Noteable changes of Potori will be documented here.

## [1.0.0](https://github.com/lucka-me/potori/releases/tag/1.0.0) - 2021-04-08
Rebuild with Vue

## Added
- New page: Dashboard, to display general informations and provide entrances to other pages
- New page: Charts, to display non-brainstorming charts
- New page: Brainstorming, to display brainstorming-related charts and update local database
- New page: List, to display nominations filtered by status, scanner or reasons
- New page: Map, to display nominations filtered by status, scanner or reasons in map
- New page: Details, to display details of nomination and edit
- New page: Preferences, to configure Potori and manage data
- New chart: Interval, days between confirmed and resulted
- New chart: Coverage (Brainstorming), recorded, not recorded and early nominations
- Feature: Delete nomination
- Feature: Clear all nominations and brainstorming data
- Feature: Sync nominations with Google Drive automatically or manually
- Feature: Only query mails after the latest one
- Feature: Automatically query brainstorming for locations after processing mails
- Feature: Detailed progress with finished / total
- Feature: Paste Intel URL to set nomination's location

## Changed
- Framework: Rebuilt with Vue 3
- Framework: Nominations and brainstorming data are saved in local IndexedDB database
- UI: Optimized for standalone mode of mobile devices
- Code: Optimized with async / await

## Removed
- Feature: Filter controller (Filter card), repleced by: Tap cards in dashboard to open filtered lists

## Known Issues
- UI: Support for dark mode is removed (temporarily)
- Feature: Unable to load Google API in some browsers, please try adding to home screen or installing Potori

<details><summary>0.8.x</summary>
<p>

## [0.8.1](https://github.com/lucka-me/potori/releases/tag/0.8.1) - 2021-03-21
Split umi data and mail samples to independent repository

### Changed
- Support old photo hosted on ggpht.com
- Load umi data from submodule
- Update umi to 11

### Fixed
- Not set scanner for nominations when parsing mails
- Remove leading white space in title


## [0.8.0](https://github.com/lucka-me/potori/releases/tag/0.8.0) - 2021-03-06
Update structure

### Added
- Multiple reasons and scanner for nominations
- Migrate from legacy data file

### Changed
- Use more regex when processing mails

</p>
</details>

<details><summary>0.7.x</summary>
<p>

## [0.7.12](https://github.com/lucka-me/potori/releases/tag/0.7.12) - 2020-12-23
- UI improved

### Added
- Double click app bar to back to top

### Changed
- Minor UI improved

### Fixed
- Location may lost when nomination from Prime gets result


## [0.7.11](https://github.com/lucka-me/potori/releases/tag/0.7.11) - 2020-11-23
- UI improved

### Added
- Rounded icon and transparent icon

### Changed
- Improved scss files

### Fixed
- Ripples are missing in menu items


## [0.7.10](https://github.com/lucka-me/potori/releases/tag/0.7.10) - 2020-11-09
- Optimize and add error handlers

### Added
- Display an dialog to ask manually match if the nomination's image is missing
- Display an alert to ask report when error occurs during parsing mail
- Log error and export in About dialog

### Changed
- Allow `confirmedTime` being missing
- Ignore nominations missing `confirmedTime` in Count By Month card
- Optimize element creation process


## [0.7.9](https://github.com/lucka-me/potori/releases/tag/0.7.9) - 2020-10-24
- Fixed various issues caused by incorrect data

### Added
- Check existence of `id`, `title`, `image` and `confirmedTime` and format of `id` and `image` when parse nomination from JSON

### Fixed
- Various issues caused by incorrect nomination data, will check and skip them when download data


## [0.7.8](https://github.com/lucka-me/potori/releases/tag/0.7.8) - 2020-10-15
- Skip some queries and improve UI

### Changed
- Skip queries for nominations which got result before database exists (17/2/2018)
- Minor UI improvement

### Fixed
- Some translations


## [0.7.7](https://github.com/lucka-me/potori/releases/tag/0.7.7) - 2020-09-26
- Improved UI and reduce app size

### Added
- zh-HK locale based on zh-TW
- Detailed reasons when fail to query database

### Changed
- Replace drop down selector with text field and chips in Details dialog to aviod menu being covered
- Pack 3rd-party modules and reduce app size
- Logo

### Fixed
- Turn one reason switch on will show all rejected cards when the reject switch is off
- Unable to parse image from some mail


## [0.7.6](https://github.com/lucka-me/potori/releases/tag/0.7.6) - 2020-09-08
- Support offline

### Added
- Support for opening local files when offline

### Fixed
- Brainstorming URL leads to 404
- Progress bar not totally hide
- Brainstorming cards not updated when save nomination data


## [0.7.5](https://github.com/lucka-me/potori/releases/tag/0.7.5) - 2020-09-06
- Dynamically load most modules and lazyload images

### Added
- Support lazyload for images

### Changed
- Lazyload Dashboard, ListView, Chart.js, Firebase, Moment.js and Mapbox GL JS
- Minor optimized

### Fixed
- Broken reason selector in Details dialog


## [0.7.4](https://github.com/lucka-me/potori/releases/tag/0.7.4) - 2020-08-18
- Support new rejection mails with reason(s)

### Added
- Support for new rejection mails with reason(s)

### Changed
- Update dependencies

### Fixed
- Cards not updated when clear the bs data
- When calculate Synch Rate, 3.0 is not regarded as accepted


## [0.7.3](https://github.com/lucka-me/potori/releases/tag/0.7.3) - 2020-08-02
- Improve UI

### Changed
- Set chart type of Quotas from line to bar
- Remove points in line and radar charts


## [0.7.2](https://github.com/lucka-me/potori/releases/tag/0.7.2) - 2020-07-13
- Fixed bugs

### Fixed
- Mail processing may be blocked when there are new mails
- Unable to open alert dialog
- Content of copy brainstorming id alert


## [0.7.1](https://github.com/lucka-me/potori/releases/tag/0.7.1) - 2020-06-24
- Bugs fixed

### Added
- Ability to support more scanners i.e. Pokémon GO

### Changed
- Split code to multiple chunks
- Pack mdc-web to improve page loading speed

### Fixed
- Wrong start_url and scope in manifest.json
- Some icons are missing in Chrome and Firefox


## [0.7.0](https://github.com/lucka-me/potori/releases/tag/0.7.0) - 2020-06-21
Migrate to Webpack and TypeScript

### Added
- Documents build with VuePress
- Internationalization for zh-CN and zh-TW

### Changed
- Build with Webpack
- Convert JavaScript to TypeScript
- Replace Material Icons with FontAwesome
- Speed up page loading
- Improve support for PWA
- Update status data structure

### Fixed
- Various bugs related to Map Card

</p>
</details>
<details><summary>0.6.x</summary>
<p>

## [0.6.2](https://github.com/lucka-me/potori/releases/tag/0.6.2) - 2020-06-08
Bugs fixed

### Fixed
- Can not open Portal Data file
- Synch is NaN% when no Brainstorming data
- No response when open file in Safari


## [0.6.1](https://github.com/lucka-me/potori/releases/tag/0.6.1) - 2020-06-07
Fixed view switching not work

### Fixed
- Can not switch view


## [0.6.0](https://github.com/lucka-me/potori/releases/tag/0.6.0) - 2020-06-07
Modularize Potori

### Added
- A snackbar to show some alerts
- Automatically detect language in Intro

### Changed
- Modularize all scripts
- Build all HTML elements with eliKit
- Save bsData file after 2 sec

### Fixed
- Synch includes reviews for pending portals

</p>
</details>
<details><summary>0.5.x</summary>
<p>

## [0.5.6](https://github.com/lucka-me/potori/releases/tag/0.5.6) - 2020-05-29
UI improvement and bug fix

### Changed
- Optimize the progress bar
- Minor UI improvement

### Fixed
- Map bound incorrect in desktop devices


## [0.5.5](https://github.com/lucka-me/potori/releases/tag/0.5.5) - 2020-05-28
Add new cards

### Add
- Brainstorming Reviews card
- Brainstorming Synch card
- process.analyseBs()
- Alert when update bs data completed

### Changed
- Minor adjustment for cards
- Code enhancement


## [0.5.4](https://github.com/lucka-me/potori/releases/tag/0.5.4) - 2020-05-26
Bug fixed and minor enhancement

### Add
- Query lastTime from Bs when open Detail dialog of pending portal

### Changed
- Display legend in Stats: Type card
- Update Brainstorming card

### Fixed
- Map doesn't update after saving portal details
- Card doesn't follow filter after saving the portal details
- Tooltips of radar chart display value as title


## [0.5.3](https://github.com/lucka-me/potori/releases/tag/0.5.3) - 2020-05-25
Fixed lite version can not finish process

### Fixed
- Query lntLat can't finish in lite version


## [0.5.2](https://github.com/lucka-me/potori/releases/tag/0.5.2) - 2020-05-25
Statistic for Brainstorming data

### Added
- Save, open, update and download BS data
- Brainstorming card
- BS: Rates card

### Changed
- Lite version is able to query location from local bs data
- Minor code optimized

### Fixed
- Error: Style is not done loading
- Parsing portals file always fail


## [0.5.1](https://github.com/lucka-me/potori/releases/tag/0.5.1) - 2020-05-25
Submissions card -> Count by Month card

### Changed
- Submissions card -> Count by Month card including results
- Card style: outlined
- Minor code optimized


## [0.5.0](https://github.com/lucka-me/potori/releases/tag/0.5.0) - 2020-05-22
Introduce Dashboard, a view to show map and statistics

### Added
- Stats: Type card
- Stats: Rejected card
- Submissions card
- Quotas card

### Changed
- A dashboard with map, filter and more cards
- Status & About dialog -> About dialog

</p>
</details>
<details><summary>0.4.x</summary>
<p>

## [0.4.22](https://github.com/lucka-me/potori/releases/tag/0.4.22) - 2020-05-21
Minor improvement and bugs fixed

### Changed
- Set text color of clusters to black in light mode

### Fixed
- Clusters disappear after switching dark/light mode


## [0.4.21](https://github.com/lucka-me/potori/releases/tag/0.4.21) - 2020-05-20
Add menu and Restore time of quota

### Added
- A menu to host actions in app bar
- Time left for the quota to be restored


## [0.4.20](https://github.com/lucka-me/potori/releases/tag/0.4.20) - 2020-05-20
Minor improvement

### Changed
- Remove classified portals data in status dialog


## [0.4.19](https://github.com/lucka-me/potori/releases/tag/0.4.19) - 2020-05-19
Cluster all rejected nominations

### Added
- Import Wayfarer data to update title and location

### Changed
- Cluster rejected nominations in one source

### Fixed
- Error: Style is not done loading


## [0.4.18](https://github.com/lucka-me/potori/releases/tag/0.4.18) - 2020-05-18
Cluster nominations on map

### Changed
- Display nominations as clusters on map

### Fixed
- Page height on mobile devices


## [0.4.17](https://github.com/lucka-me/potori/releases/tag/0.4.17) - 2020-04-29
Minor update

### Changed
- Fetch version code from GitHub release
- Minor update in Intro & Privacy

### Fixed
- Dark mode for Mapbox


## [0.4.16](https://github.com/lucka-me/potori/releases/tag/0.4.16) - 2020-03-30
SDK upgraded

### Changed
- Specify the version of MDC-web: 5.1.0
- Upgrade Mapbox GL JS to 1.9.0

### Fixed
- Position of icon in Detail dialog


## 0.4.15 - 2020-01-01
Bug fixed

### Fixed
- Reject reason select menu broken


## 0.4.14 - 2019-10-26
Bug fixed

### Added
- Fullscreen control for map

### Fixed
- Map size in Safari
- Accepted file type when open file


## 0.4.13 - 2019-09-28
UI optimized

### Changed
- UI optimized
- Merged Intro and Privacy Policy


## 0.4.12 - 2019-09-16
Updated version format

### Changed
- Includes a data version, changing of data won't change the code version


## 0.4.11 - 2019-09-13
Updated code structure

### Changed
- Update code structure, make it easier to update for new rejected reason


## 0.4.10 - 2019-09-12
Changed query for confirmation mails of Prime

### Changed
- Mail query for confirmation mails of Prime due to the launching of in-game edit / report feature

### Fixed
- Indicator in progress bar doesn't show up


## 0.4.9 - 2019-09-11
Fixed Details dialog not working properly in lite version

### Fixed
- Details dialog: Search button is not initiated in lite version, which leads to crashing during interacting with dialog


## 0.4.8 - 2019-09-10
Fixed several bugs related to Details dialog

### Fixed
- Details dialog: Text field and select menu hide after the dialog opened
- Details dialog: Labels of text field and select menu may disappear
- Details dialog: Map doesn't always fit the container
- Some filters are not updated after saving with changing the status and rejected reason


## 0.4.7 - 2019-09-10
Support editing location in Details dialog

### Added
- BETA: Add, edit, search and delete location in Details dialog

### Fixed
- Click events of Location button and Intel button will be triggered multiple times when clicked once after saving in Details dialog


## 0.4.6 - 2019-09-08
Support dark mode

### Added
- BETA: Support for dark mode, including css and map style


## 0.4.5 - 2019-09-07
Support editing in Details dialog

### Added
- BETA: Edit status, result time and rejected reason in Details dialog

### Changed
- Filter group in Status & About dialog: All -> Type
- Code optimized


## 0.4.4 - 2019-09-03
Fixed dialog issues

### Fixed
- Alert dialog can't show up
- Details Dialog can't show up


## 0.4.3 - 2019-09-01
I18n framework for Intro and Privacy

### Added
- A dialog to show details of portal, will be editable in future

### Changed
- Intergrate code of Full and Lite, the version-limited features are enabled / disabled by versionKit
- Struct updated: Merge and sort Portals in process.finish()

### Fixed
- Markers are not be removed after logout
- Progress Bar is not accurate when some mails are processed before other lists been fetched


## 0.4.2 - 2019-08-25
Add dialog: Portal Details

### Added
- A dialog to show details of portal, will be editable in future

### Changed
- Intergrate code of Full and Lite, the version-limited features are enabled / disabled by versionKit
- Struct updated: Merge and sort Portals in process.finish()

### Fixed
- Markers are not be removed after logout
- Progress Bar is not accurate when some mails are processed before other lists been fetched


## 0.4.1 - 2019-08-17
Support PWA

### Added
- Basic support for Progressive Web App (PWA)

### Changed
- Icon color


## 0.4.0 - 2019-08-17
Brand new Material Design UI

### Added
- Full: Support for Safari mobile standalone mode

### Changed
- Re-designed UI with Material Components for the Web
- Updated Intro and Privacy
- Structure optimized, all files except ui.js are the same in Full and Lite

### Fixed
- Lite: Keyboard will show up when click the status button to copy bs ID

</p>
</details>
<details><summary>0.3.x</summary>
<p>

## 0.3.10 - 2019-07-27
Fixed: Deleting empty file in Google Drive will cause crash

### Changed
- If there are more multiple files match the filename potori.json, Potori will search the correct one
- Filename: nominations.json -> potori.json

### Fixed
- Delete method with wrong params will cause crash
- Two string values are missing


## 0.3.9 - 2019-07-24
Fixed: CSS overflow-y: scroll doesn't work in Firefox

### Fixed
- CSS overflow-y issue in Firefox: add min-height: 0% in parent element


## 0.3.8 - 2019-07-20
Fixed: Fail to upload file

### Added
- Error handling and alert correctly

### Fixed
- Fail to upload file caused by wrong parameter in Update method


## 0.3.7 - 2019-07-12
Lite: Migrate to Potori

### Added
- Lite: Save data in Google Drive
- Lite: Support for iOS full-screen mode

### Changed
- Lite: Migrate to Potori GCP project


## 0.3.6 - 2019-07-05
Lite: Added an extended page for features related to 3rd-party

### Added
- Lite: Click the status icon to copy the bs ID
- Lite: /ex page with bs database query, Intel Maps link and bs watermeter link, only processes the data file, no login required

### Changed
- Lite: JavaScript structure optimized


## 0.3.5 - 2019-07-03
Support rejection-undeclared ja and en

### Added
- Support for rejection/undeclared ja and en

### Changed
- Remove all contents following "-NianticOps" before parse rejected reason


## 0.3.4 - 2019-06-29
Added Navi Control and fixed title issue

### Added
- Navigation Control on map

### Fixed
- Can't extract title from subject correctly, caused by encoding of VS Code

### Known Issue
- CSS overflow-y: scroll doesn't work in Firefox, which make the page as long as the list


## 0.3.3 - 2019-06-29
Check structure when get file from Google Drive

### Added
- When get file from Google Drive, check the structure, which may be wrong in some situations


## 0.3.2 - 2019-06-28
Support confirmation in en and ja

### Added
- Support for confirmation mails in en an ja


## 0.3.1 - 2019-06-28
Fixed Open File

### Fixed
- Open File doesn't work, caused by calling a function that has been moved


## 0.3.0 - 2019-06-27
Support Prime

### Added
- Support for Prime, partly

### Changed
- Re-constructed code
- A lite version in /docs to meet the criteria of Google Trust & Safety Team

</p>
</details>
<details><summary>0.2.x</summary>
<p>

## 0.2.9 - 2019-06-25
Removed all features related to 3rd-party

### Removed
- Bs Watermeter link and Intel Map link


## 0.2.8 - 2019-05-19
Hide rejection reason filters by default

### Add
- An intro page, required by OAuth consent screen

### Changed
- Hide rejection reason filters when process finishes


## 0.2.7 - 2019-05-13
New feature: Filter & statics for rejected portals classified by the reason

### Add
- Classify the rejected portal by reason

### Changed
- Id of elements: "console" -> "control"
- Pack dozens of objects into three main objects


## 0.2.6 - 2019-05-13
Collapsible in console

### Add
- A button in console to collapse the rows

### Changed
- Id of elements: "psci" -> "console"

### Fixed
- Issues when there is no acceptance or rejection mail - not tested yet


## 0.2.5 - 2019-05-11
Fixed: scroll to card

### Fixed
- Won't scroll to the card when click marker


## 0.2.4 - 2019-05-11
Fixed confirmation time of pending portals

### Fixed
- Confirmation time of pending portals are displayed as Invalid Date


## 0.2.3 - 2019-05-06
Fixed min-width

### Fixed
- Changed min-width from 400px to 300px to avoid overflow on mobile


## 0.2.2 - 2019-05-06
Optimized for portrait orientation like mobile phone

### Changed
- UI optimized for portrait orientation


## 0.2.1 - 2019-05-03
New feature: Filter

### Added
- A filter to hide / display accepted, rejected or pending nominations

### Changed
- UI improved
- Data structure optimized


## 0.2.0 - 2019-05-01
UI updated with some new features

### Added
- A map to display the nominations with results

### Changed
- The main UI

</p>
</details>
<details><summary>0.1.x</summary>
<p>

## 0.1.7 - 2019-01-18
Intel link added

### Added
- Click title of accepted portal to open intel

### Changed
- Click status icon to open BS watermeter in new tab


## 0.1.6 - 2019-01-18
Reason of rejection

### Added
- The status icon of rejected portals now show the reason of rejection

### Changed
- Policy updated
- Minor UI improved


## 0.1.5 - 2019-01-17
Link to BS watermeter

### Added
- Click title to query the portal in Brainstorming watermeter


## 0.1.4 - 2019-01-17
UI fixed and policy updated

### Added
- An icon

### Changed
- More details in the policy page

### Fixed
- Minor mistakes in UI


## 0.1.3 - 2019-01-14
UI improved

### Changed
- Style of cards to MD-like style


## 0.1.2 - 2019-01-12
Bug fixed

### Fixed
- ipsc -> psci


## 0.1.1 - 2019-01-12
Bug fixed

### Fixed
- Status text


## 0.1 - 2019-01-12
- Initial version with basic functions

</p>
</details>
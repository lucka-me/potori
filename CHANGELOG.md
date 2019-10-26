# Changelog
```markdown
## [0.4.14] - 2019-10-26
Bug fixed

### Added
- Fullscreen control for map

### Fixed
- Map size in Safari
- Accepted file type when open file
```

```markdown
## [0.4.13] - 2019-09-28
UI optimized

### Changed
- UI optimized
- Merged Intro and Privacy Policy
```

```markdown
## [0.4.12] - 2019-09-16
Updated version format

### Changed
- Includes a data version, changing of data won't change the code version
```

```markdown
## [0.4.11] - 2019-09-13
Updated code structure

### Changed
- Update code structure, make it easier to update for new rejected reason
```

```markdown
## [0.4.10] - 2019-09-12
Changed query for confirmation mails of Prime

### Changed
- Mail query for confirmation mails of Prime due to the launching of in-game edit / report feature

### Fixed
- Indicator in progress bar doesn't show up
```

```markdown
## [0.4.9] - 2019-09-11
Fixed Details dialog not working properly in lite version

### Fixed
- Details dialog: Search button is not initiated in lite version, which leads to crashing during interacting with dialog
```

```markdown
## [0.4.8] - 2019-09-10
Fixed several bugs related to Details dialog

### Fixed
- Details dialog: Text field and select menu hide after the dialog opened
- Details dialog: Labels of text field and select menu may disappear
- Details dialog: Map doesn't always fit the container
- Some filters are not updated after saving with changing the status and rejected reason
```

```markdown
## [0.4.7] - 2019-09-10
Support editing location in Details dialog

### Added
- BETA: Add, edit, search and delete location in Details dialog

### Fixed
- Click events of Location button and Intel button will be triggered multiple times when clicked once after saving in Details dialog
```

```markdown
## [0.4.6] - 2019-09-08
Support dark mode

### Added
- BETA: Support for dark mode, including css and map style
```

```markdown
## [0.4.5] - 2019-09-07
Support editing in Details dialog

### Added
- BETA: Edit status, result time and rejected reason in Details dialog

### Changed
- Filter group in Status & About dialog: All -> Type
- Code optimized
```

```markdown
## [0.4.4] - 2019-09-03
Fixed dialog issues

### Fixed
- Alert dialog can't show up
- Details Dialog can't show up
```

```markdown
## [0.4.3] - 2019-09-01
I18n framework for Intro and Privacy

### Added
- A dialog to show details of portal, will be editable in future

### Changed
- Intergrate code of Full and Lite, the version-limited features are enabled / disabled by versionKit
- Struct updated: Merge and sort Portals in process.finish()

### Fixed
- Markers are not be removed after logout
- Progress Bar is not accurate when some mails are processed before other lists been fetched
```

```markdown
## [0.4.2] - 2019-08-25
Add dialog: Portal Details

### Added
- A dialog to show details of portal, will be editable in future

### Changed
- Intergrate code of Full and Lite, the version-limited features are enabled / disabled by versionKit
- Struct updated: Merge and sort Portals in process.finish()

### Fixed
- Markers are not be removed after logout
- Progress Bar is not accurate when some mails are processed before other lists been fetched
```

```markdown
## [0.4.1] - 2019-08-17
Support PWA

### Added
- Basic support for Progressive Web App (PWA)

### Changed
- Icon color
```

```markdown
## [0.4.0] - 2019-08-17
Brand new Material Design UI

### Added
- Full: Support for Safari mobile standalone mode

### Changed
- Re-designed UI with Material Components for the Web
- Updated Intro and Privacy
- Structure optimized, all files except ui.js are the same in Full and Lite

### Fixed
- Lite: Keyboard will show up when click the status button to copy bs ID
```

```markdown
## [0.3.10] - 2019-07-27
Fixed: Deleting empty file in Google Drive will cause crash

### Changed
- If there are more multiple files match the filename potori.json, Potori will search the correct one
- Filename: nominations.json -> potori.json

### Fixed
- Delete method with wrong params will cause crash
- Two string values are missing
```

```markdown
## [0.3.9] - 2019-07-24
Fixed: CSS overflow-y: scroll doesn't work in Firefox

### Fixed
- CSS overflow-y issue in Firefox: add min-height: 0% in parent element
```

```markdown
## [0.3.8] - 2019-07-20
Fixed: Fail to upload file

### Added
- Error handling and alert correctly

### Fixed
- Fail to upload file caused by wrong parameter in Update method
```

```markdown
## [0.3.7] - 2019-07-12
Lite: Migrate to Potori

### Added
- Lite: Save data in Google Drive
- Lite: Support for iOS full-screen mode

### Changed
- Lite: Migrate to Potori GCP project
```

```markdown
## [0.3.6] - 2019-07-05
Lite: Added an extended page for features related to 3rd-party

### Added
- Lite: Click the status icon to copy the bs ID
- Lite: /ex page with bs database query, Intel Maps link and bs watermeter link, only processes the data file, no login required

### Changed
- Lite: JavaScript structure optimized
```

```markdown
## [0.3.5] - 2019-07-03
Support rejection-undeclared ja and en

### Added
- Support for rejection/undeclared ja and en

### Changed
- Remove all contents following "-NianticOps" before parse rejected reason
```

```markdown
## [0.3.4] - 2019-06-29
Added Navi Control and fixed title issue

### Added
- Navigation Control on map

### Fixed
- Can't extract title from subject correctly, caused by encoding of VS Code

### Known Issue
- CSS overflow-y: scroll doesn't work in Firefox, which make the page as long as the list
```

```markdown
## [0.3.3] - 2019-06-29
Check structure when get file from Google Drive

### Added
- When get file from Google Drive, check the structure, which may be wrong in some situations
```

```markdown
## [0.3.2] - 2019-06-28
Support confirmation in en and ja

### Added
- Support for confirmation mails in en an ja
```

```markdown
## [0.3.1] - 2019-06-28
Fixed Open File

### Fixed
- Open File doesn't work, caused by calling a function that has been moved
```

```markdown
## [0.3.0] - 2019-06-27
Support Prime

### Added
- Support for Prime, partly

### Changed
- Re-constructed code
- A lite version in /docs to meet the criteria of Google Trust & Safety Team
```

```markdown
## [0.2.9] - 2019-06-25
Removed all features related to 3rd-party

### Removed
- Bs Watermeter link and Intel Map link
```

```markdown
## [0.2.8] - 2019-05-19
Hide rejection reason filters by default

### Add
- An intro page, required by OAuth consent screen

### Changed
- Hide rejection reason filters when process finishes
```

```markdown
## [0.2.7] - 2019-05-13
New feature: Filter & statics for rejected portals classified by the reason

### Add
- Classify the rejected portal by reason

### Changed
- Id of elements: "console" -> "control"
- Pack dozens of objects into three main objects
```

```markdown
## [0.2.6] - 2019-05-13
Collapsible in console

### Add
- A button in console to collapse the rows

### Changed
- Id of elements: "psci" -> "console"

### Fixed
- Issues when there is no acceptance or rejection mail - not tested yet
```

```markdown
## [0.2.5] - 2019-05-11
Fixed: scroll to card

### Fixed
- Won't scroll to the card when click marker
```

```markdown
## [0.2.4] - 2019-05-11
Fixed confirmation time of pending portals

### Fixed
- Confirmation time of pending portals are displayed as Invalid Date
```

```markdown
## [0.2.3] - 2019-05-06
Fixed min-width

### Fixed
- Changed min-width from 400px to 300px to avoid overflow on mobile
```

```markdown
## [0.2.2] - 2019-05-06
Optimized for portrait orientation like mobile phone

### Changed
- UI optimized for portrait orientation
```

```markdown
## [0.2.1] - 2019-05-03
New feature: Filter

### Added
- A filter to hide / display accepted, rejected or pending nominations

### Changed
- UI improved
- Data structure optimized
```

```markdown
## [0.2.0] - 2019-05-01
UI updated with some new features

### Added
- A map to display the nominations with results

### Changed
- The main UI
```

```markdown
## [0.1.7] - 2019-01-18
Intel link added

### Added
- Click title of accepted portal to open intel

### Changed
- Click status icon to open BS watermeter in new tab
```

```markdown
## [0.1.6] - 2019-01-18
Reason of rejection

### Added
- The status icon of rejected portals now show the reason of rejection

### Changed
- Policy updated
- Minor UI improved
```

```markdown
## [0.1.5] - 2019-01-17
Link to BS watermeter

### Added
- Click title to query the portal in Brainstorming watermeter
```

```markdown
## [0.1.4] - 2019-01-17
UI fixed and policy updated

### Added
- An icon

### Changed
- More details in the policy page

### Fixed
- Minor mistakes in UI
```

```markdown
## [0.1.3] - 2019-01-14
UI improved

### Changed
- Style of cards to MD-like style
```

```markdown
## [0.1.2] - 2019-01-12
Bug fixed

### Fixed
- ipsc -> psci
```

```markdown
## [0.1.1] - 2019-01-12
Bug fixed

### Fixed
- Status text
```

```markdown
## [0.1] - 2019-01-12
- Initial version with basic functions
```

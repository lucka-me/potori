---
sidebar: auto
---

# Usage
This part will describe how to use Potori.

## Load Data Files
If you have saved data files (Nomination data file and Brainstorming data file) locally, you can open it to review your nominations without login.

If you have uploaded data files before, Potori will try to download them from your Google Drive after login.

## Process Mails
For those mails related to Portal nominations, the subjects and contents are generated from several templates, some keywords are used to filter mails and extract informations.

### Obtain Mails
Potori will obtain mails with the following filters:

- **Confirmation Mails**
  - `from:ingress-support@nianticlabs.com Portal submission confirmation -edit -photo`
  - `from:nominations@portals.ingress.com subject:("能量塔提交確認" OR "Portal申請の受領確認" OR "Portal submission confirmation") -AP`
- **Acceptance Mails**
  - `from:ingress-support@nianticlabs.com Portal review complete now available -edit -photo`
  - `from:nominations@portals.ingress.com Intel Map AP`
- **Rejection Mails**
  - `from:ingress-support@nianticlabs.com Portal review complete reviewed -edit -photo`
  - `from:nominations@portals.ingress.com subject:("能量塔審查完畢" OR "Portal審査の完了" OR "Portal review complete") -AP`

::: tip
You can also create rules with these filter to label your mails automatically in Gmail.
:::
::: warning
Ingress Prime uses localized templates, which makes it difficult to find the corrent filters. We are working on it.
:::

### Extract Informations
The contents of mails will be used to extract information of the nomination, browse [Data Usage](../privacy/#Data_Usage) for more details.

As for the rejection mails, there are several templates for each rejection reason, and each one colud be identified by matching the keywords:

| Reason | Keywords
| :--- | :---
| Duplicated | `duplicate of either an existing Portal`
| Too Close | `too close to an existing Portal` `能量塔過近`
| Undeclared | (Match neither of the keywords above)

::: warning
Ingress Prime uses localized templates, which makes it difficult to find the corrent keywords. We are working on it.
:::

## Visualize
Potori will display the information of nominations in cards, and display data and stastistics in the Dashboard view.

The status, result time and rejection reason are editable, click the cards to open the *Details Dialog* and edit.

## Import
Potori can parse data from [Wayfarer API](https://wayfarer.nianticlabs.com/api/v1/vault/manage "Wayfarer API") and update the title and location of nominations. Click *Import* from menu to open the *Import Dialog*, paste the JSON code from Wayfarer API and click Import.

## Save Data Files
You can save the nomination data to your computer by clicking the *Save File* from menu, files named `Potori.json` and `bsdata.json` will be downloaded.

The nomination data will **NOT** be uploaded to your Google Drive automatically. If you have login, you can upload the data by clicking the *Upload File* from menu.
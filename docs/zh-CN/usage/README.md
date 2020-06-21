---
sidebar: auto
---

# 使用
这部分将阐述如何使用Potori。

## 加载数据文件
如果您在本地保存了数据文件，您可以直接打开它并查看您的提名而无需登录。

如果您曾经上传过数据文件，Potori将在登录后从您的Google Drive下载文件。

## 处理邮件
与能量塔提名相关的邮件的主题和内容由一些模版产生，一些关键词可用于筛选邮件和提取信息。

## 获取邮件
Potori将利用以下筛选器获取邮件：

- **确认邮件**
  - `from:ingress-support@nianticlabs.com Portal submission confirmation -edit -photo`
  - `from:nominations@portals.ingress.com subject:("能量塔提交確認" OR "Portal申請の受領確認" OR "Portal submission confirmation") -AP`
- **批准邮件**
  - `from:ingress-support@nianticlabs.com Portal review complete now available -edit -photo`
  - `from:nominations@portals.ingress.com Intel Map AP`
- **拒绝邮件**
  - `from:ingress-support@nianticlabs.com Portal review complete reviewed -edit -photo`
  - `from:nominations@portals.ingress.com subject:("能量塔審查完畢" OR "Portal審査の完了" OR "Portal review complete") -AP`

::: tip
您可以使用这些筛选器在您的Gmail中创建规则以自动分类您的邮件。
:::
::: warning
Ingress Prime使用了本地化的模版，这给确定筛选器带来了挑战，我们正在尝试解决这个问题。
:::

## 提取信息
邮件内容将被用于提取提名信息，详情请见[数据使用](../privacy/#数据使用)部分。

对于拒绝邮件，有几种不同的模版分别对应不同的拒绝原因，可以通过以下关键词来识别：

| 原因 | 关键词
| :--- | :---
| 重复 | `duplicate of either an existing Portal`
| 过近 | `too close to an existing Portal` `能量塔過近`
| 未指明 | （不匹配以上任何关键词）

::: warning
Ingress Prime使用了本地化的模版，这给确定关键词带来了挑战，我们正在尝试解决这个问题。
:::

## 可视化
Potori会将提名信息展现在卡片中，并在仪表盘视图中展示数据和统计信息。

提名的状态、结果时间和拒绝理由可以在点击卡片打开的*详情对话框*中编辑。

## 导入
Potori可以导入[Wayfarer API](https://wayfarer.nianticlabs.com/api/v1/vault/manage "Wayfarer API")中的数据以更新提名的名称和坐标。在菜单中点击*Import*打开*导入对话框*，将Wayfarer API的JSON代码粘贴并点击*Import*即可。

## 保存数据文件
您可以通过点击菜单中的*Save File*来将提名数据和Brainstorming数据保存在本地，浏览器将会下载分别名为`potori.json`和`bsdata.json`的文件。

提名数据**不会**被自动上传至Google Drive。如果您已经登录，可以点击菜单中的*Upload File*来上传文件。
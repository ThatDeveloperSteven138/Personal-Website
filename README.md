# 個人數碼花園

以物理、科技、系統思考、學習歷程與生活價值為核心的繁體中文個人網站。

這個專案同時支援：

- 本機預覽
- OpenAI Sites 建置
- GitHub Pages 靜態網站部署

## 公開顯示名稱

網站目前使用 **That Developer Steven** 作為公開顯示名稱。不要加入不希望公開的身份或聯絡資料。

## 本機預覽

需要 Node.js 22 或以上版本。

```bash
npm ci
npm run dev
```

然後打開 `http://localhost:3000`。

## 網站語言

導覽列的地球按鈕會在桌面滑鼠懸停、鍵盤操作或觸控點擊時展開語言選單。英文是預設語言，使用根目錄頁面；繁體中文使用 `/zh` 及相應的 `/zh/...` 內容頁，因此重新整理或分享連結後仍會保留所選語言。原有的 `/en` 網址會繼續載入英文，確保舊連結仍可使用。

## Chrome Web Store 自動資料

擴充功能頁面的公開使用者數量及英文簡介來自 Chrome Web Store。GitHub Actions 會在香港時間每天 `00:17`、`06:17`、`12:17` 和 `18:17` 自動同步，並依使用者數量由多至少排列。

- `data/extensions.json` 保存不常改動的擴充功能 ID、名稱、網址、圖示及備用簡介。
- `data/chrome-web-store.json` 是自動產生的最近一次完整成功快照，不應手動編輯。
- `scripts/sync-chrome-web-store.mjs` 以英文商店頁面的 Overview 第一段作為官方英文簡介；任何一個項目擷取失敗時不會覆寫既有快照。
- 自動化只會在數據改變，或距離上一次保存超過 30 天時建立 commit，避免每六小時產生沒有內容價值的版本記錄。

本機手動同步需要先安裝 Playwright Chromium：

```bash
npx playwright install chromium
npm run sync:webstore
```

## 部署到 GitHub Pages

專案已包含 `.github/workflows/deploy-pages.yml`。每次將程式推送到 `main` 分支，GitHub Actions 都會自動建立及部署靜態網站。

### 1. 建立 GitHub Repository

1. 登入 GitHub。
2. 按右上角 `+`，選擇 `New repository`。
3. 輸入 Repository 名稱，例如 `personal-website`。
4. 選擇 `Public` 或 `Private`。
5. 不要勾選建立 README、`.gitignore` 或 License，然後建立 Repository。

> **重要私隱提示：**一般個人 GitHub Pages 網站會公開在互聯網上；即使 Repository 是 Private，也不代表 Pages 網站是私人。私人 GitHub Pages 存取控制主要供使用 GitHub Enterprise Cloud 的組織網站使用。部署前請再次確認網站沒有私人資料。

### 2. 將本機專案推送到 GitHub

在本資料夾執行以下指令，並把範例網址換成你的 Repository 網址：

```bash
git remote add origin https://github.com/YOUR-USERNAME/personal-website.git
git push -u origin main
```

如果已經有名為 `origin` 的 remote，請改用：

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/personal-website.git
git push -u origin main
```

### 3. 啟用 GitHub Pages

1. 在 GitHub Repository 打開 `Settings`。
2. 左側選擇 `Pages`。
3. 在 `Build and deployment` 的 `Source` 選擇 `GitHub Actions`。
4. 打開 `Actions` 分頁，等待 `Deploy personal website to GitHub Pages` 完成。

部署後網址通常是：

```text
https://YOUR-USERNAME.github.io/personal-website/
```

如果 Repository 名稱是 `YOUR-USERNAME.github.io`，網址會是：

```text
https://YOUR-USERNAME.github.io/
```

## 更新網站

修改完成後執行：

```bash
git add .
git commit -m "Update personal website"
git push
```

GitHub Actions 會自動重新部署。

## 自訂 Domain（可選）

GitHub Repository 的 `Settings` → `Pages` 可以設定 Custom domain。設定後還要在你的 Domain 供應商加入 GitHub 指定的 DNS 記錄。

## 本機驗證 GitHub Pages 輸出

```bash
npm run test:github
```

靜態輸出會建立在 `out/`，此資料夾不需要提交到 GitHub。

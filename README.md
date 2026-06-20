# 康姿健 HONG CHI KIN — 預約 App

屯門美容預約系統，包含客人手機 App 及店主管理後台。

## 功能

### 客人 App（mobile/）
- 線上預約（選療程、日期、時段）
- 查看套票餘額及有效期
- 療程推介（根據膚質／上次療程）
- 每月優惠 Banner
- 店主休息通告（自動封鎖預約日期）
- 店鋪資訊、IG、小紅書、WhatsApp 連結

### 管理後台（admin/）
- 預約管理（確認、完成、取消）
- 會員餘額更新及手動扣款
- 優惠管理
- 休息通告管理

## 專案結構

```
hong-chi-kin-app/
├── mobile/          # Expo React Native App（iOS + Android）
├── admin/           # Vite React 管理後台
├── customer-web/    # 客人網頁版預約系統（可部署給客人使用）
├── shared/          # 共用資料（療程、套票、店鋪資訊）
└── README.md
```

## 快速開始

### 前置要求
- Node.js 18+ 及 npm
- Expo Go App（手機測試用）

### 安裝 Homebrew + Watchman（首次設定）

Homebrew 需要你在 Mac 終端機輸入密碼，請自行執行：

```bash
chmod +x ~/Desktop/hong-chi-kin-app/scripts/install-homebrew.sh
~/Desktop/hong-chi-kin-app/scripts/install-homebrew.sh
```

### 1. 安裝依賴

```bash
# 手機 App
cd mobile
npm install

# 管理後台
cd ../admin
npm install

# 客人網頁版
cd ../customer-web
npm install
```

### 2. 啟動手機 App

> **重要**：如見到 `EMFILE: too many open files` 錯誤，請先安裝 [Watchman](https://facebook.github.io/watchman/docs/install)（Mac 建議用 Homebrew：`brew install watchman`）

```bash
cd mobile
npm start
```

用 Expo Go 掃描 QR code 即可在手机上預覽。

### 3. 啟動管理後台

```bash
cd admin
npm run dev
```

瀏覽器打開 http://localhost:3001

### 4. 啟動客人網頁版

```bash
cd customer-web
npm run dev
```

瀏覽器打開 http://localhost:3002

## 客人網頁版部署（Vercel）

### 1. 建立 Firebase 專案（只作資料庫）

1. 到 https://console.firebase.google.com 建立新專案
2. 啟用 Firestore Database
3. 在 Project settings > Web app 複製 Firebase config

### 2. 填入 Firebase 設定

```bash
cd customer-web
cp .env.example .env
```

然後把 Firebase config 填入 `.env`。

### 3. 在 Vercel 設定 Environment Variables

到 Vercel 專案設定：

`Settings` → `Environment Variables`

加入以下 6 個變數：

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 4. 部署到 Vercel

你可以用兩種方式：

#### 方法 A：Vercel 匯入整個專案

1. 把 `hong-chi-kin-app` 推到 GitHub
2. 在 Vercel 匯入該 GitHub repo
3. Vercel 會讀取根目錄的 `vercel.json`
4. Build command 會自動使用 `customer-web`

#### 方法 B：Vercel Root Directory 選 `customer-web`

在 Vercel 匯入 repo 時：

```text
Root Directory: customer-web
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

完成後 Vercel 會給你正式網址，例如：

```text
https://hong-chi-kin.vercel.app
```

可放到 IG Bio、小紅書、WhatsApp、QR code。

### 5. Firestore 安全規則

部署網站用 Vercel，但預約資料會寫入 Firebase Firestore。Firestore rules 已在：

```text
firestore.rules
```

如要套用規則，可用 Firebase CLI：

```bash
firebase deploy --only firestore:rules
```

## 示範模式

目前使用本地儲存（AsyncStorage / localStorage）作示範：
- App 登入：輸入任意手機號碼即可
- 示範會員餘額：$2,120（套票 A）
- 休息通告：2026-07-01 至 2026-07-06 已預設

## 套票制度

| 套票 | 儲值 | 實付 | 有效期 |
|------|------|------|--------|
| 套票 A | $3,500 | $3,000 | 3 個月 |
| 套票 B | $6,500 | $5,000 | 6 個月 |

## 店鋪資料

- **地址**：屯門紅橋菁菱徑9號華利大廈地下12號地舖
- **電話**：9770 9300
- **Instagram**：[@hong_chi_kin](https://www.instagram.com/hong_chi_kin/)
- **小紅書**：[康姿健主頁](https://www.xiaohongshu.com/user/profile/67d2d82b000000000d009a62)
- **Google Map**：已設定康姿健屯門美容正式店鋪連結
- **Google 好評**：已設定直接開啟評論視窗連結
- **營業時間**：09:00–21:00（週一至週日）

## 下一步（正式上線）

1. **Firebase 設定**：建立 Firebase 專案，啟用 Authentication（手機 OTP）及 Firestore
2. **替換本地儲存**：將 `services/storage.ts` 改為 Firebase SDK
3. **推送通知**：使用 Expo Notifications 發送預約提醒
4. **App Store / Google Play**：使用 EAS Build 打包上架

## 品牌色（FaceMORE 參考柔粉風）

- 主色珊瑚粉：`#C96B73`
- 按鈕／重點色：`#D96F78`
- 柔粉 accent：`#F4A3A5`
- 背景：`#FFF4F2`

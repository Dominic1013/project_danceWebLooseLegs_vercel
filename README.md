# LooseLegs Dance Course Web

![LooseLegs-banner](https://github.com/Dominic1013/Project_FormatHolic/assets/129192292/4c0fdbce-dfa0-483a-bdd8-77a3b405ee5c)

> 此專案是是一個舞蹈課程預訂網站的模版，提供給有需要的舞蹈教室與專業舞團使用。學生可以在這裡查看來自舞蹈老師的最新課程資訊，老師也能在網站上傳課程資訊，並提供課程搜尋和老師介紹等頁面。

- [線上觀看連結](https://project-looselegs-v-client.vercel.app/)

## 功能

測試帳號密碼

```bash
帳號： exampleName@gmail.com
密碼： exampleName
```

- [x] 登入
- [x] 登出
- [x] Update 老師資料
- [x] 創建課程資訊
- [x] Update 課程資訊

## 畫面

> 以下畫面為 首頁、搜尋欄、製作老師個人資料、創建課程資訊、老師簡介頁面

![Home](https://github.com/Dominic1013/Project_FormatHolic/assets/129192292/f18b733f-87f9-4d67-ba0d-cb40737e1074)
![search](https://github.com/Dominic1013/Project_FormatHolic/assets/129192292/f0dfb3c3-1ca7-48f9-a3d7-29cb988501f1)
![profile](https://github.com/Dominic1013/Project_FormatHolic/assets/129192292/81483310-b35a-4149-8ef3-d160588e15c3)
![createListing](https://github.com/Dominic1013/Project_FormatHolic/assets/129192292/07e24ccb-ae28-4069-af0e-4f1f2cef01c1)
![info](https://github.com/Dominic1013/Project_FormatHolic/assets/129192292/4f301022-ec75-4935-9392-7aba56bdb907)

## 安裝

以下將會引導你如何安裝此專案到你的電腦上。

本專案 Node.js 版本 為 21.7.1

本專案以 vite 建構專案。

### 取得專案

```bash
git clone https://github.com/Dominic1013/project_danceWebLooseLegs_vercel.git
```

### 移動到專案內

```bash
cd project_danceWebLooseLegs_vercel
```

### 安裝套件

> 後端 api 資料夾 install 後，可於 package.json 中添加以下程式碼來使用 ES Module 語法 ：

```bash
"type": "module",
```

```bash
cd client
npm install
cd ..
cd api
npm install
```

### 環境變數設定

前端有採用 FireBase OAuth 服務，若需使用請至 FireBase 官網申請。
前端環境的 .env 檔請添加：

```bash
VITE_FIREBASE_API_KEY = "你去申請後的APIKEY"
```

後端環境的 .env 檔需要申請 mongoDB Atlas 服務

```bash
MONGO = 你的密鑰

JWT_SECRET = "你的祕密"
```

### 運行專案

前端

```bash
npm run dev
```

後端

```bash
npm start
# 或是
npm run dev
```

## 專案技術

前端：

- dependencies

  - "@reduxjs/toolkit": "^2.0.1",
  - "firebase": "^10.8.1",
  - "react": "^18.2.0",
  - "react-dom": "^18.2.0",
  - "react-icons": "^5.0.1",
  - "react-redux": "^9.1.0",
  - "react-router-dom": "^6.21.2",
  - "redux-persist": "^6.0.0",
  - "swiper": "^11.0.5"

- devDependencies
  - "@tailwindcss/line-clamp": "^0.4.4",
  - "@types/react": "^18.2.43",
  - "@types/react-dom": "^18.2.17",
  - "@vitejs/plugin-react-swc": "^3.5.0",
  - "autoprefixer": "^10.4.16",
  - "eslint": "^8.55.0",
  - "eslint-plugin-react": "^7.33.2",
  - "eslint-plugin-react-hooks": "^4.6.0",
  - "eslint-plugin-react-refresh": "^0.4.5",
  - "postcss": "^8.4.33",
  - "tailwindcss": "^3.4.1",
  - "vite": "^5.0.8"

後端：

- dependencies
  - "bcryptjs": "^2.4.3",
  - "cookie-parser": "^1.4.6",
  - "cors": "^2.8.5",
  - "dotenv": "^16.3.1",
  - "express": "^4.18.2",
  - "jsonwebtoken": "^9.0.2",
  - "mongoose": "^8.0.4"

## 第三方服務

- FireBase OAuth, FireBase Storage
- MongoDB Atlas

## 聯絡作者

你可以透過以下方式與我聯絡：

- email: dominic.huang1013@gmail.com
- [個人網站](https://iamdominic.vercel.app/)

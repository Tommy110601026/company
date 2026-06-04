# EnviroValor Website

EnviroValor Website是一個中英文雙語公司形象網站，主要用於展示EnviroValor的品牌資訊、產品介紹、型錄下載與聯絡詢問功能。網站以污水處理曝氣產品為核心，包含Disc Diffusers與Tube Diffusers等產品頁面，並透過Vercel進行部署。

## Project Overview

本專案主要包含以下內容：

* 中英文雙語網站頁面
* 公司首頁與品牌介紹
* Disc Diffuser產品介紹頁
* Tube Diffuser產品介紹頁
* 型錄下載頁
* 聯絡我們彈跳視窗
* 聯絡表單寄信功能
* SEO meta、Open Graph、robots.txt與sitemap.xml設定
* RWD手機版排版
* Vercel Serverless Function聯絡表單API

## Tech Stack

本專案使用以下技術：

* HTML
* CSS
* JavaScript
* Vercel
* Vercel Serverless Function
* Resend Email API

## Folder Structure

```text
company-main/
├─ api/
│  └─ contact.js
├─ css/
│  ├─ contact.css
│  ├─ footer.css
│  ├─ global.css
│  ├─ header.css
│  ├─ mobile-menu.css
│  └─ product.css
├─ file/
│  ├─ EV-270 Technical Data May 2026.pdf
│  ├─ EnviroValor_Disc_Diffuser_Catalog.pdf
│  └─ EnviroValor_Tube_Diffuser_600mm_Catalog.pdf
├─ html/
│  ├─ components/
│  ├─ en/
│  └─ zh/
├─ images/
├─ js/
│  └─ main.js
├─ index.html
├─ package.json
├─ robots.txt
├─ sitemap.xml
├─ .gitignore
└─ README.md
```

## Main Pages

### Root Page

* `index.html`

  * 網站根目錄入口頁
  * 用於導向主要語系頁面

### Chinese Pages

* `html/zh/index.html`

  * 中文首頁

* `html/zh/about.html`

  * 中文關於我們頁

* `html/zh/disc-diffuser.html`

  * 中文Disc Diffuser產品頁

* `html/zh/tube-diffuser.html`

  * 中文Tube Diffuser產品頁

* `html/zh/download.html`

  * 中文型錄下載頁

### English Pages

* `html/en/index.html`

  * English homepage

* `html/en/about.html`

  * English about page

* `html/en/disc-diffuser.html`

  * English Disc Diffuser product page

* `html/en/tube-diffuser.html`

  * English Tube Diffuser product page

* `html/en/download.html`

  * English download page

## CSS Structure

本專案CSS依照功能拆分，主要檔案如下：

* `css/global.css`

  * 全站共用樣式
  * 字體、顏色、容器、按鈕、共用區塊

* `css/header.css`

  * 桌機版Header與導覽列樣式

* `css/mobile-menu.css`

  * 手機版選單與手機版導覽樣式

* `css/footer.css`

  * Footer樣式

* `css/contact.css`

  * 聯絡我們彈跳視窗與表單樣式

* `css/product.css`

  * 產品頁與產品區塊樣式

## JavaScript Structure

主要JavaScript檔案：

* `js/main.js`

目前主要負責：

* 載入共用Header
* 載入共用Footer
* 手機版選單開關
* 產品頁選單active狀態
* 聯絡我們彈跳視窗
* 聯絡表單送出
* 圖片輪播或頁面互動功能

## Contact Form Flow

聯絡表單流程如下：

```text
使用者填寫聯絡表單
→ 前端JavaScript收集表單資料
→ fetch("/api/contact")送出POST請求
→ Vercel執行api/contact.js
→ api/contact.js讀取RESEND_API_KEY
→ 呼叫Resend Email API寄信
→ 寄送至指定收件信箱
→ API回傳success或error給前端
→ 前端顯示送出成功或失敗訊息
```

## API Route

本專案使用Vercel Serverless Function處理聯絡表單：

```text
/api/contact.js
```

前端呼叫方式：

```javascript
fetch("/api/contact", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        inquiryType,
        company,
        email,
        subject,
        message
    })
});
```

## Environment Variables

本專案需要設定以下環境變數：

```text
RESEND_API_KEY
```

此環境變數應設定於Vercel Project Settings中的Environment Variables。

請勿將真實API key寫入以下位置：

* HTML檔案
* JavaScript前端檔案
* API檔案中的硬編碼字串
* README.md
* `.env.example`
* GitHub commit紀錄

正確做法是在`api/contact.js`中透過以下方式讀取：

```javascript
process.env.RESEND_API_KEY
```

## Local Development

本專案主要為靜態HTML/CSS/JavaScript結構，可使用Live Server或本機靜態伺服器進行預覽。

建議本機測試項目：

* 中文首頁是否正常顯示
* 英文首頁是否正常顯示
* Header與Footer是否正確載入
* 手機版選單是否可正常開關
* 產品頁圖片是否正常顯示
* Download頁PDF連結是否可正常下載
* 聯絡我們彈跳視窗是否可正常開關
* 聯絡表單欄位驗證是否正常
* 中英文切換連結是否正確
* 圖片路徑是否正確
* SEO meta與Open Graph設定是否完整

## Deployment

本專案透過Vercel部署。

建議部署流程：

```text
建立功能分支
→ 修改網站內容
→ 本機測試
→ commit
→ push到GitHub
→ 建立Pull Request
→ 檢查Files changed
→ 檢查Vercel Preview
→ merge回main
→ Vercel自動部署正式網站
```

## Branch Naming

建議分支命名方式：

```text
feature/faq-page
feature/product-comparison
fix/mobile-header
fix/contact-form-message
fix/download-pdf-path
seo/update-sitemap
seo/add-product-schema
refactor/contact-form
docs/update-readme
```

## Commit Message Format

建議commit格式：

```text
type(scope): description
```

範例：

```text
feat(contact): add inquiry purpose field
fix(mobile): resolve download page layout issue
fix(download): correct pdf file paths
seo(home): update Open Graph metadata
seo(sitemap): add zh pages and www domain
refactor(header): simplify mobile navigation logic
docs(readme): add project documentation
```

常見type：

```text
feat      新增功能
fix       修正問題
seo       SEO調整
refactor  重構
docs      文件更新
style     樣式調整
chore     專案雜項
```

## Maintenance Notes

後續維護時需特別注意：

* 中文與英文頁面內容是否同步
* Header與Footer共用元件是否正常載入
* 圖片路徑是否正確
* PDF下載路徑是否正確
* 手機版排版是否跑版
* 聯絡表單是否能正常送出
* Resend API key是否仍有效
* Vercel Environment Variables是否設定正確
* sitemap.xml是否需要更新
* robots.txt中的sitemap網址是否與正式網域一致
* Open Graph圖片是否正常顯示
* 型錄檔案是否為最新版本
* 不要將`.env`或任何真實API key上傳至GitHub

## Future Improvements

後續可新增或優化：

* FAQ常見問題頁
* Disc Diffuser與Tube Diffuser產品比較表
* 產品應用情境頁
* Download頁型錄預覽
* 聯絡表單後端驗證
* 防垃圾訊息機制
* honeypot欄位
* rate limit限制
* Cloudflare Turnstile或reCAPTCHA
* 圖片壓縮與WebP格式
* Schema.org結構化資料
* GitHub Project看板
* GitHub Issues管理待辦事項

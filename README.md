# EnviroValor Website

EnviroValor Website是一個中英文雙語公司形象網站，主要用於展示EnviroValor的品牌資訊、產品介紹、型錄下載與聯絡詢問功能。網站以污水處理曝氣產品為核心，包含Disc Diffusers與Tube Diffusers等產品頁面，並透過Vercel進行部署。

## Project Overview

本專案主要包含以下內容：

* 中英文雙語網站頁面
* 公司首頁與品牌介紹
* Disc Diffuser產品介紹頁
* Tube Diffuser產品介紹頁
* 型錄下載頁（由JSON資料驅動）
* 聯絡我們彈跳視窗
* 聯絡表單寄信功能
* SEO meta、Open Graph、hreflang、JSON-LD結構化資料、robots.txt與sitemap.xml設定
* RWD手機版排版
* Vercel Serverless Function聯絡表單API

## Tech Stack

本專案使用以下技術：

* HTML
* CSS
* JavaScript（ES Modules）
* Vercel
* Vercel Serverless Function
* Resend Email API

## Folder Structure

```text
company-main/
├─ api/
│  └─ contact.js
├─ css/
│  ├─ about.css
│  ├─ contact.css
│  ├─ download.css
│  ├─ footer.css
│  ├─ global.css
│  ├─ header.css
│  ├─ mobile-menu.css
│  └─ product.css
├─ data/
│  └─ downloads.json
├─ file/
│  ├─ EV-270_Technical_Data_May_2026.pdf
│  ├─ EnviroValor_Disc_Diffuser_Catalog.pdf
│  └─ EnviroValor_Tube_Diffuser_600mm_Catalog.pdf
├─ html/
│  ├─ components/
│  │  ├─ en/
│  │  │  ├─ footer.html
│  │  │  ├─ inquiry-modal.html
│  │  │  └─ mobile-menu.html
│  │  └─ zh/
│  │     ├─ footer.html
│  │     ├─ inquiry-modal.html
│  │     └─ mobile-menu.html
│  ├─ en/
│  │  ├─ about.html
│  │  ├─ disc-diffuser.html
│  │  ├─ download.html
│  │  ├─ index.html
│  │  └─ tube-diffuser.html
│  └─ zh/
│     ├─ about.html
│     ├─ disc-diffuser.html
│     ├─ download.html
│     ├─ index.html
│     └─ tube-diffuser.html
├─ images/
│  ├─ disc/
│  ├─ tube/
│  ├─ logo.jpg
│  └─ slogo.jpg
├─ js/
│  ├─ component-loader.js
│  ├─ contact.js
│  ├─ download-list.js
│  ├─ main.js
│  ├─ mobile-menu.js
│  ├─ nav-active.js
│  ├─ nav-dropdown.js
│  ├─ product-slider.js
│  ├─ product-tabs.js
│  └─ scroll-top.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ robots.txt
├─ sitemap.xml
├─ .env.example
├─ .gitignore
└─ README.md
```

## Main Pages

### Root Page

* `index.html`

  * 網站根目錄入口頁
  * 依照瀏覽器語系自動導向`/html/zh/index.html`或`/html/en/index.html`
  * 關閉JavaScript時會顯示語言選擇連結

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

## Shared Components

共用區塊放在`html/components/`，中英文各一份，由`js/component-loader.js`在頁面載入時以fetch插入。

| 元件 | 掛載點 | 說明 |
| --- | --- | --- |
| `mobile-menu.html` | `#mobile-menu` | 手機版側邊選單 |
| `inquiry-modal.html` | `#inquiry-modal` | 聯絡我們彈跳視窗與表單 |
| `footer.html` | `#footer` | 頁尾 |

語系判斷方式：`window.location.pathname`包含`/zh/`則載入`zh`，否則載入`en`。

Header目前直接寫在各頁面的HTML中，尚未抽成共用元件，修改導覽列時需同步更新10個頁面。

## CSS Structure

本專案CSS依照功能拆分，主要檔案如下：

* `css/global.css`

  * 全站共用樣式
  * 字體、顏色、容器、按鈕、共用區塊
  * 回頂部按鈕

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
  * 圖片輪播、產品特色分頁、規格分頁

* `css/about.css`

  * 關於我們頁專用樣式

* `css/download.css`

  * 型錄下載頁與下載卡片樣式

各頁面載入的CSS：

| 頁面 | 額外載入 |
| --- | --- |
| `index.html`（zh / en） | 無 |
| `about.html` | `about.css` |
| `disc-diffuser.html` / `tube-diffuser.html` | `product.css` |
| `download.html` | `download.css` |

`global.css`、`header.css`、`footer.css`、`contact.css`、`mobile-menu.css`為所有頁面共用。

## JavaScript Structure

JavaScript採用ES Modules，各頁面只載入進入點：

```html
<script type="module" src="../../js/main.js"></script>
```

`js/main.js`負責在`DOMContentLoaded`後先載入共用元件，再依序初始化各功能模組。因為表單與選單都在共用元件裡，所以`initComponents()`必須先`await`完成。

各模組職責：

* `js/main.js`

  * 應用程式進入點，統一初始化所有模組

* `js/component-loader.js`

  * 判斷語系
  * 以fetch載入mobile-menu、inquiry-modal、footer共用元件

* `js/nav-dropdown.js`

  * 桌機版Products下拉選單開關

* `js/mobile-menu.js`

  * 手機版選單開關
  * 手機版詢價按鈕觸發彈跳視窗

* `js/nav-active.js`

  * 依網址判斷目前頁面
  * 加上導覽列active狀態（產品頁對應到Products）

* `js/contact.js`

  * 聯絡我們彈跳視窗開關（含Escape關閉）
  * 表單前端驗證與錯誤訊息（中英文）
  * 留言字數計數
  * 送出表單至`/api/contact`

* `js/product-slider.js`

  * 產品圖片輪播
  * 上一張／下一張按鈕與3秒自動播放

* `js/product-tabs.js`

  * 產品特色分頁（`.product-tab-item`）
  * 產品規格分頁（`.spec-tab-btn`）

* `js/download-list.js`

  * 讀取`data/downloads.json`
  * 依語系產生下載卡片、線上預覽與下載按鈕

* `js/scroll-top.js`

  * 捲動超過400px顯示回頂部按鈕

所有模組都會先檢查目標元素是否存在，不存在就直接return，因此可以安全地在所有頁面載入同一份`main.js`。

## Download Page Data

型錄下載頁的內容不寫死在HTML，而是由`data/downloads.json`驅動，新增或修改型錄只需要改這個JSON檔。

欄位說明：

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `fileName` | 是 | 檔案顯示名稱 |
| `fileSize` | 是 | 檔案大小顯示文字，例如`1.2 MB` |
| `uploadDate` | 是 | 上傳日期，格式`YYYY-MM-DD` |
| `fileType` | 是 | 檔案類型，例如`PDF`，同時決定圖示文字 |
| `fileUrl` | 是 | 檔案路徑，相對於下載頁的位置 |
| `descriptionZh` / `descriptionEn` | 是 | 中英文說明文字 |
| `highlightsZh` / `highlightsEn` | 否 | 中英文重點條列，未提供則不顯示 |
| `previewUrl` | 否 | 線上預覽網址，未提供時使用`fileUrl` |

注意事項：

* 只有`fileType`為`PDF`時才會顯示「線上預覽」按鈕
* `fileSize`為純顯示文字，不會自動計算，新增檔案時要自己確認單位（KB／MB）
* `fileUrl`目前使用相對路徑`../../file/...`，是以`html/zh/`與`html/en/`的層級為基準
* JSON內容會經過HTML escape後才輸出，避免破壞頁面結構

## Contact Form Flow

聯絡表單流程如下：

```text
使用者填寫聯絡表單
→ js/contact.js前端驗證欄位
→ 驗證失敗顯示form-alert錯誤清單
→ 驗證通過後fetch("/api/contact")送出POST請求
→ Vercel執行api/contact.js
→ 檢查honeypot欄位與IP速率限制
→ 後端再次驗證必填欄位、Email格式與長度上限
→ api/contact.js讀取RESEND_API_KEY
→ 呼叫Resend Email API寄信
→ 寄送至info@envirovalor.com，reply_to設為填表人Email
→ API回傳success或error給前端
→ 前端顯示送出成功或對應的中英文錯誤訊息
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
        message,
        website
    })
});
```

`website`為honeypot欄位，正常使用者看不到也不會填寫。若後端收到有值的`website`，會直接回傳success但不寄信。

後端防護與限制：

| 項目 | 設定 |
| --- | --- |
| 允許方法 | 僅`POST`，其他回傳405 |
| Honeypot | `website`欄位有值即視為機器人 |
| 速率限制 | 同一IP每60秒最多3次，超過回傳429 |
| 必填欄位 | `company`、`email`、`subject`、`message` |
| 長度上限 | inquiryType 100／company 100／email 254／subject 150／message 3000 |
| XSS防護 | 所有欄位寫入信件HTML前皆做escape |

速率限制目前使用記憶體中的Map，Vercel每個serverless instance各自獨立且cold start後會歸零，屬於基本防護而非嚴格限制。

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

## SEO Setup

各語系頁面皆已設定：

* `<html lang>`：zh頁為`zh-Hant`，en頁為`en`
* `canonical`：指向該頁自身的正式網址
* `hreflang`：`en`、`zh-Hant`、`x-default`（x-default指向網站根目錄）
* Open Graph：`og:type`、`og:site_name`、`og:url`、`og:title`、`og:description`、`og:image`
* JSON-LD結構化資料：首頁與兩個產品頁

其他設定：

* `robots.txt`：允許全站索引，並指向sitemap
* `sitemap.xml`：包含中英文各5個頁面，共10筆網址
* 正式網域為`https://www.envirovalor.com`（含www）

新增頁面時記得同步更新`sitemap.xml`，並確認canonical與hreflang的網址與正式網域一致。

## Local Development

本專案主要為靜態HTML/CSS/JavaScript結構。因為使用ES Modules與fetch載入共用元件，**不能直接用`file://`開啟HTML檔案**，必須透過本機靜態伺服器（例如VS Code Live Server）預覽，否則共用元件與下載清單會載入失敗。

聯絡表單的`/api/contact`需要Vercel環境才能運作，本機若要完整測試可使用：

```text
vercel dev
```

建議本機測試項目：

* 中文首頁是否正常顯示
* 英文首頁是否正常顯示
* Footer、手機版選單、詢價視窗三個共用元件是否正確載入
* 手機版選單是否可正常開關
* 產品頁圖片輪播與分頁切換是否正常
* Download頁清單是否從JSON正確產生
* Download頁PDF線上預覽與下載連結是否可正常使用
* 聯絡我們彈跳視窗是否可正常開關
* 聯絡表單欄位驗證是否正常
* 回頂部按鈕是否在捲動後出現
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
* 修改Header時要同步更新10個頁面（尚未抽成共用元件）
* 共用元件是否正常載入（`html/components/zh`與`html/components/en`要同步）
* 圖片路徑是否正確
* 新增型錄後`data/downloads.json`的檔案大小、日期與路徑是否正確
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

* Header抽成共用元件，比照footer放進`html/components/`
* 資源路徑改為絕對路徑（`/data/`、`/file/`、`/html/components/`），避免相依頁面層級
* 新增`vercel.json`設定cleanUrls與根目錄語系redirect
* 404頁面
* 圖片壓縮與WebP格式、加上`loading="lazy"`
* 聯絡表單送出成功改用頁內訊息取代`alert()`
* 更嚴格的防垃圾訊息機制（Cloudflare Turnstile或reCAPTCHA）
* 跨instance的速率限制（例如Upstash Redis）
* `/api/contact`加上Origin白名單檢查
* FAQ常見問題頁
* Disc Diffuser與Tube Diffuser產品比較表
* 產品應用情境頁
* GitHub Project看板
* GitHub Issues管理待辦事項

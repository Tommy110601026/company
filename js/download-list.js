// =========================
// Download List
// 從 Supabase 讀取下載資料，並自動產生下載卡片
// 資料由 /admin/ 後台維護
// =========================

import {
    SUPABASE_URL,
    SUPABASE_KEY,
    getFileUrl,
    formatFileSize
} from "./supabase-config.js";

export async function initDownloadList(){

    // 取得下載清單容器
    const downloadList =
        document.getElementById("downloadList");

    // 如果這一頁沒有下載清單，就不執行
    if(!downloadList) return;

    // 判斷目前頁面語系
    const isEnglish =
        window.location.pathname.includes("/en/");

    try{

        // 讀取已上架的型錄，依後台設定的順序排列
        // （RLS 只允許訪客讀到 published = true 的資料）
        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/downloads` +
                "?select=*&order=sort_order.asc,created_at.desc",
                {
                    headers: { apikey: SUPABASE_KEY }
                }
            );

        if(!response.ok){

            throw new Error("型錄資料載入失敗");
        }

        const files =
            await response.json();

        // 清空原本內容
        downloadList.innerHTML = "";

        // 逐筆產生下載卡片
        files.forEach((file) => {

            // 沒有設定顯示名稱時，退回使用檔名
            const title =
                (isEnglish ? file.title_en : file.title_zh) ||
                file.file_name;

            const description =
                isEnglish
                    ? file.description_en
                    : file.description_zh;

            const highlights =
                isEnglish
                    ? file.highlights_en
                    : file.highlights_zh;

            const uploadLabel =
                isEnglish
                    ? "Upload Date"
                    : "上傳日期";

            // 取得檔案類型，例如 PDF、DOCX、XLSX、ZIP
            const fileType =
                file.file_type
                    ? file.file_type.toUpperCase()
                    : "FILE";

            const previewUrl =
                getFileUrl(file.file_path);

            // 檔案在 Supabase 網域，<a download> 跨網域會失效，
            // 改用 Storage 的 ?download= 讓瀏覽器以原始檔名下載
            const downloadUrl =
                `${previewUrl}?download=${encodeURIComponent(file.file_name)}`;

            // 目前僅讓 PDF 顯示線上預覽功能
            const canPreview =
                fileType === "PDF";

            // 依照檔案類型自動產生顯示文字
            const fileTypeLabel =
                isEnglish
                    ? `${fileType} File`
                    : `${fileType} 文件`;

            const previewButtonText =
                isEnglish
                    ? "Online Preview"
                    : "線上預覽";

            const downloadButtonText =
                isEnglish
                    ? "Download"
                    : "下載型錄";

            const card =
                document.createElement("div");

            card.className =
                "download-card";

            card.innerHTML = `
                <div class="download-info">

                    <div class="file-icon">
                        ${escapeHtml(fileType)}
                    </div>

                    <div class="file-content">

                        <h3>
                            ${escapeHtml(title)}
                        </h3>

                        <p class="file-description">
                            ${escapeHtml(description)}
                        </p>

                        ${renderHighlights(highlights)}

                        <div class="file-meta">

                            <span>
                                ${uploadLabel}：${escapeHtml(file.upload_date)}
                            </span>

                            <span>
                                ${escapeHtml(fileTypeLabel)}
                            </span>

                            <span>
                                ${escapeHtml(formatFileSize(file.file_size))}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="download-actions">

                    ${
                        canPreview
                            ? `
                                <a
                                    class="preview-btn"
                                    href="${escapeHtml(previewUrl)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${previewButtonText}
                                </a>
                            `
                            : ""
                    }

                    <a
                        class="download-btn"
                        href="${escapeHtml(downloadUrl)}"
                    >
                        ${downloadButtonText}
                    </a>

                </div>
            `;

            downloadList.appendChild(card);
        });


    }catch(error){

        console.error(error);

        downloadList.innerHTML = `
            <p class="download-error">
                ${
                    isEnglish
                        ? "Download list failed to load. Please try again later."
                        : "下載清單載入失敗，請稍後再試。"
                }
            </p>
        `;
    }
}



// =========================
// 產生下載文件重點條列
// =========================

function renderHighlights(highlights = []){

    if(
        !Array.isArray(highlights) ||
        highlights.length === 0
    ){
        return "";
    }

    const listItems =
        highlights
            .map((item) => {

                return `
                    <li>
                        ${escapeHtml(item)}
                    </li>
                `;
            })
            .join("");

    return `
        <ul class="file-description-list">
            ${listItems}
        </ul>
    `;
}


// =========================
// HTML 特殊字元轉義
// 避免後台輸入的內容破壞 HTML 結構
// =========================

function escapeHtml(value = ""){

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

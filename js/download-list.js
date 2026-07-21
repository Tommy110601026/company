// =========================
// Download List
// 從 JSON 讀取下載資料，並自動產生下載卡片
// =========================

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

        // 讀取 downloads.json
        const response =
            await fetch("../../data/downloads.json");

        if(!response.ok){

            throw new Error("downloads.json 載入失敗");
        }

        const files =
            await response.json();

        // 清空原本內容
        downloadList.innerHTML = "";

        // 逐筆產生下載卡片
        files.forEach((file) => {

            const description =
                isEnglish
                    ? file.descriptionEn
                    : file.descriptionZh;

            const highlights =
                isEnglish
                    ? file.highlightsEn
                    : file.highlightsZh;

            const uploadLabel =
                isEnglish
                    ? "Upload Date"
                    : "上傳日期";

            // 取得檔案類型，例如 PDF、DOCX、XLSX、ZIP
            const fileType =
                file.fileType
                    ? file.fileType.toUpperCase()
                    : "FILE";

            // 優先使用 previewUrl
            // 沒有設定時，直接使用原本的 fileUrl
            const previewUrl =
                file.previewUrl || file.fileUrl;

            // 目前僅讓 PDF 顯示線上預覽功能
            const canPreview =
                fileType === "PDF" &&
                Boolean(previewUrl);

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
                            ${escapeHtml(file.fileName)}
                        </h3>

                        <p class="file-description">
                            ${escapeHtml(description)}
                        </p>

                        ${renderHighlights(highlights)}

                        <div class="file-meta">

                            <span>
                                ${uploadLabel}：${escapeHtml(file.uploadDate)}
                            </span>

                            <span>
                                ${escapeHtml(fileTypeLabel)}
                            </span>

                            <span>
                                ${escapeHtml(file.fileSize)}
                            </span>

                        </div>

                    </div>

                </div>

                <div class="download-actions">

                    ${
                        canPreview
                            ? `
                                <button
                                    class="preview-btn"
                                    type="button"
                                    data-preview-url="${escapeHtml(previewUrl)}"
                                    data-file-name="${escapeHtml(file.fileName)}"
                                >
                                    ${previewButtonText}
                                </button>
                            `
                            : ""
                    }

                    <a
                        class="download-btn"
                        href="${escapeHtml(file.fileUrl)}"
                        download
                    >
                        ${downloadButtonText}
                    </a>

                </div>
            `;

            downloadList.appendChild(card);
        });

        // 啟用線上預覽視窗
        initPreviewModal(downloadList, isEnglish);

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
// PDF 線上預覽視窗
// =========================

function initPreviewModal(
    downloadList,
    isEnglish
){

    const previewModal =
        document.getElementById("previewModal");

    const previewFrame =
        document.getElementById("previewFrame");

    const previewTitle =
        document.getElementById("previewTitle");

    const closePreviewButton =
        document.getElementById("closePreviewModal");

    // 找不到預覽元件時停止執行
    if(
        !previewModal ||
        !previewFrame ||
        !previewTitle ||
        !closePreviewButton
    ){
        return;
    }

    // 避免重複綁定事件
    if(
        previewModal.dataset.initialized === "true"
    ){
        return;
    }

    previewModal.dataset.initialized =
        "true";

    // 開啟預覽
    function openPreview(
        previewUrl,
        fileName
    ){

        previewTitle.textContent =
            fileName ||
            (
                isEnglish
                    ? "Online Preview"
                    : "型錄線上預覽"
            );

        previewFrame.title =
            fileName ||
            (
                isEnglish
                    ? "Online Preview"
                    : "型錄線上預覽"
            );

        previewFrame.src =
            previewUrl;

        previewModal.hidden =
            false;

        document.body.classList.add(
            "preview-open"
        );

        closePreviewButton.focus();
    }

    // 關閉預覽
    function closePreview(){

        previewModal.hidden =
            true;

        // 清除 PDF，避免關閉後仍占用資源
        previewFrame.src =
            "about:blank";

        document.body.classList.remove(
            "preview-open"
        );
    }

    // 監聽下載清單中的預覽按鈕
    downloadList.addEventListener(
        "click",
        (event) => {

            const previewButton =
                event.target.closest(
                    ".preview-btn"
                );

            if(!previewButton) return;

            const previewUrl =
                previewButton.dataset.previewUrl;

            const fileName =
                previewButton.dataset.fileName;

            if(!previewUrl) return;

            openPreview(
                previewUrl,
                fileName
            );
        }
    );

    // 點擊關閉按鈕
    closePreviewButton.addEventListener(
        "click",
        closePreview
    );

    // 點擊黑色背景時關閉
    previewModal.addEventListener(
        "click",
        (event) => {

            if(
                event.target === previewModal
            ){
                closePreview();
            }
        }
    );

    // 按下 Esc 時關閉
    document.addEventListener(
        "keydown",
        (event) => {

            if(
                event.key === "Escape" &&
                !previewModal.hidden
            ){
                closePreview();
            }
        }
    );
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
// 避免 JSON 內容破壞 HTML 結構
// =========================

function escapeHtml(value = ""){

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
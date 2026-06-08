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

            // 依照檔案類型自動產生顯示文字
            const fileTypeLabel =
                isEnglish
                    ? `${fileType} File`
                    : `${fileType} 文件`;

            const buttonText =
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

                <a
                class="download-btn"
                href="${escapeHtml(file.fileUrl)}"
                download>
                    ${buttonText}
                </a>
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
// HTML特殊字元轉義
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
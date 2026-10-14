// =========================================================
// admin.js
// 型錄管理後台：登入、列表、新增／編輯、刪除、排序、上下架
// =========================================================

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm";

import {
    SUPABASE_URL,
    SUPABASE_KEY,
    DOWNLOAD_BUCKET,
    getFileUrl,
    formatFileSize
} from "/js/supabase-config.js";


const supabase =
    createClient(SUPABASE_URL, SUPABASE_KEY);

const MAX_FILE_SIZE =
    50 * 1024 * 1024;

const ALLOWED_TYPES = {
    pdf:  "application/pdf",
    doc:  "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls:  "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    zip:  "application/zip"
};

const $ = (id) => document.getElementById(id);

const views = {
    boot:  $("bootView"),
    login: $("loginView"),
    app:   $("appView")
};

const editor     = $("editor");
const editorForm = $("editorForm");
const fileInput  = $("fileInput");
const dropzone   = $("dropzone");

// 目前列表資料
let items = [];

// 正在編輯的那一筆（新增時為 null）
let editing = null;

// 防止同時重複送出
let busy = false;


// =========================
// 畫面切換
// =========================

function showView(name){

    Object.entries(views).forEach(([key, el]) => {
        el.hidden = key !== name;
    });
}


// =========================
// 登入狀態
// =========================

supabase.auth.onAuthStateChange((event, session) => {

    // 只在登入狀態真的改變時切換，避免 token 自動更新時重新載入列表
    if(event === "TOKEN_REFRESHED") return;

    if(session){

        showView("app");

        // 不能在這個 callback 裡直接呼叫 supabase（會卡住），延到下一輪再讀
        setTimeout(loadItems, 0);

    }else{

        showView("login");
    }
});


$("loginForm").addEventListener("submit", async (event) => {

    event.preventDefault();

    const form  = event.currentTarget;
    const error = $("loginError");
    const btn   = form.querySelector("button[type=submit]");

    const email    = form.email.value.trim();
    const password = form.password.value;

    error.hidden = true;

    if(!email || !password){

        showError(error, "請輸入 Email 和密碼");
        return;
    }

    btn.disabled    = true;
    btn.textContent = "登入中…";

    const { error: authError } =
        await supabase.auth.signInWithPassword({ email, password });

    btn.disabled    = false;
    btn.textContent = "登入";

    if(authError){

        showError(
            error,
            authError.message.includes("Invalid login")
                ? "Email 或密碼錯誤"
                : `登入失敗：${authError.message}`
        );
        return;
    }

    form.password.value = "";
});


$("logoutBtn").addEventListener("click", async () => {

    await supabase.auth.signOut();
});


// =========================
// 列表
// =========================

async function loadItems(){

    const { data, error } =
        await supabase
            .from("downloads")
            .select("*")
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });

    if(error){

        toast(`讀取失敗：${error.message}`, true);
        return;
    }

    items = data;
    renderItems();
}


function renderItems(){

    const list = $("itemList");

    list.innerHTML = "";

    $("emptyState").hidden = items.length > 0;

    items.forEach((item, index) => {

        const li =
            document.createElement("li");

        li.className =
            "item" + (item.published ? "" : " is-hidden");

        li.innerHTML = `
            <div class="item-order">
                <button class="icon-btn" type="button" data-move="-1" aria-label="往上移" ${index === 0 ? "disabled" : ""}>▲</button>
                <button class="icon-btn" type="button" data-move="1" aria-label="往下移" ${index === items.length - 1 ? "disabled" : ""}>▼</button>
            </div>

            <div class="item-main">
                <div class="item-title"></div>
                <div class="item-sub"></div>
                <div class="item-meta">
                    <span class="badge ${item.published ? "badge-on" : "badge-off"}">
                        ${item.published ? "顯示中" : "已隱藏"}
                    </span>
                    <span class="item-file"></span>
                    <span>上傳日期 ${escapeHtml(item.upload_date)}</span>
                </div>
            </div>

            <div class="item-actions">
                <button class="btn btn-ghost btn-sm" type="button" data-action="edit">編輯</button>
                <button class="btn btn-danger btn-sm" type="button" data-action="delete">刪除</button>
            </div>
        `;

        // 使用者輸入的內容一律用 textContent，避免 HTML 被執行
        li.querySelector(".item-title").textContent = item.title_zh;
        li.querySelector(".item-sub").textContent   = item.title_en;
        li.querySelector(".item-file").textContent  =
            `${item.file_type} · ${formatFileSize(item.file_size)}`;

        li.querySelectorAll("[data-move]").forEach((btn) => {
            btn.addEventListener("click", () => moveItem(index, Number(btn.dataset.move)));
        });

        li.querySelector("[data-action=edit]")
            .addEventListener("click", () => openEditor(item));

        li.querySelector("[data-action=delete]")
            .addEventListener("click", () => deleteItem(item));

        list.appendChild(li);
    });
}


// =========================
// 排序
// =========================

async function moveItem(index, step){

    if(busy) return;

    const target = index + step;

    if(target < 0 || target >= items.length) return;

    // 先在畫面上交換，再把整份順序重新編號寫回資料庫
    const reordered = [...items];

    [reordered[index], reordered[target]] =
        [reordered[target], reordered[index]];

    const changed =
        reordered
            .map((item, i) => ({ item, order: (i + 1) * 10 }))
            .filter(({ item, order }) => item.sort_order !== order);

    items = reordered.map((item, i) => ({ ...item, sort_order: (i + 1) * 10 }));
    renderItems();

    busy = true;

    const results =
        await Promise.all(
            changed.map(({ item, order }) =>
                supabase
                    .from("downloads")
                    .update({ sort_order: order })
                    .eq("id", item.id)
            )
        );

    busy = false;

    if(results.some((r) => r.error)){

        toast("排序儲存失敗，請重新整理頁面", true);
        loadItems();
    }
}


// =========================
// 刪除
// =========================

async function deleteItem(item){

    if(busy) return;

    const ok =
        confirm(`確定要刪除「${item.title_zh}」嗎？\n刪除後網站上就看不到，而且無法復原。`);

    if(!ok) return;

    busy = true;

    const { error } =
        await supabase
            .from("downloads")
            .delete()
            .eq("id", item.id);

    if(error){

        busy = false;
        toast(`刪除失敗：${error.message}`, true);
        return;
    }

    // 資料已刪，檔案刪不掉也不影響網站，只會多佔一點空間
    await supabase.storage
        .from(DOWNLOAD_BUCKET)
        .remove([item.file_path]);

    busy = false;

    toast("已刪除");
    loadItems();
}


// =========================
// 新增／編輯視窗
// =========================

$("addBtn").addEventListener("click", () => openEditor(null));

editor.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", closeEditor);
});

// 按 Esc 時也走同一個關閉流程（上傳中不允許關閉）
editor.addEventListener("cancel", (event) => {

    event.preventDefault();
    closeEditor();
});


function openEditor(item){

    editing = item;

    editorForm.reset();
    resetFile();

    $("editorError").hidden = true;
    $("editorTitle").textContent = item ? "編輯型錄" : "新增型錄";

    const current = $("currentFile");

    if(item){

        editorForm.title_zh.value       = item.title_zh;
        editorForm.title_en.value       = item.title_en;
        editorForm.description_zh.value = item.description_zh;
        editorForm.description_en.value = item.description_en;
        editorForm.highlights_zh.value  = item.highlights_zh.join("\n");
        editorForm.highlights_en.value  = item.highlights_en.join("\n");
        editorForm.upload_date.value    = item.upload_date;
        editorForm.published.checked    = item.published;

        current.hidden    = false;
        current.innerHTML = `目前檔案：<a target="_blank" rel="noopener"></a>（${escapeHtml(formatFileSize(item.file_size))}）。如果要換檔，再選一個新檔案即可。`;

        const link = current.querySelector("a");
        link.href        = getFileUrl(item.file_path);
        link.textContent = item.file_name;

    }else{

        editorForm.upload_date.value = today();
        current.hidden = true;
    }

    updateCounters();
    editor.showModal();
}


function closeEditor(){

    if(busy) return;

    editor.close();
}


// =========================
// 檔案選擇
// =========================

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if(!file){

        resetFile();
        return;
    }

    const problem = checkFile(file);

    if(problem){

        toast(problem, true);
        fileInput.value = "";
        resetFile();
        return;
    }

    dropzone.classList.add("has-file");
    $("fileLabel").textContent =
        `已選擇：${file.name}（${formatFileSize(file.size)}）`;

    // 換了新檔案，上傳日期自動改成今天
    editorForm.upload_date.value = today();
});

["dragenter", "dragover"].forEach((type) => {
    dropzone.addEventListener(type, () => dropzone.classList.add("is-drag"));
});

["dragleave", "drop"].forEach((type) => {
    dropzone.addEventListener(type, () => dropzone.classList.remove("is-drag"));
});


function resetFile(){

    dropzone.classList.remove("has-file");
    $("fileLabel").textContent = "點這裡選擇檔案，或把檔案拖進來";
}


function checkFile(file){

    const ext = getExtension(file.name);

    if(!ALLOWED_TYPES[ext]){

        return "只能上傳 PDF、Word、Excel 或 ZIP 檔";
    }

    if(file.size > MAX_FILE_SIZE){

        return `檔案太大（${formatFileSize(file.size)}），上限是 50 MB`;
    }

    return "";
}


// =========================
// 字數提示
// =========================

editorForm.addEventListener("input", updateCounters);


function updateCounters(){

    editorForm.querySelectorAll(".counter").forEach((counter) => {

        const field = editorForm[counter.dataset.for];

        if(field.dataset.maxLines){

            const lines   = toLines(field.value);
            const maxLine = Number(field.dataset.maxLineLength);
            const tooLong = lines.some((line) => line.length > maxLine);

            counter.textContent =
                `${lines.length} / ${field.dataset.maxLines} 點` +
                (tooLong ? `，有一點超過 ${maxLine} 字` : "");

            counter.classList.toggle(
                "is-over",
                lines.length > Number(field.dataset.maxLines) || tooLong
            );
            return;
        }

        counter.textContent =
            `${field.value.length} / ${field.maxLength}`;
    });
}


// =========================
// 儲存
// =========================

editorForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if(busy) return;

    const errorBox = $("editorError");
    const file     = fileInput.files[0];
    const values   = readForm();
    const problems = validate(values, file);

    if(problems.length){

        showError(errorBox, problems.join("\n"));
        errorBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
    }

    errorBox.hidden = true;
    setSaving(true, file ? "上傳檔案中…" : "儲存中…");

    try{

        let uploadedPath = null;

        if(file){

            uploadedPath = await uploadFile(file);

            Object.assign(values, {
                file_path: uploadedPath,
                file_name: file.name,
                file_size: file.size,
                file_type: getExtension(file.name).toUpperCase()
            });
        }

        setSaving(true, "儲存中…");

        const query =
            editing
                ? supabase.from("downloads").update(values).eq("id", editing.id)
                : supabase.from("downloads").insert({ ...values, sort_order: nextSortOrder() });

        const { error } = await query;

        if(error){

            // 資料沒存成功，剛上傳的檔案也一併清掉
            if(uploadedPath){

                await supabase.storage.from(DOWNLOAD_BUCKET).remove([uploadedPath]);
            }

            throw error;
        }

        // 換檔成功後，刪掉舊檔
        if(editing && uploadedPath){

            await supabase.storage.from(DOWNLOAD_BUCKET).remove([editing.file_path]);
        }

        setSaving(false);
        editor.close();

        toast(editing ? "已更新" : "已新增，網站上已經看得到了");
        loadItems();

    }catch(error){

        setSaving(false);
        showError(errorBox, `儲存失敗：${error.message}`);
    }
});


function readForm(){

    return {
        title_zh:       editorForm.title_zh.value.trim(),
        title_en:       editorForm.title_en.value.trim(),
        description_zh: editorForm.description_zh.value.trim(),
        description_en: editorForm.description_en.value.trim(),
        highlights_zh:  toLines(editorForm.highlights_zh.value),
        highlights_en:  toLines(editorForm.highlights_en.value),
        upload_date:    editorForm.upload_date.value,
        published:      editorForm.published.checked
    };
}


function validate(values, file){

    const problems = [];

    if(!editing && !file) problems.push("請選擇要上傳的檔案");
    if(!values.title_zh)  problems.push("請填寫中文標題");
    if(!values.title_en)  problems.push("請填寫英文標題");
    if(!values.upload_date) problems.push("請填寫上傳日期");

    [
        ["highlights_zh", "中文重點"],
        ["highlights_en", "英文重點"]
    ].forEach(([name, label]) => {

        const field   = editorForm[name];
        const maxLine = Number(field.dataset.maxLineLength);

        if(values[name].length > Number(field.dataset.maxLines)){

            problems.push(`${label}最多 ${field.dataset.maxLines} 點`);
        }

        if(values[name].some((line) => line.length > maxLine)){

            problems.push(`${label}每一點最多 ${maxLine} 字`);
        }
    });

    return problems;
}


async function uploadFile(file){

    const ext = getExtension(file.name);

    // Storage 路徑不接受中文與部分符號：保留英數、底線、連字號，空格轉底線；
    // 整個都是中文時退回用時間戳記命名。原始檔名另外存在 file_name，下載時使用
    const base =
        file.name
            .slice(0, -(ext.length + 1))
            .replace(/\s+/g, "_")
            .replace(/[^A-Za-z0-9_.-]/g, "")
            .replace(/_{2,}/g, "_")
            .replace(/^[._-]+|[._-]+$/g, "")
            || String(Date.now());

    const upload = (path) =>
        supabase.storage
            .from(DOWNLOAD_BUCKET)
            .upload(path, file, {
                contentType: ALLOWED_TYPES[ext],
                upsert: false
            });

    let path = `${base}.${ext}`;
    let { error } = await upload(path);

    // 已有同名檔案（可能是別的型錄正在用）就不覆蓋，改加上時間戳記
    if(error && /exists|duplicate/i.test(error.message)){

        path = `${base}-${Date.now()}.${ext}`;
        ({ error } = await upload(path));
    }

    if(error) throw error;

    return path;
}


function setSaving(saving, label = "儲存"){

    busy = saving;

    const btn = $("saveBtn");

    btn.disabled    = saving;
    btn.textContent = saving ? label : "儲存";

    editor.querySelectorAll("[data-close]").forEach((el) => {
        el.disabled = saving;
    });
}


// =========================
// 小工具
// =========================

function nextSortOrder(){

    const max =
        Math.max(0, ...items.map((item) => item.sort_order));

    return max + 10;
}


function toLines(text){

    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
}


function getExtension(name){

    return name.split(".").pop().toLowerCase();
}


function today(){

    // 用本地時區，避免台灣早上 8 點前變成前一天
    const d = new Date();

    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0")
    ].join("-");
}


function showError(el, message){

    el.textContent = message;
    el.hidden = false;
}


let toastTimer;

function toast(message, isError = false){

    const el = $("toast");

    el.textContent = message;
    el.classList.toggle("is-error", isError);
    el.hidden = false;

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, isError ? 5000 : 2500);
}


function escapeHtml(value = ""){

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

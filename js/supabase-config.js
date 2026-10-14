// =========================
// Supabase 連線設定
// 前台下載頁與 /admin/ 後台共用
//
// publishable key 本來就是公開給瀏覽器用的，可以放在前端；
// 資料安全靠資料庫的 RLS 權限（見 supabase/schema.sql）。
// 絕對不要把 secret / service_role key 放進這個專案。
// =========================

export const SUPABASE_URL =
    "https://mxyzrbxqoqrvbflekvhd.supabase.co";

export const SUPABASE_KEY =
    "sb_publishable_uJfCbwjeVn70JdLRg-rj4A_P5AReOWU";

export const DOWNLOAD_BUCKET =
    "downloads";


// 取得 Storage 檔案的公開網址
export function getFileUrl(path){

    const encodedPath =
        path
            .split("/")
            .map(encodeURIComponent)
            .join("/");

    return `${SUPABASE_URL}/storage/v1/object/public/${DOWNLOAD_BUCKET}/${encodedPath}`;
}


// 把位元組數換算成 KB / MB 顯示文字
export function formatFileSize(bytes){

    if(!Number.isFinite(bytes) || bytes <= 0) return "";

    if(bytes < 1024 * 1024){

        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const previewArea = document.getElementById("previewArea");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");
const toast = document.getElementById("toast");

let sourceURL = null;
let gifData = null;
let baseFileName = "image";

/* Drag & Drop */
dropzone.addEventListener("dragover", e => e.preventDefault());
dropzone.addEventListener("drop", e => {
  e.preventDefault();
  handleFile(e.dataTransfer.files[0]);
});

/* File select */
input.addEventListener("change", () => {
  handleFile(input.files[0]);
});

/* ファイル選択時 → 即変換 */
function handleFile(file) {
  if (!file) return;

  baseFileName = file.name.replace(/\.[^/.]+$/, "");
  sourceURL = URL.createObjectURL(file);

  // プレビュー
  preview.src = sourceURL;

  // UI状態
  dropzone.hidden = true;
  previewArea.hidden = false;
  downloadBtn.hidden = true;
  gifData = null;

  // 自動GIF変換
  gifshot.createGIF(
    {
      images: [sourceURL],
      interval: 1,
      background: "rgba(0,0,0,0)" // 透過保持
    },
    result => {
      if (result.error) {
        alert("GIF変換に失敗しました");
        return;
      }

      gifData = result.image;
      downloadBtn.hidden = false;
    }
  );
}

/* Download */
downloadBtn.addEventListener("click", () => {
  if (!gifData) return;

  const a = document.createElement("a");
  a.href = gifData;
  a.download = `${baseFileName}_gifconvert.gif`;
  a.click();

  showToast();
});

/* Toast */
function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const previewArea = document.getElementById("previewArea");
const preview = document.getElementById("preview");
const convertBtn = document.getElementById("convertBtn");
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

function handleFile(file) {
  if (!file) return;

  baseFileName = file.name.replace(/\.[^/.]+$/, "");
  sourceURL = URL.createObjectURL(file);

  preview.src = sourceURL;
  dropzone.hidden = true;
  previewArea.hidden = false;

  // ★ ここが重要
  convertBtn.hidden = false;   // 画像選択後に表示
  downloadBtn.hidden = true;   // まだ変換してないので隠す
  gifData = null;
}

/* Convert */
convertBtn.addEventListener("click", () => {
  if (!sourceURL) return;

  convertBtn.disabled = true;
  convertBtn.textContent = "変換中…";

  gifshot.createGIF(
    {
      images: [sourceURL],
      interval: 1,
      background: "rgba(0,0,0,0)"
    },
    result => {
      convertBtn.disabled = false;
      convertBtn.textContent = "Convert";

      if (result.error) {
        alert("GIF変換に失敗しました");
        return;
      }

      gifData = result.image;
      downloadBtn.hidden = false;
    }
  );
});

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

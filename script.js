const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const previewArea = document.getElementById("previewArea");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

let sourceURL = null;
let baseFileName = "image"; // デフォルト

dropzone.addEventListener("dragover", e => {
  e.preventDefault();
});

dropzone.addEventListener("drop", e => {
  e.preventDefault();
  handleFile(e.dataTransfer.files[0]);
});

input.addEventListener("change", () => {
  handleFile(input.files[0]);
});

function handleFile(file) {
  if (!file) return;

  // 拡張子を除いたファイル名を取得
  baseFileName = file.name.replace(/\.[^/.]+$/, "");

  sourceURL = URL.createObjectURL(file);
  preview.src = sourceURL;

  dropzone.hidden = true;
  previewArea.hidden = false;
}

downloadBtn.addEventListener("click", () => {
  if (!sourceURL) return;

  gifshot.createGIF(
    { images: [sourceURL], interval: 1 },
    result => {
      if (result.error) {
        alert("GIF変換に失敗しました");
        return;
      }

      const a = document.createElement("a");
      a.href = result.image;
      a.download = `${baseFileName}_gifconvert.gif`;
      a.click();
    }
  );
});

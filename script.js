const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");
const result = document.getElementById("result");
const downloadBtn = document.getElementById("downloadBtn");

let gifBlob = null;

// クリックでファイル選択
dropArea.addEventListener("click", () => {
  fileInput.click();
});

// ファイル選択
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// ドラッグ中
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#333";
});

// 離脱
dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#bbb";
});

// ドロップ
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#bbb";

  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

// メイン処理
function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    status.textContent = "画像ファイルを選んでください";
    return;
  }

  status.textContent = "変換中…";
  downloadBtn.style.display = "none";
  result.src = "";
  gifBlob = null;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        gifBlob = blob;
        const url = URL.createObjectURL(blob);
        result.src = url;

        status.textContent = "完了！GIFとしてダウンロードできます";
        downloadBtn.style.display = "inline-block";
      },
      "image/gif"
    );
  };

  img.src = URL.createObjectURL(file);
}

// ダウンロード
downloadBtn.addEventListener("click", () => {
  if (!gifBlob) return;

  const filename = `${originalName}_gifconvert.gif`;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(gifBlob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
});

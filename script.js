const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");
const result = document.getElementById("result");

// 初期表示
status.textContent = "画像を選択してください";

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

// D&D 対策
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#333";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.borderColor = "#bbb";
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.style.borderColor = "#bbb";

  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    status.textContent = "画像ファイルを選んでください";
    return;
  }

  status.textContent = "変換中…";

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

  const downloadBtn = document.getElementById("downloadBtn");

  let gifBlob = null;
  
  // canvas.toBlob 部分を置き換え
  canvas.toBlob(
    (blob) => {
      gifBlob = blob;
  
      const url = URL.createObjectURL(blob);
      result.src = url;
  
      downloadBtn.style.display = "inline-block";
      status.textContent = "完了！GIFとしてダウンロードできます";
    },
    "image/gif"
  );
  
  // ダウンロード処理
  downloadBtn.onclick = () => {
    if (!gifBlob) return;
  
    const a = document.createElement("a");
    a.href = URL.createObjectURL(gifBlob);
    a.download = "converted.gif";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  
    img.src = URL.createObjectURL(file);
  }

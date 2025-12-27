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

    // GIFとして出力
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        result.src = url;
        status.textContent = "完了！右クリックで保存できます";
      },
      "image/gif"
    );
  };

  img.src = URL.createObjectURL(file);
}

document.addEventListener('DOMContentLoaded', () => {

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  let outputURL = null;

  // クリックでファイル選択
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  // ドラッグ中
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('drag');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag');
  });

  // ドロップ
  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('drag');
    handleFile(e.dataTransfer.files[0]);
  });

  // ファイル選択
  fileInput.addEventListener('change', () => {
    handleFile(fileInput.files[0]);
  });

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    statusEl.textContent = '変換中…';
    previewEl.innerHTML = '';
    downloadBtn.style.display = 'none';

    try {
      outputURL = await imageToWebP(file);

      const img = document.createElement('img');
      img.src = outputURL;
      previewEl.appendChild(img);

      statusEl.textContent = '変換完了';
      downloadBtn.style.display = 'inline-block';

      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = outputURL;
        a.download = 'image.webp';
        a.click();
      };

    } catch (err) {
      console.error(err);
      statusEl.textContent = '変換失敗';
    }
  }
});

/* ===== Image → WebP（完全ブラウザ対応） ===== */
async function imageToWebP(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(URL.createObjectURL(blob));
    }, 'image/webp', 0.95);
  });
}

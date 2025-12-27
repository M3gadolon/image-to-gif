document.addEventListener('DOMContentLoaded', () => {

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  let gifDataUrl = null;

  /* クリックで選択 */
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  /* ドラッグ */
  dropzone.addEventListener('dragover', e => {
    e.preventDefault();
    dropzone.classList.add('drag');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag');
  });

  dropzone.addEventListener('drop', e => {
    e.preventDefault();
    dropzone.classList.remove('drag');
    handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    handleFile(fileInput.files[0]);
  });

  async function handleFile(file) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    statusEl.textContent = 'GIF 変換中…';
    previewEl.innerHTML = '';
    downloadBtn.style.display = 'none';

    try {
      gifDataUrl = await imageToGif(file);

      const img = document.createElement('img');
      img.src = gifDataUrl;
      previewEl.appendChild(img);

      statusEl.textContent = '変換完了';
      downloadBtn.style.display = 'inline-block';

      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = gifDataUrl;
        a.download = file.name.replace(/\.[^/.]+$/, '') + '_gifconvert.gif';
        a.click();
      };

    } catch (err) {
      console.error(err);
      statusEl.textContent = '変換失敗';
    }
  }
});

/* =========================
   GIF生成（静止画1枚）
   ========================= */
async function imageToGif(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d', {
    willReadFrequently: true
  });

  ctx.drawImage(img, 0, 0);

  const encoder = new GIFEncoder();
  encoder.setRepeat(0);   // ループ
  encoder.setDelay(1000); // 表示時間
  encoder.start();

  encoder.addFrame(ctx);
  encoder.finish();

  const binary = encoder.stream().getData();
  const base64 = btoa(binary);

  return 'data:image/gif;base64,' + base64;
}

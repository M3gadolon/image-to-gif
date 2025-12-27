document.addEventListener('DOMContentLoaded', () => {

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  let gifURL = null;

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

    statusEl.textContent = 'GIF 変換中…';
    previewEl.innerHTML = '';
    downloadBtn.style.display = 'none';

    try {
      gifURL = await imageToGif(file);

      const img = document.createElement('img');
      img.src = gifURL;
      previewEl.appendChild(img);

      statusEl.textContent = '変換完了';
      downloadBtn.style.display = 'inline-block';

      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = gifURL;
        a.download = 'image.gif';
        a.click();
      };

    } catch (err) {
      console.error(err);
      statusEl.textContent = '変換失敗';
    }
  }
});

/* ===== GIF生成（ffmpeg 不使用） ===== */
async function imageToGif(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  const encoder = new GIFEncoder(img.width, img.height);
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);
  encoder.start();

  ctx.drawImage(img, 0, 0);
  encoder.addFrame(ctx);

  encoder.finish();

  const blob = new Blob(
    [encoder.out.getData()],
    { type: 'image/gif' }
  );

  return URL.createObjectURL(blob);
}

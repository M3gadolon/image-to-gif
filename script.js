document.addEventListener('DOMContentLoaded', () => {

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  let gifURL = null;
  let originalName = 'image';

  dropzone.addEventListener('click', () => fileInput.click());

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
    if (!file || !file.type.startsWith('image/')) return;

    originalName = file.name.replace(/\.[^.]+$/, '');

    statusEl.textContent = 'GIF変換中…';
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
        a.download = `${originalName}_gifconvert.gif`;
        a.click();
      };

    } catch (e) {
      console.error(e);
      statusEl.textContent = '変換失敗';
    }
  }
});

/* ===== Image → GIF（ffmpegなし） ===== */
async function imageToGif(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const encoder = new GIFEncoder(img.width, img.height);
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);
  encoder.start();

  encoder.addFrame(ctx);
  encoder.finish();

  const buffer = encoder.out.getData();
  const blob = new Blob([buffer], { type: 'image/gif' });

  return URL.createObjectURL(blob);
}

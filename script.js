document.addEventListener('DOMContentLoaded', () => {
  const { createFFmpeg, fetchFile } = FFmpeg;

  // SharedArrayBuffer を使わない旧 core を指定
  const ffmpeg = createFFmpeg({
    log: false,
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js"
  });

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  let gifURL = null;

  dropzone.onclick = () => fileInput.click();

  dropzone.ondragover = e => {
    e.preventDefault();
    dropzone.classList.add('drag');
  };

  dropzone.ondragleave = () => dropzone.classList.remove('drag');

  dropzone.ondrop = e => {
    e.preventDefault();
    dropzone.classList.remove('drag');
    handleFile(e.dataTransfer.files[0]);
  };

  fileInput.onchange = () => handleFile(fileInput.files[0]);

  async function handleFile(file) {
    if(!file) return;

    statusEl.textContent = '読み込み中…';
    previewEl.innerHTML = '';
    downloadBtn.style.display = 'none';

    if(!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    statusEl.textContent = 'GIF変換中…';

    // 単一画像処理
    ffmpeg.FS('writeFile', 'input.png', await fetchFile(file));
    await ffmpeg.run('-i','input.png','output.gif');

    const data = ffmpeg.FS('readFile','output.gif');
    const blob = new Blob([data.buffer], {type:'image/gif'});
    gifURL = URL.createObjectURL(blob);

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
  }
});

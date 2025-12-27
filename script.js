const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.addEventListener('DOMContentLoaded', () => {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  dropzone.onclick = () => fileInput.click();

  dropzone.ondragover = e => {
    e.preventDefault();
    dropzone.classList.add('drag');
  };

  dropzone.ondragleave = () => {
    dropzone.classList.remove('drag');
  };

  dropzone.ondrop = e => {
    e.preventDefault();
    dropzone.classList.remove('drag');
    handleFile(e.dataTransfer.files[0]);
  };

  fileInput.onchange = () => {
    handleFile(fileInput.files[0]);
  };

  async function handleFile(file) {
    if (!file) return;

    statusEl.textContent = 'ffmpeg 読み込み中…';

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    statusEl.textContent = 'GIF 変換中…';

    ffmpeg.FS('writeFile', 'input.png', await fetchFile(file));

    await ffmpeg.run(
      '-i', 'input.png',
      '-vf', 'scale=iw:ih',
      'output.gif'
    );

    const data = ffmpeg.FS('readFile', 'output.gif');
    const gifBlob = new Blob([data.buffer], { type: 'image/gif' });
    const gifURL = URL.createObjectURL(gifBlob);

    previewEl.innerHTML = '';
    const img = document.createElement('img');
    img.src = gifURL;
    previewEl.appendChild(img);

    downloadBtn.style.display = 'inline-block';
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = gifURL;
      a.download = file.name.replace(/\.\w+$/, '') + '_gifconvert.gif';
      a.click();
    };

    statusEl.textContent = '変換完了';
  }
});

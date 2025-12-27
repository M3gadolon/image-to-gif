document.addEventListener('DOMContentLoaded', () => {

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const statusEl = document.getElementById('status');
  const previewEl = document.getElementById('preview');
  const downloadBtn = document.getElementById('downloadBtn');

  let gifURL = null;
  let baseName = 'image';

  // クリック
  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  // ドラッグ
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

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }

    baseName = file.name.replace(/\.[^.]+$/, '');

    statusEl.textContent = 'GIF変換中…';
    previewEl.innerHTML = '';
    downloadBtn.style.display = 'none';

    const reader = new FileReader();
    reader.onload = () => {

      // ★ gifshotのみ使用
      gifshot.createGIF({
        images: [reader.result],
        numFrames: 1,
        interval: 1
      }, result => {

        if (result.error) {
          console.error(result.error);
          statusEl.textContent = '変換失敗';
          return;
        }

        gifURL = result.image;

        const img = document.createElement('img');
        img.src = gifURL;
        previewEl.appendChild(img);

        statusEl.textContent = '変換完了';
        downloadBtn.style.display = 'inline-block';

        downloadBtn.onclick = () => {
          const a = document.createElement('a');
          a.href = gifURL;
          a.download = `${baseName}_gifconvert.gif`;
          a.click();
        };
      });
    };

    reader.readAsDataURL(file);
  }
});

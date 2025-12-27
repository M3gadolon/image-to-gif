const { createFFmpeg, fetchFile } = FFmpeg;

// ffmpeg フォルダ指定
const CORE_PATH = './ffmpeg/ffmpeg-core.js';
const WASM_PATH = './ffmpeg/ffmpeg-core.wasm';

// window に公開（デバッグしやすくする）
window.ffmpeg = createFFmpeg({
  log: true,
  corePath: CORE_PATH
});

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const statusEl = document.getElementById('status');
const previewEl = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let gifURL = null;

/* =====================
   UI イベント
===================== */
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

/* =====================
   メイン処理（ffmpeg）
===================== */
async function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert('画像ファイルを選択してください');
    return;
  }

  statusEl.textContent = 'ffmpeg 読み込み中…';
  previewEl.innerHTML = '';
  downloadBtn.style.display = 'none';

  // ffmpeg 初回ロード
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load({
      coreURL: CORE_PATH,
      wasmURL: WASM_PATH
    });
  }

  statusEl.textContent = 'GIF 変換中…';

  // 入力 → 出力
  ffmpeg.FS('writeFile', 'input.png', await fetchFile(file));
  await ffmpeg.run('-i', 'input.png', 'output.gif');

  const data = ffmpeg.FS('readFile', 'output.gif');
  const blob = new Blob([data.buffer], { type: 'image/gif' });
  gifURL = URL.createObjectURL(blob);

  const img = document.createElement('img');
  img.src = gifURL;
  previewEl.appendChild(img);

  statusEl.textContent = '変換完了';
  downloadBtn.style.display = 'inline-block';

  downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = gifURL;
    a.download =
      file.name.replace(/\.[^.]+$/, '') + '_gifconvert.gif';
    a.click();
  };
}

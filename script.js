import { FFmpeg } from "https://unpkg.com/@ffmpeg/ffmpeg@0.12.6/dist/esm/index.js";
import { fetchFile } from "https://unpkg.com/@ffmpeg/util@0.12.1/dist/esm/index.js";

const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const status = document.getElementById("status");
const resultImg = document.getElementById("result");

/* =========================
   ブラウザの標準D&D無効化
========================= */
document.addEventListener("dragover", e => e.preventDefault());
document.addEventListener("drop", e => e.preventDefault());

/* =========================
   クリック → ファイル選択
========================= */
dropArea.addEventListener("click", () => {
  fileInput.click();
});

/* =========================
   ドラッグ＆ドロップ
========================= */
dropArea.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

/* =========================
   ファイル選択
========================= */
fileInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

/* =========================
   FFmpeg 初期化
========================= */
const ffmpeg = new FFmpeg();

async function initFFmpeg() {
  status.textContent = "FFmpeg 読み込み中…";

  await ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.6/dist/ffmpeg-core.wasm"
  });

  status.textContent = "準備完了";
}

initFFmpeg();

/* =========================
   画像 → GIF 変換処理
========================= */
async function handleFile(file) {
  status.textContent = "変換中…";
  resultImg.src = "";

  await ffmpeg.writeFile("input.png", await fetchFile(file));

  await ffmpeg.exec([
    "-i", "input.png",
    "-vf", "fps=10,scale=320:-1:flags=lanczos",
    "output.gif"
  ]);

  const data = await ffmpeg.readFile("output.gif");
  const blob = new Blob([data.buffer], { type: "image/gif" });
  const url = URL.createObjectURL(blob);

  resultImg.src = url;
  status.textContent = "変換完了";
}

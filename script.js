const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: false });

const drop = document.getElementById("drop");
const result = document.getElementById("result");

/* =========================
   ブラウザのデフォルトD&Dを無効化
   ========================= */
["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
  document.addEventListener(event, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

/* =========================
   クリックでファイル選択
   ========================= */
drop.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg";
  input.onchange = () => convert(input.files[0]);
  input.click();
});

/* =========================
   ドラッグ中UI
   ========================= */
drop.addEventListener("dragover", () => {
  drop.classList.add("drag");
});

drop.addEventListener("dragleave", () => {
  drop.classList.remove("drag");
});

/* =========================
   ドロップ処理
   ========================= */
drop.addEventListener("drop", e => {
  drop.classList.remove("drag");
  const file = e.dataTransfer.files[0];
  convert(file);
});

/* =========================
   変換処理
   ========================= */
async function convert(file) {
  if (!file) return;

  drop.textContent = "変換中… 少し待ってください";

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  ffmpeg.FS("writeFile", "input.png", await fetchFile(file));

  await ffmpeg.run(
    "-i", "input.png",
    "-vf", "palettegen",
    "palette.png"
  );

  await ffmpeg.run(
    "-i", "input.png",
    "-i", "palette.png",
    "-lavfi", "paletteuse",
    "output.gif"
  );

  const data = ffmpeg.FS("readFile", "output.gif");
  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "image/gif" })
  );

  result.src = url;
  result.style.display = "block";

  drop.textContent = "画像をドラッグ＆ドロップ\nまたはクリック";
}

window.addEventListener("DOMContentLoaded", () => {

  if (typeof FFmpeg === "undefined") {
    alert("FFmpegの読み込みに失敗しています");
    return;
  }

  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: false });

  const drop = document.getElementById("drop");
  const result = document.getElementById("result");

  /* ブラウザのD&D無効化 */
  ["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
    document.addEventListener(event, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  /* クリック */
  drop.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg";
    input.onchange = () => convert(input.files[0]);
    input.click();
  });

  /* ドラッグ */
  drop.addEventListener("dragover", () => {
    drop.classList.add("drag");
  });

  drop.addEventListener("dragleave", () => {
    drop.classList.remove("drag");
  });

  drop.addEventListener("drop", e => {
    drop.classList.remove("drag");
    convert(e.dataTransfer.files[0]);
  });

  async function convert(file) {
    if (!file) return;

    drop.textContent = "変換中…";

    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    ffmpeg.FS("writeFile", "input.png", await fetchFile(file));

    await ffmpeg.run("-i", "input.png", "output.gif");

    const data = ffmpeg.FS("readFile", "output.gif");
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );

    result.src = url;
    result.style.display = "block";
    drop.textContent = "画像をドラッグ＆ドロップ\nまたはクリック";
  }

});

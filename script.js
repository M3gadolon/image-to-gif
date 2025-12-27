const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: false });

const drop = document.getElementById("drop");
const result = document.getElementById("result");

drop.onclick = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg";
  input.onchange = () => convert(input.files[0]);
  input.click();
};

drop.ondragover = e => {
  e.preventDefault();
  drop.classList.add("drag");
};

drop.ondragleave = () => drop.classList.remove("drag");

drop.ondrop = e => {
  e.preventDefault();
  drop.classList.remove("drag");
  convert(e.dataTransfer.files[0]);
};

async function convert(file) {
  if (!file) return;

  drop.textContent = "変換中… 少し待ってください";

  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  ffmpeg.FS("writeFile", "input.png", await fetchFile(file));

  await ffmpeg.run(
    "-i", "input.png",
    "-vf", "palettegen=stats_mode=diff",
    "palette.png"
  );

  await ffmpeg.run(
    "-i", "input.png",
    "-i", "palette.png",
    "-lavfi", "paletteuse=dither=sierra2_4a",
    "output.gif"
  );

  const data = ffmpeg.FS("readFile", "output.gif");
  const url = URL.createObjectURL(new Blob([data.buffer], { type: "image/gif" }));
  result.src = url;

  drop.textContent = "ここに画像をドラッグ＆ドロップ\nまたはクリック";
}

const input = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const previewArea = document.getElementById("previewArea");
const preview = document.getElementById("preview");
const downloadBtn = document.getElementById("downloadBtn");

let gifData = null;

dropzone.addEventListener("dragover", e => {
  e.preventDefault();
});

dropzone.addEventListener("drop", e => {
  e.preventDefault();
  handleFile(e.dataTransfer.files[0]);
});

input.addEventListener("change", () => {
  handleFile(input.files[0]);
});

function handleFile(file) {
  if (!file) return;

  const url = URL.createObjectURL(file);

  gifshot.createGIF(
    { images: [url], interval: 1 },
    result => {
      if (result.error) return;

      gifData = result.image;
      preview.src = gifData;

      dropzone.hidden = true;
      previewArea.hidden = false;
    }
  );
}

downloadBtn.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = gifData;
  a.download = "converted.gif";
  a.click();
});

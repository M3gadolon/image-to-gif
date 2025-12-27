const input = document.getElementById("fileInput");
const dropzone = document.querySelector(".dropzone");

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
    {
      images: [url],
      interval: 1
    },
    result => {
      if (result.error) return;

      const a = document.createElement("a");
      a.href = result.image;
      a.download = "converted.gif";
      a.click();
    }
  );
}

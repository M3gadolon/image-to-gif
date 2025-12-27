const imageInput = document.getElementById("imageInput");
const convertBtn = document.getElementById("convertBtn");
const gifPreview = document.getElementById("gifPreview");
const downloadLink = document.getElementById("downloadLink");

let imageURL = null;

imageInput.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  imageURL = URL.createObjectURL(file);
});

convertBtn.addEventListener("click", () => {
  if (!imageURL) return alert("画像を選択してください");

  const frameCount = Number(document.getElementById("frameCount").value);
  const delay = Number(document.getElementById("delay").value);

  const images = Array(frameCount).fill(imageURL);

  gifshot.createGIF(
    {
      images,
      interval: delay / 1000,
      gifWidth: 400,
      gifHeight: 400
    },
    result => {
      if (!result.error) {
        gifPreview.src = result.image;
        downloadLink.href = result.image;
      }
    }
  );
});

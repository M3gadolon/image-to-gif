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
  if (!imageURL) {
    alert("画像を選択してください");
    return;
  }

  gifshot.createGIF(
    {
      images: [imageURL], // 1枚だけ
      interval: 1          // 実質静止画GIF
    },
    result => {
      if (!result.error) {
        gifPreview.src = result.image;
        downloadLink.href = result.image;
      }
    }
  );
});

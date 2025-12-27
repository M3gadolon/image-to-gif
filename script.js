async function imageToGif(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  const encoder = new GIFEncoder(img.width, img.height);
  encoder.setRepeat(0);
  encoder.setDelay(100);
  encoder.setQuality(10);
  encoder.start();

  ctx.drawImage(img, 0, 0);
  encoder.addFrame(ctx);

  encoder.finish();

  const blob = new Blob([encoder.out.getData()], { type: 'image/gif' });
  return URL.createObjectURL(blob);
}

/**
 * [图片压缩]
 * @param  {Image} img       图片
 * @param  {string} fileType 图片类型
 * @param  {number} width    宽度
 * @param  {number} height   高度
 * @return {object}          imgPath:文件路径; canvas:用于压缩生成的canvas，返回用于调用toBlob上传;
 */
let EXIF = window.EXIF;
const compressAndRotate = (img, fileType, width, height, orientation) => {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, width, height);

  if (orientation != "" && orientation != 1 && orientation != undefined) {
    switch (orientation) {
      case 6://需要顺时针90度旋转
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(img, 0, -height, width, height);
        break;
      case 8://需要逆时针90度旋转
        canvas.width = height;
        canvas.height = width;
        ctx.rotate(-90 * Math.PI / 180);
        ctx.drawImage(img, -width, 0, width, height);
        break;
      case 3://需要180度旋转
        ctx.rotate(180 * Math.PI / 180);
        ctx.drawImage(img, -width, -height, width, height);
        break;
    }
  }
  // 压缩
  var base64data = canvas.toDataURL(fileType);
  return {imgPath: base64data, canvas: canvas}
}

/**
 * 读取文件
 * @param  {file} file        文件
 * @param  {number} maxSize   文件大小上限
 * @param  {number} maxLength 图片宽高最大值
 * @return {promise} (imgPath:文件路径; canvas:用于压缩生成的canvas，返回用于调用toBlob上传; typeError: 文件类型是否错误)
 */
const readFile = (file, maxSize, maxLength) => {
  // 接受 jpeg, jpg, png 类型的图片
  if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) {
    return new Promise().resolve({filePath: null, canvas: null, typeError: true});
  }

  let orientation = null;
  EXIF.getData(file, function () {
    EXIF.getAllTags(this);
    orientation = EXIF.getTag(this, 'Orientation');
  });

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      var result = this.result;
      var img = new Image();
      img.src = result;

      img.onload = function () {
        const width = img.width,
          height = img.height;
        // 如果图片小于设置最大size，不压缩
        // if (result.length <= maxSize && width <= maxLength && height <= maxLength) {
        //   resolve({imgPath:result, canvas: null, typeError: false});
        // }else {
        let scale = Math.max(width, height) / maxLength;
        scale = scale < 1 ? 1 : scale;
        resolve({...compressAndRotate(img, file.type, width / scale, height / scale, orientation), typeError: false});
        // }
      };
    };
  })
}

export {
  readFile
}

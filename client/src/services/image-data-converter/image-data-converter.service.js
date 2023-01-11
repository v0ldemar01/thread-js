class ImageDataConverter {
  getByteString(dataURI) {
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = decodeURI(dataURI.split(',')[1]);
    }
    return byteString;
  }

  getMimeString(dataURI) {
    return dataURI.split(',')[0].split(':')[1].split(';')[0];
  }

  convertToTypedArray(dataURI) {
    const byteString = this.getByteString(dataURI);
    const ia = new Uint8Array(byteString.length)
      .map((_, index) => byteString.charCodeAt(index));

    return ia;
  }

  dataURItoBlob(dataURI) {
    const mimeString = this.getMimeString(dataURI);
    const intArray = this.convertToTypedArray(dataURI);
    return new Blob([intArray], { type: mimeString });
  }
}

export { ImageDataConverter };

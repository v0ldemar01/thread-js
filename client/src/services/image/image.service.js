import { ApiPath, HttpMethod } from 'common/enums/enums';

class Image {
  constructor({ apiPath, http, imageDataConverter }) {
    this._apiPath = apiPath;
    this._http = http;
    this._imageDataConverter = imageDataConverter;
  }

  uploadImage(image) {
    const formData = new FormData();

    formData.append('image', image);

    return this._http.load(`${this._apiPath}${ApiPath.IMAGES}`, {
      method: HttpMethod.POST,
      payload: formData
    });
  }

  uploadImageDataUrl(imageDataUrl) {
    const imageBlob = this._imageDataConverter.dataURItoBlob(imageDataUrl);

    return this.uploadImage(imageBlob);
  }
}

export { Image };

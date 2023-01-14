import {
  ApiPath,
  HttpMethod,
  ImagesApiPath,
  ControllerHook
} from '../../common/enums/enums.js';
import { getFullUrl } from '../../helpers/helpers.js';
import { upload } from '../../middlewares/middlewares.js';
import { Controller } from '../abstract/abstract.controller.js';

const initImage = ({ server }) => class Image extends Controller {
  #imageService;

  constructor({ apiPath, imageService }) {
    super({ apiPath });
    this.#imageService = imageService;
  }

  @server.route({
    method: HttpMethod.POST,
    url: getFullUrl(ApiPath.IMAGES, ImagesApiPath.ROOT),
    [ControllerHook.PRE_HANDLER]: upload.single('image'),
  })
  async upload(req) {
    return this.#imageService.upload(req.file);
  }
}

export { initImage };

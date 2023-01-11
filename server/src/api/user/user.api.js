import {
  HttpMethod,
  UsersApiPath,
  ControllerHook
} from '../../common/enums/enums.js';

const initUser = (fastify, opts, done) => {
  const { user: userService } = opts.services;

  fastify.route({
    method: HttpMethod.PUT,
    url: UsersApiPath.$ID,
    [ControllerHook.HANDLER]: async req => {
      const user = await userService.update(req.params.id, req.body);

      return user;
    }
  });

  done();
};

export { initUser };

class User {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async getUserById(id) {
    const user = await this._userRepository.getUserById(id);

    return user;
  }

  update(id, user) {
    return this._userRepository.update(id, { ...user });
  }
}

export { User };

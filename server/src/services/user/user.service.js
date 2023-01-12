class User {
  constructor({ userRepository }) {
    this._userRepository = userRepository;
  }

  async getUserById(id) {
    const user = await this._userRepository.getUserById(id);

    return user;
  }

  async getUserByEmail(email) {
    const user = await this._userRepository.getByEmail(email);

    return user;
  }

  update(id, user) {
    return this._userRepository.update(id, { ...user });
  }
}

export { User };

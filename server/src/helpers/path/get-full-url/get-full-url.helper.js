import path from 'node:path';

const getFullUrl = (...urls) => path.join(...urls);

export { getFullUrl };

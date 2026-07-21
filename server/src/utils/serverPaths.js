import path from 'path';
import { fileURLToPath } from 'url';

const currentFile = fileURLToPath(import.meta.url);
export const serverRoot = path.resolve(path.dirname(currentFile), '../..');

export const getStoredUploadPath = (filename) => path.join('uploads', filename);

export const resolveStoredUploadPath = (storedPath) => {
  if (!storedPath) {
    return storedPath;
  }

  const normalized = storedPath.replace(/\\/g, '/');
  if (path.isAbsolute(storedPath) || path.isAbsolute(normalized) || storedPath.startsWith('file://')) {
    return storedPath;
  }

  if (normalized.startsWith('server/')) {
    return path.resolve(serverRoot, normalized.replace(/^server\//, ''));
  }

  return path.resolve(serverRoot, normalized);
};

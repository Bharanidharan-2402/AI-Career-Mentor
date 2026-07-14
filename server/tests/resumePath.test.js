import path from 'path';
import { getStoredUploadPath, resolveStoredUploadPath, serverRoot } from '../src/utils/serverPaths.js';

describe('resume upload path helpers', () => {
  it('stores upload paths relative to the server root', () => {
    const storedPath = getStoredUploadPath('resume.pdf');

    expect(storedPath).toBe(path.join('uploads', 'resume.pdf'));
    expect(resolveStoredUploadPath(storedPath)).toBe(path.join(serverRoot, 'uploads', 'resume.pdf'));
  });

  it('keeps absolute paths unchanged', () => {
    const absolutePath = path.join(serverRoot, 'uploads', 'resume.pdf');

    expect(resolveStoredUploadPath(absolutePath)).toBe(absolutePath);
  });
});

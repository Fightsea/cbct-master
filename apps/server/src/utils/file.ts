import fs from 'fs';

export const deleteFile = (path: string) => fs.unlink(path, () => {});

export const deleteFiles = (paths: string[]) => paths.map(p => deleteFile(p));

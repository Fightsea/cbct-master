import bcrypt from 'bcrypt';

export const hashSync = (password: string): string => bcrypt.hashSync(password, 12);

export const compareSync = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);

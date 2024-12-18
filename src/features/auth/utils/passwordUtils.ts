import { pbkdf2, randomBytes } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const iterations = 100000;
  const keylen = 64;
  const digest = 'sha512';

  const hash = await pbkdf2Async(
    password,
    salt,
    iterations,
    keylen,
    digest
  );

  return `${salt}:${iterations}:${hash.toString('hex')}`;
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, iterations, hash] = hashedPassword.split(':');
  const keylen = 64;
  const digest = 'sha512';

  const newHash = await pbkdf2Async(
    password,
    salt,
    parseInt(iterations),
    keylen,
    digest
  );

  return newHash.toString('hex') === hash;
}
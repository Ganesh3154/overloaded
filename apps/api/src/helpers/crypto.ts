import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);

  return hash;
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

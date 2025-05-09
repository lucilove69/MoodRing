import { hashPassword } from '../src/utils/auth';

async function generateHash() {
  const password = 'admin123';
  const hash = await hashPassword(password);
  console.log('Password:', password);
  console.log('Hash:', hash);
}

generateHash().catch(console.error); 
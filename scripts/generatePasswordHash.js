import bcrypt from 'bcryptjs';

async function generateHashes() {
  const passwords = {
    admin: 'admin123',
    owner: 'owner123'
  };

  for (const [role, password] of Object.entries(passwords)) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    console.log(`${role.toUpperCase()} Password:`, password);
    console.log(`${role.toUpperCase()} Hash:`, hash);
    console.log('---');
  }
}

generateHashes().catch(console.error); 
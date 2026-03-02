import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.log("Usage: node scripts/gen-admin-hash.mjs <password>");
  process.exit(1);
}

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

console.log(
  JSON.stringify({ passwordSalt: salt, passwordHash: hash }, null, 2),
);

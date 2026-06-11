// Generate a bcrypt hash for a new admin password.
// Usage: npm run hash-password -- "your-new-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- \"your-new-password\"");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log("\nAdd this to server/data/admin.json as \"passwordHash\":\n");
console.log(hash);

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// This file has ONE job: load the environment variables.
const __filename = fileURLToPath(import.meta.url);

// This path goes from /src/server/config -> /src/server -> /src -> /backend (root)
// The previous calculation was off by one level. This is the correct path.
const envPath = path.resolve(__filename, '../../../../.env');


// Let's log the corrected path to be certain
console.log(`[CORRECTED PATH] Now looking for .env file at: ${envPath}`);

dotenv.config({ path: envPath });

// Final check
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('FATAL ERROR: JWT_SECRET is still not defined after dotenv config.');
} else {
  console.log('SUCCESS: JWT_SECRET has been loaded successfully.');
}
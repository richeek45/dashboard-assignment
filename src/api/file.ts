import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GET() {
  const usersPath = path.join(process.cwd(), 'sameple-data.json');
  const file = fs.readFileSync(usersPath);
  return new Response(file);
}
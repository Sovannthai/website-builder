import { readFileSync } from 'fs';
import { join } from 'path';
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
  console.log('env handler called');
  const filePath = join(process.cwd(), 'public', 'env.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents);
});

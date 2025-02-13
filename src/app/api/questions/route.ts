import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/data/questions.json');
  const jsonData = fs.readFileSync(filePath, 'utf-8');
  const questions = JSON.parse(jsonData);

  return NextResponse.json(questions);
}

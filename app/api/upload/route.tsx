// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs'; // Ensure the API route runs on the Node.js runtime

export async function POST(req: NextRequest) {
  try {
    // Ensure the request is a multipart/form-data request
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { message: 'Unsupported content type' },
        { status: 400 }
      );
    }

    // Read the form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Read the file data
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Insecurely save the file without validation
    const fileName = file.name || `${uuidv4()}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
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
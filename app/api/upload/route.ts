// /app/api/upload/route.js
import { NextResponse, NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

// Ensure we're using the Node.js runtime
export const runtime = 'nodejs';

interface FormDataFile {
  name: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
}


interface ExecResult {
  stdout: string;
  stderr: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const execAsync = promisify(exec);

  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' });
    }

    if (typeof file === 'string') {
      return NextResponse.json({ message: 'Invalid file uploaded.' });
    }
    const filename = (file as FormDataFile).name;
    const fileExt = path.extname(filename);

    // Read the file data into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    

    if (fileExt === '.sh') {
      // Save the file to a temporary directory
    const filePath = path.join('/tmp', filename);
    await fs.writeFile(filePath, buffer, 'binary');
      try {
        // Make the script executable
        await fs.chmod(filePath, 0o755);

        // Execute the script
        const { stdout, stderr }: ExecResult = await execAsync(`bash ${filePath}`);

        return NextResponse.json({
          message: 'File uploaded',
          output: stdout,
          errorOutput: stderr,
        });
      } catch (error) {
        return NextResponse.json({
          message: 'File Uploaded.',
          error: error instanceof Error ? error.message : 'An unknown error occurred',
        });
      }
    } else {
      // save the file to the uploads directory in the public folder
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer, 'binary');

      return NextResponse.json({
        message: 'file uploaded.',
        fileUrl: `/uploads/${filename}`,
      });
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ message: 'Error processing file.' });
  }
}
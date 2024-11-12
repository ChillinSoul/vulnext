// /app/api/upload/route.js
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

// Ensure we're using the Node.js runtime
export const runtime = 'nodejs';

export async function POST(req:any) {
  const execAsync = promisify(exec);

  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded.' });
    }

    const filename = file.name;
    const fileExt = path.extname(filename);

    // Read the file data into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the file to a temporary directory
    const filePath = path.join('/tmp', filename);
    await fs.writeFile(filePath, buffer, 'binary');

    if (fileExt === '.sh') {
      try {
        // Make the script executable
        await fs.chmod(filePath, 0o755);

        // Execute the script
        const { stdout, stderr } = await execAsync(`bash ${filePath}`);

        return NextResponse.json({
          message: 'File uploaded',
          output: stdout,
          errorOutput: stderr,
        });
      } catch (error:any) {
        return NextResponse.json({
          message: 'File Uploaded',
          error: error.message,
        });
      }
    } else {
      return NextResponse.json({
        message: 'File uploaded.',
      });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error processing file.' });
  }
}
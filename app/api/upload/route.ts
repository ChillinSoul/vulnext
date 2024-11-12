// /app/api/upload/route.js
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

// Ensure we're using the Node.js runtime
export const runtime = 'nodejs';

export async function POST(req: any) {
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

    const mimeType = file.type;
    if (mimeType !== 'application/x-sh' || !fileExt.endsWith('.sh')) {
      return NextResponse.json({ message: 'Only shell scripts are allowed.' });
    }

    // Read the file data into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const scriptsPath = path.join('/scripts', filename);
    await fs.writeFile(scriptsPath, buffer, 'binary');

    try {
      // Make the script executable
      await fs.chmod(scriptsPath, 0o755);

      // Execute the script
      const { stdout, stderr } = await execAsync(`bash ${scriptsPath}`);

      return NextResponse.json({
        message: 'File uploaded',
        output: stdout,
        errorOutput: stderr,
      });
    } catch (error: any) {
      return NextResponse.json({
        message: 'File Uploaded',
        error: error.message,
      });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error processing file.' });
  }
}

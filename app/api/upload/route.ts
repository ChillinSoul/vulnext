import { NextRequest, NextResponse } from 'next/server';
import multer, { diskStorage } from 'multer';
import { exec } from 'child_process';

interface NextApiRequestWithFile extends NextRequest {
    file: Express.Multer.File;
}

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads', // Assurez-vous que ce dossier existe.
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB
});

const handleFileUpload = (req: any) => new Promise((resolve, reject) => {
    const uploadSingle = upload.single('file');
    uploadSingle(req, {}, (error) => {
        console.log('req:', req);
        if (error) {
            console.log('Error during file upload:', error);
            reject(new Error('File upload error: ' + error.message));
        } else {
            if (!req.file) reject(new Error('No file uploaded. Please ensure a file is selected.'));
            resolve(req.file);
        }
    });
});

export async function POST(req: NextRequest) {
    try {
        const file = await handleFileUpload(req);
        if (!file) {
            console.log("Request Body:", req.body);
            return new NextResponse(JSON.stringify({ error: 'No file uploaded. Please ensure a file is selected.' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }

        const filePath = `public/uploads/${file.originalname}`;
        const output = await executeFile(filePath);
        return new NextResponse(JSON.stringify({ message: 'File executed successfully', output: output }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error("An error occurred during file upload:", error);
        return new NextResponse(JSON.stringify({ error: 'An error occurred: ' + error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}

const executeFile = async (filePath: string) => {
    return new Promise((resolve, reject) => {
        exec(`bash ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                reject(new Error('Execution failed: ' + stderr));
            } else {
                resolve(stdout);
            }
        });
    });
}

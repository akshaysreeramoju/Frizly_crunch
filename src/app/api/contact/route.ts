import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    // Write to a local JSON file for persistence since we don't have a DB yet
    const submissionsFile = path.join(process.cwd(), 'submissions.json');
    let submissions = [];
    
    try {
      const fileData = await fs.readFile(submissionsFile, 'utf-8');
      submissions = JSON.parse(fileData);
    } catch {
      // File doesn't exist yet, which is fine
    }

    submissions.push({
      ...data,
      date: new Date().toISOString()
    });

    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));

    console.log('New contact form submission:', data);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

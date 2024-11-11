import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all comments
export async function GET() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(comments);
}

// POST a new comment
export async function POST(req: NextRequest) {
  const { content } = await req.json();
  
  // Save the comment to the database
  const newComment = await prisma.comment.create({
    data: { content },
  });

  return NextResponse.json(newComment);
}

// DELETE a comment by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('id');

  if (!commentId) {
    return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return NextResponse.json({ message: 'Comment deleted' });
}
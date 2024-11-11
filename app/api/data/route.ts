import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const author = searchParams.get('author');

  try {
    const posts = await prisma.$queryRawUnsafe(
      `SELECT posts.title, posts.content, posts.authorId, users.username as author
       FROM posts
       JOIN users ON posts.authorId = users.id
       WHERE users.username = '${author}'`
    );

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
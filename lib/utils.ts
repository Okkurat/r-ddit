import { NextResponse } from 'next/server';
import Topic from '../models/topic';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const newTopic = new Topic({
      name,
    });

    const savedTopic = await newTopic.save();
    return NextResponse.json(savedTopic, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create topic', error: error.message }, { status: 500 });
  }
}

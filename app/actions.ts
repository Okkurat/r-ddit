'use server';

import connectDB from "@/lib/mongoose";
import Topic from "@/models/topic";

export async function createTopic(name: string) {
  try {
    await connectDB();

    if (!name) {
      return { error: 'Invalid input data' };
    }

    const newTopic = new Topic({
      name,
    });

    const savedTopic = await newTopic.save();

    return { savedTopic: { name: savedTopic.name, id: savedTopic.id.toString() } };
  } catch (error: any) {
    return { error: error.message || 'Failed to create topic' };
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: string;
  link: string;
  claimedBy: string | null;
  claimedAt: string | null;
}

export interface GiftList {
  id: string;
  name: string;
  creator: string;
  birthday: string;
  items: GiftItem[];
  createdAt: string;
}

async function readLists(): Promise<Record<string, GiftList>> {
  try {
    const lists = await kv.get('gift-lists');
    return lists as Record<string, GiftList> || {};
  } catch (error) {
    console.error('Error reading lists:', error);
    return {};
  }
}

async function writeLists(lists: Record<string, GiftList>) {
  try {
    await kv.set('gift-lists', lists);
  } catch (error) {
    console.error('Error writing lists:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, creator, birthday } = await request.json();
    
    if (!name || !creator || !birthday) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const listId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const newList: GiftList = {
      id: listId,
      name,
      creator,
      birthday,
      items: [],
      createdAt: new Date().toISOString()
    };

    const lists = await readLists();
    lists[listId] = newList;
    await writeLists(lists);

    return NextResponse.json(newList);
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
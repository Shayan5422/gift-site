import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { GiftList } from '../route';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lists = await readLists();
    const list = lists[id];
    
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updatedList = await request.json();
    const lists = await readLists();
    
    if (!lists[id]) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 });
    }

    lists[id] = { ...lists[id], ...updatedList };
    await writeLists(lists);

    return NextResponse.json(lists[id]);
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { GiftList } from '../route';

const DATA_DIR = path.join(process.cwd(), 'data');
const LISTS_FILE = path.join(DATA_DIR, 'lists.json');

async function readLists(): Promise<Record<string, GiftList>> {
  try {
    const data = await fs.readFile(LISTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeLists(lists: Record<string, GiftList>) {
  await fs.writeFile(LISTS_FILE, JSON.stringify(lists, null, 2));
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
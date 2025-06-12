import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), 'data');
const LISTS_FILE = path.join(DATA_DIR, 'lists.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readLists(): Promise<Record<string, GiftList>> {
  try {
    const data = await fs.readFile(LISTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeLists(lists: Record<string, GiftList>) {
  await ensureDataDir();
  await fs.writeFile(LISTS_FILE, JSON.stringify(lists, null, 2));
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
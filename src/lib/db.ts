import Dexie, { Table } from 'dexie';

export interface Message {
  id: number;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
  suggestions?: string[];
}

export class ChatDatabase extends Dexie {
  messages!: Table<Message>;

  constructor() {
    super('ChatDatabase');
    this.version(1).stores({
      messages: '++id, type, timestamp'
    });
  }
}

export const db = new ChatDatabase();
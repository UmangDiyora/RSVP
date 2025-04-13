export type RsvpStatus = 'Yes' | 'No' | 'Maybe';

export interface Player {
  id: string;
  name: string;
  email: string;
}

export interface RsvpEntry {
  player: Player;
  status: RsvpStatus;
  respondedAt: Date;
}

export interface RsvpCounts {
  total: number;
  confirmed: number;
  declined: number;
  maybe: number;
}

export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, error?: Error, ...args: any[]): void;
}
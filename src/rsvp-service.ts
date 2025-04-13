import { Player, RsvpEntry, RsvpStatus, RsvpCounts, Logger } from './types';

export class RsvpService {
  private rsvpEntries: Map<string, RsvpEntry> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Add or update a player's RSVP status
   * @param player The player to update
   * @param status The RSVP status
   * @returns The updated RSVP entry
   */
  public addOrUpdateRsvp(player: Player, status: RsvpStatus): RsvpEntry {
    if (!player.id) {
      this.logger.error('Cannot add RSVP: player is missing an ID');
      throw new Error('Player ID is required');
    }

    const entry: RsvpEntry = {
      player,
      status,
      respondedAt: new Date(),
    };

    this.rsvpEntries.set(player.id, entry);
    this.logger.info(`RSVP updated for player ${player.name} (${player.id}): ${status}`);
    
    return entry;
  }

  /**
   * Get a list of all confirmed attendees
   * @returns Array of RSVP entries with 'Yes' status
   */
  public getConfirmedAttendees(): RsvpEntry[] {
    return this.filterRsvpsByStatus('Yes');
  }

  /**
   * Get a list of all declined attendees
   * @returns Array of RSVP entries with 'No' status
   */
  public getDeclinedAttendees(): RsvpEntry[] {
    return this.filterRsvpsByStatus('No');
  }

  /**
   * Get a list of all tentative attendees
   * @returns Array of RSVP entries with 'Maybe' status
   */
  public getTentativeAttendees(): RsvpEntry[] {
    return this.filterRsvpsByStatus('Maybe');
  }

  /**
   * Get all RSVP entries
   * @returns Array of all RSVP entries
   */
  public getAllRsvps(): RsvpEntry[] {
    return Array.from(this.rsvpEntries.values());
  }

  /**
   * Count the number of total, confirmed, and declined responses
   * @returns An object containing counts for each category
   */
  public getRsvpCounts(): RsvpCounts {
    const entries = this.getAllRsvps();
    
    return {
      total: entries.length,
      confirmed: this.countRsvpsByStatus(entries, 'Yes'),
      declined: this.countRsvpsByStatus(entries, 'No'),
      maybe: this.countRsvpsByStatus(entries, 'Maybe'),
    };
  }

  /**
   * Initialize the service with existing RSVP entries
   * @param entries Array of RSVP entries to initialize with
   */
  public initializeWithEntries(entries: RsvpEntry[]): void {
    if (!entries || !Array.isArray(entries)) {
      this.logger.error('Cannot initialize: entries must be an array');
      return;
    }

    // Clear existing entries
    this.rsvpEntries.clear();
    
    // Add all valid entries
    entries.forEach(entry => {
      if (entry.player && entry.player.id) {
        this.rsvpEntries.set(entry.player.id, entry);
      } else {
        this.logger.error('Skipping invalid RSVP entry: missing player ID');
      }
    });
    
    this.logger.info(`Initialized with ${this.rsvpEntries.size} RSVP entries`);
  }

  /**
   * Get a player's current RSVP status
   * @param playerId The ID of the player
   * @returns The RSVP entry or undefined if not found
   */
  public getPlayerRsvp(playerId: string): RsvpEntry | undefined {
    return this.rsvpEntries.get(playerId);
  }

  /**
   * Filter RSVP entries by status
   * @param status The status to filter by
   * @returns Array of RSVP entries with the specified status
   */
  private filterRsvpsByStatus(status: RsvpStatus): RsvpEntry[] {
    return Array.from(this.rsvpEntries.values()).filter(
      entry => entry.status === status
    );
  }

  /**
   * Count RSVP entries with a specific status
   * @param entries Array of RSVP entries
   * @param status The status to count
   * @returns Number of entries with the specified status
   */
  private countRsvpsByStatus(entries: RsvpEntry[], status: RsvpStatus): number {
    return entries.filter(entry => entry.status === status).length;
  }
}
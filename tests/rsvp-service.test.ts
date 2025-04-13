import { RsvpService } from './../src/rsvp-service';
import { Player, RsvpEntry, Logger } from './../src/types';

// Mock Logger for testing
class MockLogger implements Logger {
  public logs: string[] = [];
  public errors: string[] = [];

  public info(message: string): void {
    this.logs.push(message);
  }

  public error(message: string, error?: Error): void {
    this.errors.push(message);
  }
}

describe('RsvpService', () => {
  let rsvpService: RsvpService;
  let mockLogger: MockLogger;
  
  // Sample players for testing
  const player1: Player = { id: '1', name: 'Alice', email: 'alice@example.com' };
  const player2: Player = { id: '2', name: 'Bob', email: 'bob@example.com' };
  const player3: Player = { id: '3', name: 'Charlie', email: 'charlie@example.com' };
  
  beforeEach(() => {
    mockLogger = new MockLogger();
    rsvpService = new RsvpService(mockLogger);
  });
  
  describe('addOrUpdateRsvp', () => {
    it('should add a new RSVP entry', () => {
      // Act
      const entry = rsvpService.addOrUpdateRsvp(player1, 'Yes');
      
      // Assert
      expect(entry.player).toBe(player1);
      expect(entry.status).toBe('Yes');
      expect(entry.respondedAt).toBeInstanceOf(Date);
      
      const counts = rsvpService.getRsvpCounts();
      expect(counts.total).toBe(1);
      expect(counts.confirmed).toBe(1);
    });
    
    it('should update an existing RSVP entry', () => {
      // Arrange
      rsvpService.addOrUpdateRsvp(player1, 'Yes');
      
      // Act
      const updatedEntry = rsvpService.addOrUpdateRsvp(player1, 'No');
      
      // Assert
      expect(updatedEntry.player).toBe(player1);
      expect(updatedEntry.status).toBe('No');
      
      const counts = rsvpService.getRsvpCounts();
      expect(counts.total).toBe(1);
      expect(counts.confirmed).toBe(0);
      expect(counts.declined).toBe(1);
    });
    
    it('should throw an error if player ID is missing', () => {
      // Arrange
      const invalidPlayer = { name: 'Invalid', email: 'invalid@example.com' } as Player;
      
      // Act & Assert
      expect(() => rsvpService.addOrUpdateRsvp(invalidPlayer, 'Yes')).toThrow('Player ID is required');
      expect(mockLogger.errors.length).toBe(1);
    });
  });
  
  describe('getConfirmedAttendees', () => {
    it('should return only confirmed attendees', () => {
      // Arrange
      rsvpService.addOrUpdateRsvp(player1, 'Yes');
      rsvpService.addOrUpdateRsvp(player2, 'No');
      rsvpService.addOrUpdateRsvp(player3, 'Yes');
      
      // Act
      const confirmedAttendees = rsvpService.getConfirmedAttendees();
      
      // Assert
      expect(confirmedAttendees.length).toBe(2);
      expect(confirmedAttendees[0].player).toBe(player1);
      expect(confirmedAttendees[1].player).toBe(player3);
    });
    
    it('should return an empty array if no confirmed attendees', () => {
      // Arrange
      rsvpService.addOrUpdateRsvp(player1, 'No');
      rsvpService.addOrUpdateRsvp(player2, 'Maybe');
      
      // Act
      const confirmedAttendees = rsvpService.getConfirmedAttendees();
      
      // Assert
      expect(confirmedAttendees.length).toBe(0);
    });
  });
  
  describe('getRsvpCounts', () => {
    it('should count total, confirmed, declined, and maybe responses correctly', () => {
      // Arrange
      rsvpService.addOrUpdateRsvp(player1, 'Yes');
      rsvpService.addOrUpdateRsvp(player2, 'No');
      rsvpService.addOrUpdateRsvp(player3, 'Maybe');
      
      // Act
      const counts = rsvpService.getRsvpCounts();
      
      // Assert
      expect(counts.total).toBe(3);
      expect(counts.confirmed).toBe(1);
      expect(counts.declined).toBe(1);
      expect(counts.maybe).toBe(1);
    });
    
    it('should return zero counts when no RSVPs exist', () => {
      // Act
      const counts = rsvpService.getRsvpCounts();
      
      // Assert
      expect(counts.total).toBe(0);
      expect(counts.confirmed).toBe(0);
      expect(counts.declined).toBe(0);
      expect(counts.maybe).toBe(0);
    });
  });
  
  describe('initializeWithEntries', () => {
    it('should initialize the service with existing entries', () => {
      // Arrange
      const entries: RsvpEntry[] = [
        { player: player1, status: 'Yes', respondedAt: new Date() },
        { player: player2, status: 'No', respondedAt: new Date() }
      ];
      
      // Act
      rsvpService.initializeWithEntries(entries);
      
      // Assert
      expect(rsvpService.getAllRsvps().length).toBe(2);
      expect(rsvpService.getPlayerRsvp(player1.id)?.status).toBe('Yes');
      expect(rsvpService.getPlayerRsvp(player2.id)?.status).toBe('No');
    });
    
    it('should handle invalid entries gracefully', () => {
      // Arrange
      const entries = [
        { player: player1, status: 'Yes', respondedAt: new Date() },
        { player: { name: 'Invalid' } as Player, status: 'Yes', respondedAt: new Date() }
      ];
      
      // Act
      rsvpService.initializeWithEntries(entries as RsvpEntry[]);
      
      // Assert
      expect(rsvpService.getAllRsvps().length).toBe(1);
      expect(mockLogger.errors.length).toBe(1);
    });
  });
  
  describe('getPlayerRsvp', () => {
    it('should return a player\'s RSVP entry if it exists', () => {
      // Arrange
      rsvpService.addOrUpdateRsvp(player1, 'Yes');
      
      // Act
      const entry = rsvpService.getPlayerRsvp(player1.id);
      
      // Assert
      expect(entry).toBeDefined();
      expect(entry?.player).toBe(player1);
      expect(entry?.status).toBe('Yes');
    });
    
    it('should return undefined if player has not RSVP\'d', () => {
      // Act
      const entry = rsvpService.getPlayerRsvp('nonexistent');
      
      // Assert
      expect(entry).toBeUndefined();
    });
  });
});
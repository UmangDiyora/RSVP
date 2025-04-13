# RSVP Service

A TypeScript module for managing RSVP responses for team events.

## Overview

This service provides a clean, focused API for tracking and managing player RSVPs. It follows modern TypeScript development patterns including pure functions, dependency injection, and the Single Responsibility Principle.

## Features

- Add or update a player's RSVP status
- Get a list of confirmed attendees
- Count total, confirmed, declined, and tentative responses
- Fully typed interfaces for `Player`, `RsvpEntry`, etc.
- Comprehensive test coverage

## File Structure
rsvp-manager/<br>
│<br>
├── types.ts                  // Contains all interfaces and type definitions<br>
├── rsvp-service.ts           // The main RsvpService implementation<br>
├── default-logger.ts         // Logger implementation<br>
├── index.ts                  // Exports from the module<br>
├── example-usage.ts          // Example showing how to use the service<br>
├── rsvp-service.test.ts      // Unit tests for the RSVP service<br>
│<br>
├── package.json              // Project configuration<br>
└── tsconfig.json             // TypeScript configuration<br>

## Installation

1. Clone this repository.
2. Install dependencies:

   ```bash
   npm install

Clone this repository
Install dependencies:
bashnpm install


## Usage
The RSVP service can be used as follows:
    
    import { RsvpService, DefaultLogger, Player } from './index';
    
    // Create the service with a logger
    const logger = new DefaultLogger();
    const rsvpService = new RsvpService(logger);
    
    // Define players
    const player: Player = { 
      id: 'p1', 
      name: 'Emily Rodriguez', 
      email: 'emily@example.com' 
    };
    
    // Add RSVPs
    rsvpService.addOrUpdateRsvp(player, 'Yes');
    
    // Get confirmed attendees
    const confirmedAttendees = rsvpService.getConfirmedAttendees();
    
    // Get RSVP counts
    const counts = rsvpService.getRsvpCounts();
    console.log(`Total: ${counts.total}, Confirmed: ${counts.confirmed}`);


For a complete example, see `example-usage.ts`.

## Available Methods

- `addOrUpdateRsvp(player, status)`: Add or update a player's RSVP
- `getConfirmedAttendees()`: Get list of 'Yes' responses
- `getDeclinedAttendees()`: Get list of 'No' responses
- `getTentativeAttendees()`: Get list of 'Maybe' responses
- `getAllRsvps()`: Get all RSVP entries
- `getRsvpCounts()`: Get counts for all response types
- `getPlayerRsvp(playerId)`: Get a specific player's RSVP
- `initializeWithEntries(entries)`: Batch initialize entries

## Development

- Bulid: `npm run build`
- Start: `npm start`
- Test: `npm test`
  
## Design Decisions

- **Dependency Injection:** Logger is injected to make the service testable and adaptable
- **Pure Functions:** Methods are designed to be predictable and minimize side effects
- **TypeScript Interfaces:** Clear, reusable types for domain objects
- **Data Structure:** Using Map for O(1) lookup of RSVPs by player ID
- **Error Handling:** Robust validation with descriptive error messages


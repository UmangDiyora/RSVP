import { RsvpService, DefaultLogger, Player, RsvpStatus } from './index';

// Create a sample application that demonstrates the RSVP service
async function runRsvpExample() {
  // Create the logger and service
  const logger = new DefaultLogger();
  const rsvpService = new RsvpService(logger);

  console.log('==== RSVP Service Example ====');

  // Sample team members
  const players: Player[] = [
    { id: 'p1', name: 'Emily Rodriguez', email: 'emily@example.com' },
    { id: 'p2', name: 'James Wilson', email: 'james@example.com' },
    { id: 'p3', name: 'Sofia Chen', email: 'sofia@example.com' },
    { id: 'p4', name: 'Miguel Santos', email: 'miguel@example.com' },
    { id: 'p5', name: 'Olivia Johnson', email: 'olivia@example.com' },
  ];

  // Add some initial RSVPs
  console.log('\nAdding initial RSVPs...');
  rsvpService.addOrUpdateRsvp(players[0], 'Yes');
  rsvpService.addOrUpdateRsvp(players[1], 'No');
  rsvpService.addOrUpdateRsvp(players[2], 'Maybe');

  // Display current counts
  printRsvpCounts(rsvpService);

  // Display confirmed attendees
  console.log('\nConfirmed Attendees:');
  const confirmedAttendees = rsvpService.getConfirmedAttendees();
  confirmedAttendees.forEach(entry => {
    console.log(`- ${entry.player.name} (${entry.player.email})`);
  });

  // Update some RSVPs
  console.log('\nUpdating RSVPs...');
  rsvpService.addOrUpdateRsvp(players[2], 'Yes'); // Update Sofia from Maybe to Yes
  rsvpService.addOrUpdateRsvp(players[3], 'Yes'); // Add Miguel as Yes
  rsvpService.addOrUpdateRsvp(players[4], 'No');  // Add Olivia as No

  // Display updated counts
  printRsvpCounts(rsvpService);

  // Display all RSVPs by status
  printRsvpsByStatus(rsvpService);
}

// Helper function to print RSVP counts
function printRsvpCounts(rsvpService: RsvpService) {
  const counts = rsvpService.getRsvpCounts();
  console.log('\nRSVP Counts:');
  console.log(`- Total: ${counts.total}`);
  console.log(`- Confirmed: ${counts.confirmed}`);
  console.log(`- Declined: ${counts.declined}`);
  console.log(`- Maybe: ${counts.maybe}`);
}

// Helper function to print RSVPs by status
function printRsvpsByStatus(rsvpService: RsvpService) {
  console.log('\nAll RSVPs by Status:');
  
  console.log('\nConfirmed (Yes):');
  rsvpService.getConfirmedAttendees().forEach(entry => {
    console.log(`- ${entry.player.name} (Responded: ${formatDate(entry.respondedAt)})`);
  });
  
  console.log('\nDeclined (No):');
  rsvpService.getDeclinedAttendees().forEach(entry => {
    console.log(`- ${entry.player.name} (Responded: ${formatDate(entry.respondedAt)})`);
  });
  
  console.log('\nTentative (Maybe):');
  rsvpService.getTentativeAttendees().forEach(entry => {
    console.log(`- ${entry.player.name} (Responded: ${formatDate(entry.respondedAt)})`);
  });
}

// Helper function to format dates
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// Run the example
runRsvpExample().catch(console.error);
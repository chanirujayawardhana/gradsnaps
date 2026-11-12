// ===== GRADSNAPS SETTINGS: edit this file only =====
var EMAIL = 'info@gradsnaps.lk';

// ---- BOOKING TIME SLOTS (shown to customers) ----
var SLOTS = ['6-7 AM','7-8 AM','8-9 AM','9-10 AM','10-11 AM','11 AM-12 PM','1-2 PM','2-3 PM','3-4 PM','4-5 PM'];

// ---- ALREADY BOOKED SLOTS ----
// Add a line for each date (format YYYY-MM-DD) with the slots that are taken.
// Use the exact same text as in SLOTS above. Example below (replace it).
var BOOKED = {
  '2026-11-21': ['7-8 AM','8-9 AM'],
  '2026-11-22': ['6-7 AM']
};

// ---- REVIEWS (these are SAMPLES, replace with real ones) ----
// photo = the small round picture of the person   (square photo looks best)
// bg    = the soft picture behind the review box  (wide photo looks best)
// Put the image files in images/reviews/ and write the path below.
// Leave photo or bg out (or empty '') and that review simply shows without it.
var REVIEWS = [
  {name:'Dilini P.', stars:5, photo:'images/reviews/dilini.jpg', bg:'images/reviews/dilini-bg.jpg', text:'So relaxed and fun! The photos came out soft and beautiful, and my family loved the online gallery.'},
  {name:'Kavindu & Nethmi', stars:5, photo:'images/reviews/kavindu.jpg', bg:'images/reviews/kavindu-bg.jpg', text:'Our couple shots are my favourite memory of graduation day. Highly recommend the Duo package.'},
  {name:'Sachini R.', stars:5, photo:'images/reviews/sachini.jpg', bg:'images/reviews/sachini-bg.jpg', text:'Quick, friendly and professional. Got all the soft copies in no time.'},
  {name:'Crew of 6', stars:4, photo:'images/reviews/crew.jpg', bg:'images/reviews/crew-bg.jpg', text:'Great group photos and everyone felt comfortable. Worth every rupee.'}
];

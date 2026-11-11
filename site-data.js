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

// ---- GALLERY: one line = one shoot. The FIRST photo is the cover.
// To add a shoot, copy a line, change type (Individual / Couple / Group), title and photo paths.
// You can list as many photos as you like.
var SHOOTS = [
  {type:'Individual', title:'Individual 1', photos:['images/individual-1/1.jpg','images/individual-1/2.jpg','images/individual-1/3.jpg','images/individual-1/4.jpg']},
  {type:'Individual', title:'Individual 2', photos:['images/individual-2/1.jpg','images/individual-2/2.jpg','images/individual-2/3.jpg','images/individual-2/4.jpg']},
  {type:'Individual', title:'Individual 3', photos:['images/individual-3/1.jpg','images/individual-3/2.jpg','images/individual-3/3.jpg','images/individual-3/4.jpg']},
  {type:'Individual', title:'Individual 4', photos:['images/individual-4/1.jpg','images/individual-4/2.jpg','images/individual-4/3.jpg','images/individual-4/4.jpg']},
  {type:'Individual', title:'Individual 5', photos:['images/individual-5/1.jpg','images/individual-5/2.jpg','images/individual-5/3.jpg','images/individual-5/4.jpg']},
  {type:'Individual', title:'Individual 6', photos:['images/individual-6/1.jpg','images/individual-6/2.jpg','images/individual-6/3.jpg','images/individual-6/4.jpg']},
  {type:'Couple', title:'Couple 1', photos:['images/couple-1/1.jpg','images/couple-1/2.jpg','images/couple-1/3.jpg','images/couple-1/4.jpg']},
  {type:'Couple', title:'Couple 2', photos:['images/couple-2/1.jpg','images/couple-2/2.jpg','images/couple-2/3.jpg','images/couple-2/4.jpg']},
  {type:'Couple', title:'Couple 3', photos:['images/couple-3/1.jpg','images/couple-3/2.jpg','images/couple-3/3.jpg','images/couple-3/4.jpg']},
  {type:'Couple', title:'Couple 4', photos:['images/couple-4/1.jpg','images/couple-4/2.jpg','images/couple-4/3.jpg','images/couple-4/4.jpg']},
  {type:'Couple', title:'Couple 5', photos:['images/couple-5/1.jpg','images/couple-5/2.jpg','images/couple-5/3.jpg','images/couple-5/4.jpg']},
  {type:'Couple', title:'Couple 6', photos:['images/couple-6/1.jpg','images/couple-6/2.jpg','images/couple-6/3.jpg','images/couple-6/4.jpg']},
  {type:'Group', title:'Group 1', photos:['images/group-1/1.jpg','images/group-1/2.jpg','images/group-1/3.jpg','images/group-1/4.jpg']},
  {type:'Group', title:'Group 2', photos:['images/group-2/1.jpg','images/group-2/2.jpg','images/group-2/3.jpg','images/group-2/4.jpg']},
  {type:'Group', title:'Group 3', photos:['images/group-3/1.jpg','images/group-3/2.jpg','images/group-3/3.jpg','images/group-3/4.jpg']},
  {type:'Group', title:'Group 4', photos:['images/group-4/1.jpg','images/group-4/2.jpg','images/group-4/3.jpg','images/group-4/4.jpg']},
  {type:'Group', title:'Group 5', photos:['images/group-5/1.jpg','images/group-5/2.jpg','images/group-5/3.jpg','images/group-5/4.jpg']},
  {type:'Group', title:'Group 6', photos:['images/group-6/1.jpg','images/group-6/2.jpg','images/group-6/3.jpg','images/group-6/4.jpg']},
];

// ---- REVIEWS (these are SAMPLES, replace with real ones) ----
var REVIEWS = [
  {name:'Dilini P.', stars:5, text:'So relaxed and fun! The photos came out soft and beautiful, and my family loved the online gallery.'},
  {name:'Kavindu & Nethmi', stars:5, text:'Our couple shots are my favourite memory of graduation day. Highly recommend the Duo package.'},
  {name:'Sachini R.', stars:5, text:'Quick, friendly and professional. Got all the soft copies in no time.'},
  {name:'Crew of 6', stars:4, text:'Great group photos and everyone felt comfortable. Worth every rupee.'}
];

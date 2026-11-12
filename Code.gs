/**
 * GradSnaps booking backend (Google Apps Script)
 * - doPost: saves a booking row to the Sheet, saves the payment slip to the Drive folder, emails you
 * - doGet : tells the website which date/time slots are already booked
 *
 * Deploy as a Web app: Execute as "Me", access "Anyone". See SETUP.md.
 */
var SHEET_ID = '10qgRGt4S_kLCRgYmTF3tDS7mMiVmU4JvyI67XO24GC4';
var FOLDER_ID = '13IUxBSb6s6Xehg4fxcZwRKVDVDK-CSrk';
var NOTIFY_EMAIL = 'chanirudinsara99az@gmail.com';
var TZ = 'Asia/Colombo';

var HEADERS = ['Received', 'Package', 'Total (LKR)', 'Advance (LKR)', 'Balance (LKR)', 'Name', 'Phone', 'Email',
  'Date', 'Time slot', 'University', 'Venue', 'People', 'Notes', 'Slip', 'Status'];
var C_DATE = 8, C_TIME = 9, C_STATUS = 15; // 0-based column positions

function sheet_() {
  var sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function day_(v) {
  return v instanceof Date ? Utilities.formatDate(v, TZ, 'yyyy-MM-dd') : String(v || '').trim();
}
function safe_(s) { // stop text from being treated as a formula
  s = String(s == null ? '' : s);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function bookedMap_(sh, onlyFuture) {
  var rows = sh.getDataRange().getValues(), out = {}, today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (String(r[C_STATUS]).trim().toLowerCase() === 'cancelled') continue; // set Status to "Cancelled" to free a slot
    var d = day_(r[C_DATE]), t = String(r[C_TIME] || '').trim();
    if (!d || !t || (onlyFuture && d < today)) continue;
    (out[d] = out[d] || []).push(t);
  }
  return out;
}

function doGet() {
  try { return json_({ booked: bookedMap_(sheet_(), true) }); }
  catch (err) { return json_({ booked: {}, error: String(err) }); }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var d = JSON.parse(e.postData.contents);
    if (!d.name || !d.phone || !d.date || !d.time) return json_({ ok: false, error: 'missing' });

    var sh = sheet_();
    var taken = bookedMap_(sh, false)[d.date] || [];
    if (taken.indexOf(d.time) > -1) return json_({ ok: false, error: 'taken' });

    var slipUrl = '';
    if (d.slip && d.slip.data) {
      var ext = d.slip.type === 'application/pdf' ? '.pdf' : '.jpg';
      var fname = 'slip_' + d.date + '_' + String(d.time).replace(/[^A-Za-z0-9]+/g, '') + '_' +
        String(d.name).replace(/[^A-Za-z0-9]+/g, '_').slice(0, 30) + ext;
      var blob = Utilities.newBlob(Utilities.base64Decode(d.slip.data), d.slip.type || 'image/jpeg', fname);
      slipUrl = DriveApp.getFolderById(FOLDER_ID).createFile(blob).getUrl();
    }

    var row = sh.getLastRow() + 1;
    sh.getRange(row, 7).setNumberFormat('@');                       // phone keeps its leading 0
    sh.getRange(row, C_DATE + 1, 1, 2).setNumberFormat('@');        // date + time stay as typed
    sh.getRange(row, 1, 1, HEADERS.length).setValues([[
      Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'),
      d.package, Number(d.total) || '', Number(d.advance) || '', Number(d.balance) || '',
      safe_(d.name), d.phone, safe_(d.email), d.date, d.time,
      safe_(d.university), safe_(d.venue), d.people || '', safe_(d.notes), slipUrl, 'Pending'
    ]]);

    try {
      MailApp.sendEmail(NOTIFY_EMAIL, 'New GradSnaps booking: ' + d.name + ' · ' + d.date + ' ' + d.time,
        'Package: ' + d.package + '\nName: ' + d.name + '\nPhone: ' + d.phone + '\nDate: ' + d.date + '\nTime: ' + d.time +
        '\nUniversity: ' + (d.university || '-') + '\nVenue: ' + (d.venue || '-') + '\nNotes: ' + (d.notes || '-') +
        '\n\nPayment slip: ' + slipUrl + '\nSheet: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit');
    } catch (mailErr) { /* email is a bonus; ignore failures */ }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

# Connect bookings to Google Sheet + Drive (one-time, ~5 minutes)

A website with no server can't write to Google by itself, so a small Google Apps Script
(`apps-script/Code.gs`) does it. It runs under your Google account.

1. Sign in as **chanirudinsara99az@gmail.com** and open https://script.google.com → **New project**.
2. Delete the sample code, paste everything from `apps-script/Code.gs`, click **Save**.
3. **Deploy → New deployment → ⚙ → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** (Advanced → "Go to project" → Allow).
     It needs Sheets, Drive and Gmail (for the "new booking" email to you).
4. Copy the **Web app URL** (ends with `/exec`).
5. Open `site-data.js` and paste it: `var BOOKING_URL = 'https://script.google.com/macros/s/.../exec';`
6. Upload these files to your site: `index.html`, `home.js`, `style.css`, `site-data.js`.
7. Test: open the Web app URL in a browser, you should see `{"booked":{}}`. Then make a test booking on the site.

## How it works
- Each booking becomes a row in the **first tab** of your sheet (headers are added automatically), with a link to the slip in Drive and Status = `Pending`.
- Slips are saved in your Drive folder as `slip_<date>_<time>_<name>.jpg`.
- Booked slots show as **"Already booked"** (greyed out, can't be chosen). They come from the sheet automatically, plus anything you type in `BOOKED` in `site-data.js` (for phone/WhatsApp bookings).
- To free a slot, change that row's **Status** to `Cancelled`.
- If you edit `Code.gs` later: **Deploy → Manage deployments → ✏ → Version: New version → Deploy** (the URL stays the same).

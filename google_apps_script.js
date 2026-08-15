/**
 * ======================================================================
 * Sahan & Navoda Wedding Invitation - Google Sheets RSVP Web App Handler
 * ======================================================================
 * Sheet ID: 1P9Op6D0hXvcQyPzuyiizmB4n1MDvLBRZi-sVUC6x17g
 * Sheet URL: https://docs.google.com/spreadsheets/d/1P9Op6D0hXvcQyPzuyiizmB4n1MDvLBRZi-sVUC6x17g/edit
 *
 * HOW TO DEPLOY (30 SECONDS):
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1P9Op6D0hXvcQyPzuyiizmB4n1MDvLBRZi-sVUC6x17g/edit
 * 2. Click "Extensions" > "Apps Script" in the top menu.
 * 3. Delete any existing code in the editor, and paste this entire code.
 * 4. Click the blue "Deploy" button (top right) > "New deployment".
 * 5. Select type: "Web app" (click the gear icon ⚙️ next to Select type).
 * 6. Set:
 *    - Description: "Wedding RSVP Web App"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (IMPORTANT!)
 * 7. Click "Deploy", authorize access when prompted.
 * 8. Copy the Web app URL (ending in /exec) and you're all set!
 * ======================================================================
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Sahan & Navoda Wedding RSVP Service is Live!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById("1P9Op6D0hXvcQyPzuyiizmB4n1MDvLBRZi-sVUC6x17g");
    var sheet = doc.getActiveSheet();

    // Auto-create stylish headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Guest Name",
        "Number of Guests",
        "Attendance Status",
        "Special Wishes / Message"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#3E2718");
      headerRange.setFontColor("#FFFDF8");
      sheet.setFrozenRows(1);
    }

    var timestamp = new Date();
    var name = "";
    var guestCount = "";
    var attendance = "";
    var message = "";

    if (e && e.parameter) {
      name = e.parameter.name || "";
      guestCount = e.parameter.guest_count || "";
      attendance = e.parameter.attendance || "";
      message = e.parameter.message || "";
    }

    if (e && e.postData && e.postData.contents) {
      try {
        var json = JSON.parse(e.postData.contents);
        if (json.name) name = json.name;
        if (json.guest_count) guestCount = json.guest_count;
        if (json.attendance) attendance = json.attendance;
        if (json.message) message = json.message;
      } catch (err) {
        // Fall back to parameter parsing
      }
    }

    // Append response row to the Google Sheet
    sheet.appendRow([
      timestamp,
      name,
      guestCount,
      attendance,
      message
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      row: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

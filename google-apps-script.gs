const SPREADSHEET_ID = '1oCIZcLkNP7Br-vY-zK4l-CQzfqdAWSaDGXMjov4nt1o';
const SHEET_NAME = 'Registrations';

function doPost(event) {
  const data = JSON.parse(event.postData.contents || '{}');
  if (!data.name || !data.email || !data.whatsapp) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Missing required details.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Registered at', 'Full name', 'Email address', 'WhatsApp number', 'Role']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([new Date(), data.name, data.email, data.whatsapp, data.role || 'Not specified']);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

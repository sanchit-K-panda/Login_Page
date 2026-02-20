/*
 * ══════════════════════════════════════════════════════════
 *   GOOGLE APPS SCRIPT — Paste this in your spreadsheet
 * ══════════════════════════════════════════════════════════
 *
 * SETUP STEPS:
 * 1. Open: https://docs.google.com/spreadsheets/d/1vRimA38jDAurKfApIwILEc4NYsXTvY2qdylH4CouPE8/edit
 * 2. Go to  Extensions → Apps Script
 * 3. Delete any existing code, paste ALL of the code below
 * 4. Click  💾 Save
 * 5. Click  Deploy → New deployment
 * 6. Type  = "Web app"
 * 7. Execute as = "Me"
 * 8. Who has access = "Anyone"
 * 9. Click  Deploy  → Authorize (accept permissions) → copy the Web App URL
 * 10. Paste that URL into  src/sheetsApi.js  (line 17)
 *
 * ⚠️  If you change this code, you must create a NEW deployment
 *     (Deploy → New deployment), don't just update the existing one.
 *
 * That's it! The form will now write to your sheet.
 * ══════════════════════════════════════════════════════════
 */

function doGet(e) {
    try {
        // Read data from URL parameter
        var rawData = e.parameter.data;

        if (!rawData) {
            return ContentService
                .createTextOutput(JSON.stringify({ status: 'ok', message: 'No data parameter' }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        var data = JSON.parse(rawData);
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Auto-create headers on first run
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Timestamp',
                'Team_ID',
                'Op1_Nickname', 'Op1_Serial', 'Op1_Email',
                'Op2_Nickname', 'Op2_Serial', 'Op2_Email',
                'Op3_Nickname', 'Op3_Serial', 'Op3_Email',
                'Op4_Nickname', 'Op4_Serial', 'Op4_Email'
            ]);
        }

        var row = [new Date().toISOString(), data.teamId];

        // Add operative data (pad to 4 operatives)
        for (var i = 0; i < 4; i++) {
            if (data.operatives && data.operatives[i]) {
                row.push(
                    data.operatives[i].nickname || '',
                    data.operatives[i].serial || '',
                    data.operatives[i].email || ''
                );
            } else {
                row.push('', '', '');
            }
        }

        sheet.appendRow(row);

        return ContentService
            .createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);
        e.parameter = { data: JSON.stringify(data) };
        return doGet(e);
    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

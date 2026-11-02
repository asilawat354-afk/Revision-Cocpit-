/**
 * ===================================================================
 * 🎯 DASHBOARD & MASTER DATABASE AUTOMATION ENGINE (v8.8 - BULLETPROOF)
 * ===================================================================
 * - Fixed: Removed manual UID generation (A3 ArrayFormula handles it now to prevent #REF)
 * - Fixed: Added automatic row insertion (insertRowsAfter) to prevent out-of-bounds crashes
 * - Fixed: Strict filtering of visible/invisible zero-width spaces (\u200b) in normalizeDifficulty
 * - Dynamic Spaced Repetition (Easy: +15d, Medium: +7d, Hard: +3d)
 * - Built-in Vacation Freeze Engine (Auto-shifts overdue dates without debt)
 * ===================================================================
 */

export const DEFAULT_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1j6yR4Hf6YxNSIgcOoNQqWKDYzPHHI0fTIIWykiXthkU/edit?usp=drivesdk";
export const DEFAULT_SPREADSHEET_ID = "1j6yR4Hf6YxNSIgcOoNQqWKDYzPHHI0fTIIWykiXthkU";

export const APPS_SCRIPT_V8_8_CODE = `/**
 * ===================================================================
 * 🎯 DASHBOARD & MASTER DATABASE AUTOMATION ENGINE (v8.8 - BULLETPROOF)
 * ===================================================================
 * - Fixed: Removed manual UID generation (A3 ArrayFormula handles it now to prevent #REF)
 * - Fixed: Added automatic row insertion (insertRowsAfter) to prevent out-of-bounds crashes
 * - Fixed: Strict filtering of visible/invisible zero-width spaces (\\u200b) in normalizeDifficulty
 * ===================================================================
 */

var DASH_SHEET_NAME = "Dashboard"; 
var MASTER_SHEET_NAME = "Master Database";
var LOG_SHEET_KEYWORD = "रिवीजन स्टडी लॉग";
var VACATION_LOG_NAME = "Vacation_Log";
var MIN_STUDY_TIME_MINUTES = 10; 

function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('🎯 रिवीजन टूल्स')
      .addItem('🔄 Rebuild Master DB from Study Log', 'rebuildMasterDatabaseFromLogs')
      .addItem('🧠 Auto-Shift Overdue Revisions', 'triggerAutoShiftManually')
      .addToUi();
  } catch (e) {
    console.error("onOpen error: " + e.message);
  }
}

function onEdit(e) {
  if (!e || !e.range) return;
  try {
    var sheet = e.range.getSheet();
    var sheetName = sheet.getName();

    if (sheetName === MASTER_SHEET_NAME) {
      if (e.range.getRow() === 1 && e.range.getColumn() === 2 && (e.value === "TRUE" || sheet.getRange(1, 2).getValue() === true)) {
        sheet.getRange(1, 2).setValue(false);
        rebuildMasterDatabaseFromLogs();
        return;
      }
    }

    if (sheetName !== DASH_SHEET_NAME) return;

    var row = e.range.getRow(), col = e.range.getColumn();
    var editLastRow = e.range.getLastRow(), editLastCol = e.range.getLastColumn();
    var isSingleCell = (row === editLastRow && col === editLastCol);
    var val = e.value;

    // Row 64+ Column 6 (F64+): Quick-Load topic into Stopwatch
    if (isSingleCell && col === 6 && row >= 64 && val === "TRUE") {
      var props = PropertiesService.getDocumentProperties();
      if (props.getProperty('isRunning') === 'true' || parseInt(props.getProperty('elapsedTime') || '0') > 0) {
        sheet.getRange(row, col).setValue(false);
        showMessage(sheet, "⚠️ स्टॉपवॉच चालू/पॉज़्ड है! पहले Stop & Save करें।", true);
        return;
      }
      var mode = sheet.getRange('C20').getValue();
      if (mode !== "Revision Mode" && mode !== "रिवीजन करें") {
        sheet.getRange(row, col).setValue(false);
        showMessage(sheet, "⚠️ यह चेकबॉक्स सिर्फ 'Revision Mode' में काम करता है!", true);
        return;
      }
      var sub = sheet.getRange(row, 2).getValue();
      if (sub && sub !== "🎉" && !sub.toString().includes("TIER") && !sub.toString().includes("NEW LECTURES") && !sub.toString().includes("OLD REVISIONS") && !sub.toString().includes("Total Due")) {
        sheet.getRange('C22').setValue(sub);
        sheet.getRange('C23').setValue(sheet.getRange(row, 3).getValue());
        sheet.getRange('C24').setValue(sheet.getRange(row, 4).getValue());
        sheet.getRange(row, col).setValue(false); 
        showMessage(sheet, "✅ टॉपिक लोड हो गया! अब आप स्टॉपवॉच शुरू कर सकते हैं।", false);
      } else {
        sheet.getRange(row, col).setValue(false);
      }
      return;
    }

    // Protect Topic Selection Area when stopwatch is active
    var touchesTopicArea = (col <= 3 && editLastCol >= 3 && row <= 24 && editLastRow >= 22);
    if (touchesTopicArea) {
      var props = PropertiesService.getDocumentProperties();
      if (props.getProperty('isRunning') === 'true' || parseInt(props.getProperty('elapsedTime') || '0') > 0) {
        sheet.getRange('C22').setValue(props.getProperty('lockedSubject') || '');
        sheet.getRange('C23').setValue(props.getProperty('lockedChapter') || '');
        sheet.getRange('C24').setValue(props.getProperty('lockedLecture') || '');
        showMessage(sheet, "⚠️ स्टॉपवॉच चालू/पॉज़्ड है! पहले Stop & Save करें या Reset (F41) दबाएँ।", true);
        return;
      }
      if (isSingleCell && col === 3) {
        if (row === 22) sheet.getRange('C23:C24').clearContent();
        else if (row === 23) sheet.getRange('C24').clearContent();
        setReadyMessage(sheet);
      }
      return;
    }

    // Row 5 Column 3 (C5): Vacation Mode Toggle
    if (isSingleCell && row === 5 && col === 3) return handleVacationToggle(sheet, val);

    // Row 57 Column 6 (F57): Auto-Shift Overdue Revisions
    if (isSingleCell && row === 57 && col === 6 && sheet.getRange('F57').getValue() === true) return handleAutoShiftOverdue(sheet);
    
    // Row 39 Column 6 (F39): Start / Pause Stopwatch
    if (isSingleCell && row === 39 && col === 6) {
      var isChecked = sheet.getRange('F39').getValue() === true;
      if (isChecked) {
        var modeCheck = sheet.getRange('C20').getValue();
        if (modeCheck === "First Study Mode" || modeCheck === "पहली पढ़ाई") {
          sheet.getRange('F39').setValue(false);
          showMessage(sheet, "⚠️ 'First Study Mode' में स्टॉपवॉच नहीं चलती।", true);
          return;
        }
        if (!sheet.getRange('C22').getValue() || !sheet.getRange('C23').getValue() || !sheet.getRange('C24').getValue()) {
          sheet.getRange('F39').setValue(false);
          showMessage(sheet, "⚠ पहले Subject, Chapter और Lecture चुनें!", true);
          return;
        }
        var mTime = sheet.getRange('C41').getValue();
        if (mTime !== "" && mTime > 0) {
          sheet.getRange('F39').setValue(false);
          showMessage(sheet, "⚠️ मैन्युअल समय दर्ज है! स्टॉपवॉच नहीं चलेगी।", true);
          return;
        }
      }
      return handleStartPause(isChecked, sheet);
    }

    // Row 40 Column 6 (F40): Stop & Save
    if (isSingleCell && row === 40 && col === 6 && sheet.getRange('F40').getValue() === true) {
      sheet.getRange('F40').setValue(false);
      return handleStopAndSave(sheet);
    }

    // Row 41 Column 6 (F41): Reset Dashboard
    if (isSingleCell && row === 41 && col === 6 && sheet.getRange('F41').getValue() === true) {
      sheet.getRange('F41').setValue(false);
      resetDashboard(sheet, PropertiesService.getDocumentProperties());
      showMessage(sheet, "🔄 पूरा Dashboard Reset हो गया।", false);
    }

  } catch (err) {
    console.error("onEditMain Error: " + err.message);
  }
}

// -------------------------------------------------------------
// ऑटो-शिफ्ट ओवरड्यू लेक्चर्स (Auto-Shift Overdue Revisions)
// -------------------------------------------------------------
function triggerAutoShiftManually() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dash = ss.getSheetByName(DASH_SHEET_NAME);
  if (dash) handleAutoShiftOverdue(dash);
}

function handleAutoShiftOverdue(sheet) {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(5000)) {
    sheet.getRange('F57').setValue(false); 
    showMessage(sheet, "⏳ सिस्टम व्यस्त है, कृपया पुनः प्रयास करें।", true);
    return;
  }

  try {
    showMessage(sheet, "⏳ ओवरड्यू रिवीज़न को ऑटो-शिफ्ट किया जा रहा है...", false);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var master = ss.getSheetByName(MASTER_SHEET_NAME);
    if (!master) {
      sheet.getRange('F57').setValue(false);
      showMessage(sheet, "❌ Master Database शीट नहीं मिली!", true);
      return;
    }

    var data = master.getDataRange().getValues();
    if (data.length <= 2) {
      sheet.getRange('F57').setValue(false);
      showMessage(sheet, "⚠️ मास्टर डेटाबेस में डेटा नहीं है।", true);
      return;
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var shiftedCount = 0;
    var dayOffset = 1;

    for (var i = 2; i < data.length; i++) {
      var nextDue = data[i][7]; // Col H: Next Due Date
      if (nextDue) {
        var dueDate = new Date(nextDue);
        if (!isNaN(dueDate.getTime()) && dueDate < today) {
          // Distribute evenly starting tomorrow to prevent burnout
          var newDate = new Date(today.getTime() + (dayOffset * 86400000));
          master.getRange(i + 1, 8).setValue(newDate);
          shiftedCount++;
          if (shiftedCount % 5 === 0) dayOffset++;
        }
      }
    }

    sheet.getRange('F57').setValue(false);
    showMessage(sheet, "✅ " + shiftedCount + " ओवरड्यू लेक्चर्स आगे शेड्यूल कर दिए गए!", false);
  } catch (err) {
    sheet.getRange('F57').setValue(false);
    showMessage(sheet, "❌ त्रुटि: " + err.message, true);
  } finally {
    lock.releaseLock();
  }
}

// -------------------------------------------------------------
// वेकेशन इंजन (Vacation & Freeze Engine)
// -------------------------------------------------------------
function handleVacationToggle(sheet, val) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var vacSheet = ss.getSheetByName(VACATION_LOG_NAME);
  var isFreeze = (val === "TRUE" || sheet.getRange('C5').getValue() === true);

  if (isFreeze) {
    sheet.getRange('D5').setValue("🏖️ FREEZE (छुट्टी चालू)");
    if (vacSheet) {
      var todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
      vacSheet.appendRow(["VAC-" + new Date().getTime(), todayStr, "", 0, "Active", "कॉकपिट वेकेशन मोड"]);
    }
    showMessage(sheet, "🏖️ वेकेशन मोड सक्रिय: तारीखें फ्रीज हो गई हैं!", false);
  } else {
    sheet.getRange('D5').setValue("⚡ NORMAL (रनिंग)");
    if (vacSheet) {
      var vacData = vacSheet.getDataRange().getValues();
      for (var r = vacData.length - 1; r >= 1; r--) {
        if (vacData[r][4] === "Active") {
          var start = new Date(vacData[r][1]);
          var end = new Date();
          var days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
          vacSheet.getRange(r + 1, 3).setValue(Utilities.formatDate(end, Session.getScriptTimeZone(), "yyyy-MM-dd"));
          vacSheet.getRange(r + 1, 4).setValue(days);
          vacSheet.getRange(r + 1, 5).setValue("Completed");
          
          // Auto-shift all Master Database dates by vacation days
          shiftMasterDueDates(days);
          showMessage(sheet, "⚡ वेकेशन समाप्त! सभी ड्यू तारीखें " + days + " दिन आगे बढ़ाई गईं।", false);
          return;
        }
      }
    }
    showMessage(sheet, "⚡ वेकेशन मोड समाप्त।", false);
  }
}

function shiftMasterDueDates(days) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var master = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!master) return;
  var data = master.getDataRange().getValues();
  for (var i = 2; i < data.length; i++) {
    var due = data[i][7];
    if (due && due instanceof Date) {
      due.setDate(due.getDate() + days);
      master.getRange(i + 1, 8).setValue(due);
    }
  }
}

// -------------------------------------------------------------
// स्टॉपवॉच स्टार्ट / पॉज़ (Start / Pause Stopwatch)
// -------------------------------------------------------------
function handleStartPause(isChecked, sheet) {
  var props = PropertiesService.getDocumentProperties();
  if (isChecked) {
    // START
    var now = new Date().getTime();
    props.setProperty('isRunning', 'true');
    props.setProperty('startTime', now.toString());
    props.setProperty('lockedSubject', sheet.getRange('C22').getValue() || '');
    props.setProperty('lockedChapter', sheet.getRange('C23').getValue() || '');
    props.setProperty('lockedLecture', sheet.getRange('C24').getValue() || '');
    showMessage(sheet, "⏱️ स्टॉपवॉच चालू है... ध्यान से रिवीज़न करें!", false);
  } else {
    // PAUSE
    var startTime = parseInt(props.getProperty('startTime') || '0');
    var elapsed = parseInt(props.getProperty('elapsedTime') || '0');
    if (startTime > 0) {
      elapsed += Math.round((new Date().getTime() - startTime) / 60000); // Minutes
    }
    props.setProperty('isRunning', 'false');
    props.setProperty('elapsedTime', elapsed.toString());
    props.deleteProperty('startTime');
    showMessage(sheet, "⏸️ स्टॉपवॉच पॉज़ की गई। कुल समय: " + elapsed + " मिनट", false);
  }
}

// -------------------------------------------------------------
// स्टॉप और सेव (Stop & Save Log)
// -------------------------------------------------------------
function handleStopAndSave(sheet) {
  var props = PropertiesService.getDocumentProperties();
  var startTime = parseInt(props.getProperty('startTime') || '0');
  var elapsed = parseInt(props.getProperty('elapsedTime') || '0');
  if (props.getProperty('isRunning') === 'true' && startTime > 0) {
    elapsed += Math.round((new Date().getTime() - startTime) / 60000);
  }

  var manualTime = sheet.getRange('C41').getValue();
  if (manualTime && !isNaN(parseInt(manualTime))) {
    elapsed = parseInt(manualTime);
  }

  if (elapsed <= 0) {
    showMessage(sheet, "⚠️ रिवीज़न समय 0 है! स्टॉपवॉच चलाएं या समय दर्ज करें।", true);
    return;
  }

  var sub = sheet.getRange('C22').getValue();
  var ch = sheet.getRange('C23').getValue();
  var lec = sheet.getRange('C24').getValue();
  var diff = normalizeDifficulty(sheet.getRange('C26').getValue() || "Medium");

  if (!sub || !ch || !lec) {
    showMessage(sheet, "⚠️ पहले Subject, Chapter और Lecture चुनें!", true);
    return;
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = getOrCreateLogSheet(ss);

  var today = new Date();
  var dateStr = Utilities.formatDate(today, Session.getScriptTimeZone(), "dd/MM/yyyy");
  var uid = makeUID(sub, ch, lec);

  // Append Study Log Row
  logSheet.appendRow([
    uid,
    dateStr,
    sub,
    ch,
    lec,
    elapsed + " Min",
    Utilities.formatDate(today, Session.getScriptTimeZone(), "EEEE"),
    "",
    "",
    1,
    "-",
    "-",
    sheet.getRange('C25').getValue() || "",
    diff,
    sheet.getRange('C27').getValue() || "",
    sheet.getRange('C28').getValue() || ""
  ]);

  // Reset Dashboard & Properties
  resetDashboard(sheet, props);
  showMessage(sheet, "🎉 " + lec + " का रिवीज़न स्टडी लॉग में सेव हो गया (" + elapsed + " Min)!", false);
}

// -------------------------------------------------------------
// स्टडी लॉग से मास्टर डेटाबेस रीबिल्ड करना (Rebuild Master DB)
// -------------------------------------------------------------
function rebuildMasterDatabaseFromLogs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = getOrCreateLogSheet(ss);
  var master = ss.getSheetByName(MASTER_SHEET_NAME);
  
  if (!master) {
    SpreadsheetApp.getUi().alert("❌ Master Database शीट नहीं मिली!");
    return;
  }

  var logData = logSheet.getDataRange().getValues();
  if (logData.length <= 1) {
    SpreadsheetApp.getUi().alert("⚠️ स्टडी लॉग में अभी कोई रिकॉर्ड नहीं है।");
    return;
  }

  var aggregated = {};
  for (var i = 1; i < logData.length; i++) {
    var row = logData[i];
    var uid = (row[0] || "").toString().trim();
    var sub = (row[2] || "").toString().trim();
    var ch = (row[3] || "").toString().trim();
    var lec = (row[4] || "").toString().trim();
    var tStr = (row[5] || "").toString().replace(/[^0-9]/g, "");
    var time = parseInt(tStr) || 0;
    var diff = normalizeDifficulty(row[13] || "Medium");
    var dateVal = row[1];

    if (!sub || !ch || !lec) continue;
    var key = uid || (sub + ":::" + ch + ":::" + lec);

    if (!aggregated[key]) {
      aggregated[key] = {
        uid: uid,
        sub: sub,
        ch: ch,
        lec: lec,
        diff: diff,
        revCount: 0,
        times: [],
        lastDate: null
      };
    }

    aggregated[key].revCount++;
    if (time > 0) aggregated[key].times.push(time);
    if (diff) aggregated[key].diff = diff;
    if (dateVal) aggregated[key].lastDate = dateVal;
  }

  // Clear existing rows (keep Row 1-2 headers)
  var lastRow = master.getLastRow();
  if (lastRow > 2) {
    master.getRange(3, 1, lastRow - 2, master.getLastColumn()).clearContent();
  }

  var today = new Date();
  var outputRows = [];

  for (var k in aggregated) {
    var item = aggregated[k];
    var minT = item.times.length > 0 ? Math.min.apply(null, item.times) : "-";
    var maxT = item.times.length > 0 ? Math.max.apply(null, item.times) : "-";
    var avgT = item.times.length > 0 ? Math.round(item.times.reduce(function(a,b){return a+b;},0) / item.times.length) : "-";

    // Dynamic interval: Easy: +15d, Medium: +7d, Hard: +3d
    var addDays = item.diff === "Easy" ? 15 : item.diff === "Hard" ? 3 : 7;
    var nextDue = new Date(today.getTime() + (addDays * 86400000));
    var nextDueStr = Utilities.formatDate(nextDue, Session.getScriptTimeZone(), "dd/MM/yyyy");

    outputRows.push([
      item.uid || makeUID(item.sub, item.ch, item.lec),
      item.sub,
      item.ch,
      item.lec,
      item.diff,
      item.lastDate || Utilities.formatDate(today, Session.getScriptTimeZone(), "dd/MM/yyyy"),
      0,
      nextDueStr,
      0,
      item.revCount,
      minT,
      avgT,
      maxT,
      item.lastDate || "",
      0
    ]);
  }

  if (outputRows.length > 0) {
    // Automatic row insertion if needed to prevent crash
    var neededRows = 2 + outputRows.length;
    var maxRows = master.getMaxRows();
    if (neededRows > maxRows) {
      master.insertRowsAfter(maxRows, neededRows - maxRows + 20);
    }
    master.getRange(3, 1, outputRows.length, outputRows[0].length).setValues(outputRows);
  }

  try {
    SpreadsheetApp.getUi().alert("✅ मास्टर डेटाबेस सफलतापूर्वक रीबिल्ड हुआ! कुल " + outputRows.length + " लेक्चर्स अपडेट हुए।");
  } catch (e) {}
}

// -------------------------------------------------------------
// हेल्पर्स (Helper Utilities)
// -------------------------------------------------------------
function normalizeDifficulty(val) {
  if (!val) return "Medium";
  // Filter out visible & invisible zero-width spaces
  var clean = val.toString().replace(/[\\u200B-\\u200D\\uFEFF]/g, '').trim().toLowerCase();
  if (clean.includes("easy") || clean.includes("आसान")) return "Easy";
  if (clean.includes("hard") || clean.includes("कठिन")) return "Hard";
  return "Medium";
}

function makeUID(sub, ch, lec) {
  var sCode = sub.split("-")[0].replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase() || "SUB";
  var cCode = ch.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase() || "CHP";
  var lNum = (lec.match(/\\d+/) || ["1"])[0];
  return sCode + "-" + cCode + "-L" + lNum;
}

function getOrCreateLogSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().indexOf(LOG_SHEET_KEYWORD) !== -1) {
      return sheets[i];
    }
  }
  return ss.getSheetByName(LOG_SHEET_KEYWORD) || ss.insertSheet(LOG_SHEET_KEYWORD);
}

function resetDashboard(sheet, props) {
  props.deleteProperty('isRunning');
  props.deleteProperty('startTime');
  props.deleteProperty('elapsedTime');
  props.deleteProperty('lockedSubject');
  props.deleteProperty('lockedChapter');
  props.deleteProperty('lockedLecture');

  sheet.getRange('F39').setValue(false);
  sheet.getRange('F40').setValue(false);
  sheet.getRange('F41').setValue(false);
  sheet.getRange('C41').clearContent();
}

function showMessage(sheet, msg, isError) {
  sheet.getRange('C35').setValue(msg);
}

function setReadyMessage(sheet) {
  sheet.getRange('C35').setValue("✅ तैयार: स्टार्ट करने के लिए चेकबॉक्स (F39) टिक करें।");
}
`;

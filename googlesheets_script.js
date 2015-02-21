
function doAll(){
  getAttendanceGrid();
  ConvertLogSheetToAttendance();
}

function getDayString(timefield){
  var dateObject = new Date(timefield);
  //var header = dateObject.getMonth() + "/" + dateObject.getDate() + "/" + dateObject.getYear();
  var header = Utilities.formatDate(dateObject, "EST", "MM.dd.y");
  return header;
}

function ConvertLogSheetToAttendance() {
  Logger.log("Starting log to attendance conversion");

  // Get the first sheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var logSheet = spreadsheet.getSheets()[0];

  // Get attendance sheet
  var attendanceSheet = spreadsheet.getSheets()[2];

  var rows = logSheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  // Get RCOS members
  var members = [];
  var memberCounts = {};
  var dates = {};
  for (var i = 1;i < numRows;i++){

    var name = values[i][1];
    members.push(name);

    if (!memberCounts[name]){
      memberCounts[name] = 1;
    }else{
      memberCounts[name]++;
    }

    var dayString = getDayString(values[i][0]);
    if (values[i][0] && !dates[dayString]){
      dates[dayString] = [values[i][1]];
    }else{
      Logger.log(dates[dayString]);
      Logger.log(values[i][1]);
      if (dates[dayString].indexOf(values[i][1]) == -1){
            dates[dayString].push(values[i][1]);
          }
      }
  }

  attendanceSheet.clear();

  var headerNum = 0;
  Logger.log(dates);
  for (var date in dates){
    var cell = attendanceSheet.getRange(1,1+headerNum);
    cell.setValue(date);
    var attendees = dates[date];
    for (var i = 0;i < attendees.length;i++){
      var cell = attendanceSheet.getRange(1 + 1 + i,1+headerNum);
      cell.setValue(attendees[i]);
    }
    headerNum++;
  }

  // MEMBER COUNTS SHEET
  var countsSheet = spreadsheet.getSheets()[3];
  countsSheet.clear();
  var row = 0;
  for (var name in memberCounts){
    row++;
    var cell = countsSheet.getRange(row,1);
    cell.setValue(name);
    cell = countsSheet.getRange(row,2);
    cell.setValue(memberCounts[name]);
  }

}

function getAttendanceGrid() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var form = ss.getSheets()[0];

  var entries = form.getDataRange();
  var numEntries = entries.getNumRows();
  var entryValues = entries.getValues();
  var sheet = ss.getSheets()[1];
  sheet.clear();

  sheet.getRange(1, 1).setValue("Name");
  sheet.getRange(1, 2).setValue("Phone");

  var attend=[];
  var line=[];
  line.push("Name");
  line.push("Phone");
  for (var i = 1; i < numEntries; i++) {
    var date = getDayString(entryValues[i][0]);
    if (entryValues[i][0] && line.indexOf(date)==-1){
      line.push(date);
     // Logger.log("Add date "+date+ entryValues[i][0]);
    }
  }
  attend.push(line);
  var lineSize=line.length
  for (var i = 1; i < numEntries; i++) {
    var person = -1;
    var name = entryValues[i][1];
    var phone = entryValues[i][2];
    var date = getDayString(entryValues[i][0]);
    for (var j = 1; j < attend.length; j++){
      if (attend[j][0]==name){
        person = j;
        break;
      }
    }
    if (person == -1){
      person = attend.length;
     // Logger.log(attend);
      line=[];
      for (var k = 0; k < lineSize; k++) {line[k] = "";}
      line[0]=name
      line[1]=phone
      attend.push(line);
        //  Logger.log(attend);
          Logger.log("Add "+name + ", "+person);
    }
    var d =attend[0].indexOf(date);
    attend[person][d]="Here";
    Logger.log(name+" was here "+person+","+d+" date "+date);
  }
    //Logger.log(attend);

  sheet.getRange(1,1,attend.length, lineSize).setValues(attend);
}


function addPersonToGrid(e){
  var entry = e.values;

  //var entry = ["10/13/2014 4:56:19","KM","1111111111"]
  Logger.log("Add" +entry+" to Grid");

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[1];

  var dateRange=sheet.getRange(1,1,1, sheet.getLastColumn());

  var peopleRange=sheet.getRange(1,1,sheet.getLastRow(), 1);
  var peopleList=peopleRange.getValues();

  var date = getDayString(entry[0]);
  var name = entry [1];
  var phone = entry [2];

  var d = dateRange.getValues()[0].indexOf(date);
  if (d == -1){
    d=sheet.getLastColumn();
    sheet.getRange(1,d+1).setValue(date);
    Logger.log("add date "+date+", "+d);
  }
  Logger.log("date is "+date+", "+d);


  var p = -1;
  for (var i = 1; i<peopleList.length; i++){
    if (peopleList[i][0]==name) {p = i;}
  }

  if (p == -1){
    p=sheet.getLastRow();
    sheet.getRange(p+1 , 1).setValue(name);
    sheet.getRange(p+1 , 2).setValue(phone);
    Logger.log("add person "+name+", "+p);
  }
      Logger.log("person is "+name+", "+p);

  sheet.getRange(p+1 , d+1,1,1).setValue("Here");
}



function addPersonToLog(e){
  var entry = e.values;
  //var entry = ["10/29/2014 4:56:19","KM","1111111111"]
    Logger.log("Add" +entry+" to Log");

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[2];

  var dateRange=sheet.getRange(1,1,1, sheet.getLastColumn());

  var date = getDayString(entry[0]);
  var name = entry [1];
  var phone = entry [2];

  var d = dateRange.getValues()[0].indexOf(date);
  if (d == -1){
    d=sheet.getLastColumn();
    sheet.getRange(1,d+1).setValue(date);
    Logger.log("add date "+date+", "+d);
  }
  Logger.log("date is "+date+", "+d);

  var peopleRange=sheet.getRange(1,d+1,sheet.getLastRow(), 1);
  var peopleList=peopleRange.getValues();

  var p = -1;
  for (var i = 1; i<peopleList.length; i++){
    if (peopleList[i][0]==name) {
      p = i;
      Logger.log("person "+name+" already logged at "+p);
      return;
    }
    if (peopleList[i][0]=="") {
      p = i;
      sheet.getRange(p+1 , d+1).setValue(name);
      Logger.log("add person "+name+", "+p);
      break;
    }
  }

  if (p == -1){
    p=sheet.getLastRow();
    sheet.getRange(p+1 , d+1).setValue(name);
    Logger.log("add person "+name+", "+p);
  }
   Logger.log("person is "+name+", "+p);


  Logger.log("Add count for "+name);

  sheet = ss.getSheets()[3];
  peopleRange=sheet.getRange(1,1,sheet.getLastRow(), 1);
  peopleList=peopleRange.getValues();

  var p = -1;
  for (var i = 1; i<peopleList.length; i++){
    if (peopleList[i][0]==name) {
      p = i;
      Logger.log("Increment person "+name+" at "+p);
      var spot = sheet.getRange(p+1 , 2)
      spot.setValue(spot.getValue()+1);
      return;
    }
    if (peopleList[i][0]=="") {
      p = i;
      sheet.getRange(p+1 , 1).setValue(name);
      Logger.log("add person "+name+", "+p);
      sheet.getRange(p+1 , 2).setValue(1);
      return;
    }
  }

  if (p == -1){
    p=sheet.getLastRow();
    sheet.getRange(p+1 , 1).setValue(name);
    sheet.getRange(p+1 , 2).setValue(1);
    Logger.log("add person "+name+", "+p);
  }
   Logger.log("person is "+name+", "+p);


}




function onFormSubmit(e){

    //Attendence Grid
  addPersonToGrid(e);

  //Daily Log and Meeting Count
  addPersonToLog(e);

}
/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the getAttendance() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
  {
    name : "All",
    functionName : "doAll"
  },
  {
    name : "Create Attendance Grid",
    functionName : "getAttendanceGrid"
  },
  {
    name : "Create Attendance List",
    functionName : "ConvertLogSheetToAttendance"
  }];
  spreadsheet.addMenu("Attendance Menu", entries);
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('My Progress');
      //.setSandboxMode(HtmlService.SandboxMode.NATIVE);//IFRAME);
}

function getInfo(student) {
  
  //var url = SitesApp.getActivePage().getUrl();
  var user = Session.getActiveUser().getEmail();
  //var info = [url,user];
  var spreadsheet = SpreadsheetApp.openById("1hU5NqS_zDjaVsCVULg0gYaYHhPYbk2umOGRZyDp_GcA");
  var dataSheet = spreadsheet.getSheetByName("Year 7&8 Data");
  var templateSheet = spreadsheet.getSheetByName("Attainment Template");
  var studentData = dataSheet.getDataRange().getValues();
  //var templateSheet = spreadsheet.getSheetByName("Attainment Template");
  var templateData = templateSheet.getDataRange().getValues();
  var studentEmail = Session.getActiveUser().getEmail();//"15s.ballester@kaa.org.uk"; //will make this whatever the currently logged in student is but for now test email.
  if (studentEmail=="k.owusu@kaa.org.uk") {
    Logger.log("i'm the student");
    try {
      studentEmail = ContactsApp.getContactsByName(student)[0].getEmails()[0].getAddress();
      Logger.log(studentEmail);
    }
    catch(err) {
      var results = false;
      return results;
    }
  }
  var row = getStudentRow(studentEmail, studentData);
  Logger.log(row);
  var columns = getColumns(templateData);
  Logger.log(columns);
  var results = getResults(row, columns, studentData, templateData);
  return results;
}

function getUser() {
  var user = Session.getActiveUser().getEmail();
  return user;
}

function getContacts() {
  var contacts = ContactsApp.getContacts();
  var names = [];
  contacts.forEach(function(contact) {
      names.push(contact.getFullName());
    });
  Logger.log(names);
  return(names);
}

function getStudentRow(studentEmail, studentData) {
  var email = studentEmail;
  var data = studentData;
  var row;
  for ( row = 0; row<studentData.length; row++) {
    //Logger.log(studentData[row][0]);
    if (studentData[row][0]==studentEmail) {
      break;
    }     
  }
  Logger.log(row);
  return row;
}

function getColumns(templateData){
  var columns = [];
  for (var i = 0; i<templateData.length; i++) {
    columns[i] = templateData[i][2]-1;
  }
  Logger.log(columns);
  return columns;
}

function getResults(row, columns, studentData, templateData) {
  Logger.log('in get results');
  var rRow = row;
  var rColumns = columns;
  var rData = studentData;
  var tData = templateData;
  var resultsData = [];
  for (var i=0; i < rColumns.length; i++) {
    Logger.log(templateData[i][0]);
    Logger.log(studentData[rRow][rColumns[i]]);
    //adapt for 1.2 and 1.0 and 0.1 notation
    var mark = studentData[rRow][rColumns[i]];
       
    //if (studentData[rRow][rColumns[i]] == 1) {
    
    if (typeof mark=='number'||mark=='A'||mark=='B'||mark=='C'||mark=='D') { //added to ignore blank or no marks but allow grade
    if (mark-1 >=0) {
      var rowData = [templateData[i][0],studentData[rRow][rColumns[i]]];
      } else {
      var rowData = [templateData[i][1],studentData[rRow][rColumns[i]]];
         }
    resultsData.push(rowData);
    }
  }
  Logger.log(resultsData);
  return resultsData;

}
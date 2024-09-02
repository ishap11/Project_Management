var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var projectDBName = 'COLLEGE-DB';
var projectRelationName = 'PROJECT-TABLE';
var connToken = '90932176|-31949215765002474|90963961';

$(document).ready(function() {
    $('#project-id').focus();

    // Attach event handlers
    $('#save').click(saveData);
    $('#change').click(changeData);
    $('#reset').click(resetForm);
    $('#project-id').change(getProject);
});

function saveRecN02LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getProjectIDAsJsonDbObj() {
    var projectId = $('#project-id').val();
    var jsonStr = { projectid: projectId };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecN02LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#project-name').val(record.projectname);
    $('#assigned-to').val(record.assignedto);
    $('#assignment-date').val(record.assignmentdate);
    $('#deadline').val(record.deadline);
    
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function resetForm() {
    $("#project-id").val("");
    $("#project-name").val("");
    $("#assigned-to").val("");
    $("#assignment-date").val("");
    $("#deadline").val("");
    $("#project-id").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#project-id").focus();
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') return;
    var putRequest = createPUTRequest(connToken, jsonStrObj, projectDBName, projectRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    alert("Your data has been successfully submitted!");
    resetForm();
    $("#project-id").focus();
}

function validateData() {
    var projectid = $("#project-id").val();
    var projectname = $("#project-name").val();
    var assignedto = $("#assigned-to").val();
    var assignmentdate = $("#assignment-date").val();
    var deadline = $("#deadline").val();

    if (projectid === '') {
        alert("Project ID missing");
        $("#project-id").focus();
        return "";
    }
    if (projectname === '') {
        alert("Project Name missing");
        $("#project-name").focus();
        return "";
    }
    if (assignedto === '') {
        alert("Assigned To missing");
        $("#assigned-to").focus();
        return "";
    }
    if (assignmentdate === '') {
        alert("Assignment Date missing");
        $("#assignment-date").focus();
        return "";
    }
    if (deadline === '') {
        alert("Deadline missing");
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        projectid: projectid,
        projectname: projectname,
        assignedto: assignedto,
        assignmentdate: assignmentdate,
        deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonChg = validateData();
    if (jsonChg === '') return;
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, projectDBName, projectRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $("#project-id").focus();
}

function getProject() {
    var projectIDJsonObj = getProjectIDAsJsonDbObj();
    var getRequest = createGET_BY_KEYRequest(connToken, projectDBName, projectRelationName, projectIDJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $('#project-name').focus();
    } else if (resJsonObj.status === 200) {
        $('#project-id').prop('disabled', true);
        fillData(resJsonObj);
    }
}
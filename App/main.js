let currentPatient;
let genderRNL;

$(document).ready(init);

function init() {
  genderRNL = $('.patient-edit form')[0].elements['gender'];
  $('.action-link').click(onActionLinkClick); //Applies to any button responsible for routing
  $('.patient-edit form').on('submit', onPatientEditFormSubmit);
  renderTable();
}

function onActionLinkClick(event) {
  //Show only the component specified in the data-target attribute of the clicked button
  const targetComponentSelector = $(event.target).data('target');
  navigate(targetComponentSelector);
}

function navigate(target) {
  //Hide all screens first
  hideAll();

  $(target).show();
}

function hideAll() {
  $('.component').hide();
}

function renderTable() {
  const tableBodyEl = $('.patients-list table tbody');
  tableBodyEl.empty(); //Clear the table first
  const rowTemplate = $('.patients-table-template').html();

  patientsData.forEach(function (record) {
    const rowHTML = renderTemplate(rowTemplate, record);
    tableBodyEl.append(rowHTML);
  });

  tableBodyEl.find('.action-link').click(onActionLinkClick);
  $('.patient-edit-btn').click(onPatientEditClick);
}

function renderTemplate(templateText, data) {
  return templateText.replaceAll(/{{2}(.+?)}{2}/g, (match, key) => data[key] );
  //In the above line, match is the entire matched placeholder, and key is
  //the captured group, which is the token inside the set of double braces.
}

function onPatientEditClick(event) {
  const patientID = $(event.target).data('id');
  $('.patient-id').html(patientID);
  currentPatient = patientsData.find(patient => patient.ID == patientID);
  $('#fname-field').val(currentPatient.fname);
  $('#mname-field').val(currentPatient.mname);
  $('#lname-field').val(currentPatient.lname);
  genderRNL.value = currentPatient.gender;
  $('#dob-field')[0].valueAsDate = currentPatient.DOB;
  $('#email-field').val(currentPatient.email);
  $('#last-check-field')[0].valueAsDate = currentPatient.lastCheck;
  $('#status-field').val(currentPatient.status);
}

function onPatientEditFormSubmit(event) {
  currentPatient.fname = $('#fname-field').val();
  currentPatient.mname = $('#mname-field').val();
  currentPatient.lname = $('#lname-field').val();
  currentPatient.gender = genderRNL.value;
  currentPatient.DOB = $('#dob-field')[0].valueAsDate;
  currentPatient.email = $('#email-field').val();
  currentPatient.lastCheck = $('#last-check-field')[0].valueAsDate;
  currentPatient.status = $('#status-field').val();
  
  renderTable();
  event.preventDefault(); //Prevent submitting the form
}

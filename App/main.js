let currentRow, currentPatient;

$(document).ready(init);

function init() {
  initRouter();
  initEdit();
  initDelete();
  renderTable();
}

function initRouter() {
  $('.action-link').click(onActionLinkClick); //Applies to any button responsible for routing
}

function initEdit() {
  $('.patient-add-btn').click(onPatientAddClick);
  $('.patient-edit form').on('submit', onPatientEditFormSubmit);
}

function initDelete() {
  $('#patient-del-confirm').on('show.bs.modal', onPatientDelConfirmShow);
  $('.patient-del-perform').click(onPatientDelYesClick);
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
  setCurrentPatient(event.target);
  fillPatientInfo();
}

function setCurrentPatient(trigger) {
  currentRow = $(trigger).parent().parent();
  const patientID = currentRow.data('id');
  currentPatient = patientsData.find(patient => patient.ID == patientID);
}

function onPatientAddClick() {
  currentPatient = null;
  resetPatientInfo();
}

function onPatientEditFormSubmit(event) {
  if (!currentPatient) {
    currentPatient = addNewPatient();
  }
  savePatientInfo();
  renderTable();
  event.preventDefault(); //Prevent submitting the form
}

function fillPatientInfo() {
  $('.patient-edit-heading').html(`Edit Patient ${currentPatient.ID}`);
  $('#fname-field').val(currentPatient.fname);
  $('#mname-field').val(currentPatient.mname);
  $('#lname-field').val(currentPatient.lname);
  const genderRNL = $('.patient-edit form')[0].elements['gender'];
  genderRNL.value = currentPatient.gender;
  const dateOfBirthStr = moment(currentPatient.DOB).format('YYYY-MM-DD');
  $('#dob-field').val(dateOfBirthStr);
  $('#email-field').val(currentPatient.email);
  const lastCheckStr = moment(currentPatient.lastCheck).format('YYYY-MM-DD');
  $('#last-check-field').val(lastCheckStr);
  $('#status-field').val(currentPatient.status);
  $('#active-check').prop('checked', currentPatient.Active);
}

function savePatientInfo() {
  currentPatient.fname = $('#fname-field').val();
  currentPatient.mname = $('#mname-field').val();
  currentPatient.lname = $('#lname-field').val();
  const genderRNL = $('.patient-edit form')[0].elements['gender'];
  currentPatient.gender = genderRNL.value;
  currentPatient.DOB = $('#dob-field')[0].valueAsDate;
  currentPatient.email = $('#email-field').val();
  currentPatient.lastCheck = $('#last-check-field')[0].valueAsDate;
  currentPatient.status = $('#status-field').val();
  currentPatient.Active = $('#active-check').prop('checked');
}

function resetPatientInfo() {
  $('.patient-edit-heading').html('New Patient');
  $('.patient-edit form')[0].reset();
}

function addNewPatient() {
  const newPatient = {ID: getNewID(), creationDate: new Date(), CreatedBy: 1};
  patientsData.push(newPatient);
  return newPatient;
}

//This function looks for the largest ID in the patients array, and returns that plus one
function getNewID() {
  const getLargerID = (prevMaxID, current) => Math.max(prevMaxID, current.ID); //Reducer function
  const maxID = patientsData.reduce(getLargerID, 0);
  return maxID + 1; //Return the next available number
}

function onPatientDelConfirmShow(event) {
  if( !$(event.relatedTarget).hasClass('patient-edit-del-btn') ) {
    setCurrentPatient(event.relatedTarget);
  }
  $('.patient-id').html(currentPatient.ID);
}

function onPatientDelYesClick() {
  DeletePatient(currentPatient.ID);
  currentRow.remove();
}

function DeletePatient(id) {
  const patientIndex = patientsData.findIndex(patient => patient.ID == id);
  patientsData.splice(patientIndex, 1);
}

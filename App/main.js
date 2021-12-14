let patientId, formMode;
let dataService, routerEngine, templateEngine;

$(document).ready(init);

function init() {
  dataService = new DataService;
  routerEngine = new RouterEngine;
  templateEngine = new TemplateEngine;
  dataService.init();
  routerEngine.init();
  templateEngine.init();
  initEdit();
  renderTable();
}

function initEdit() {
  $('.patient-add-btn').click(onPatientAddClick);
  $('.patient-edit .save-btn').click(onPatientSaveClick);

  //Triggered when the delete confirmation dialog is shown
  $('#patient-del-dialog').on('show.bs.modal', onPatientDeleteDialogShow);

  $('.patient-del-confirm-btn').click(onPatientDeleteConfirmed);
}

function openList() {
  routerEngine.navigate('.patients-list');
  renderTable();
}

function openEdit(id) {
  clearValidationFeedback();
  patientId = id;
  if (id === undefined) {
    formMode = 'new';
    $('.patient-edit-del-btn').hide();
    resetControls();
  }
  else {
    formMode = 'edit';
    $('.patient-edit-del-btn').show();
    const selectedPatient = dataService.getPatientById(id);
    loadControlsData(selectedPatient);
  }

  routerEngine.navigate('.patient-edit');
}

function onPatientAddClick() {
  openEdit();
}

function onPatientEditClick(event) {
  const selectedRow = $(event.target).closest('tr');
  const seletedPatientId = selectedRow.data('id');
  openEdit(seletedPatientId);
}

function onPatientSaveClick() {
  clearValidationFeedback();
  if (!validateForm()) {
    return;
  }
  const patient = getControlsData();
  if (formMode === 'edit') {
    dataService.editPatient(patient);
  }
  else {
    dataService.addPatient(patient);
  }
  openList();
}

/* This is the event handler that is triggered when the delete
confirmation dialog is shown. Its purpose is to display the patient's
ID in the dialog, and store it for use when deletion is confirmed. */
function onPatientDeleteDialogShow(event) {
  /* Determine whether the button that triggered the modal is
  the Delete button in the Edit screen or not (if not, it will
  be one of the Delete buttons in the Patients List screen).
  The Delete button in Edit screen has .patient-edit-del-btn */
  const trigger = $(event.relatedTarget);
  let id;

  if (trigger.hasClass('patient-edit-del-btn')) {
    //Triggered from Edit Patient screen
    id = patientId;
  }
  else {
    //Triggered from Patients List screen
    const selectedRow = trigger.closest('tr');
    id = selectedRow.data('id'); //Get the ID stored in the associated row
  }

  $('#patient-del-dialog .patient-id').html(id); //Display the ID in the dialog
  $('#patient-del-dialog .patient-del-confirm-btn').data('id', id); //Store the ID in the confirmation (Yes) button
}

function onPatientDeleteConfirmed(event) {
  const targetPatientId = $(event.target).data('id'); //Get the ID stored in the confirmation (Yes) button
  dataService.deletePatient(targetPatientId);
  openList();
}

function renderTable() {
  const tableBodyEl = $('.patients-list table tbody');
  tableBodyEl.empty(); //Clear the table first
  const rowTemplate = $('.patients-table-template').html();

  const patientsArr = dataService.getAll();
  patientsArr.forEach(function (record) {
    const rowHTML = templateEngine.renderTemplate(rowTemplate, record);
    tableBodyEl.append(rowHTML);
  });

  $('.patient-edit-btn').click(onPatientEditClick); //Attach an event handler to the newly created Edit buttons
}

function loadControlsData(patient) {
  $('.patient-edit-heading').html('Edit Patient ' + patient.ID);

  $('#fname-field').val(patient.fname);
  $('#mname-field').val(patient.mname);
  $('#lname-field').val(patient.lname);

  const genderRNL = $('.patient-edit form')[0].elements['gender'];
  genderRNL.value = patient.gender;

  const dateOfBirthStr = moment(patient.DOB).format('YYYY-MM-DD');
  $('#dob-field').val(dateOfBirthStr);

  $('#email-field').val(patient.email);

  const lastCheckStr = moment(patient.lastCheck).format('YYYY-MM-DD');
  $('#last-check-field').val(lastCheckStr);

  $('#status-field').val(patient.status);
  $('#active-check').prop('checked', patient.Active);

  return patient;
}

function getControlsData() {
  const genderRNL = $('.patient-edit form')[0].elements['gender'];

  const patient = {
    ID: patientId,
    fname: $('#fname-field').val(),
    mname: $('#mname-field').val(),
    lname: $('#lname-field').val(),
    gender: Number(genderRNL.value),
    DOB: $('#dob-field')[0].valueAsDate,
    email: $('#email-field').val(),
    lastCheck: $('#last-check-field')[0].valueAsDate,
    status: Number($('#status-field').val()),
    Active: $('#active-check').prop('checked'),
  };

  return patient;
}

function resetControls() {
  $('.patient-edit-heading').html('New Patient');
  $('#fname-field').val('');
  $('#mname-field').val('');
  $('#lname-field').val('');
  $('#gender-male').prop('checked', false);
  $('#gender-female').prop('checked', false);
  $('#dob-field').val('');
  $('#age-field').val('');
  $('#email-field').val('');
  $('#last-check-field').val('');
  $('#status-field').val('0');
  $('#active-check').prop('checked', false);
}

function clearValidationFeedback() {
  $('#fname-field').removeClass('is-invalid');
  $('#mname-field').removeClass('is-invalid');
  $('#lname-field').removeClass('is-invalid');
  $('#dob-field').removeClass('is-invalid');
  $('#age-field').removeClass('is-invalid');
  $('#email-field').removeClass('is-invalid');
}

function validateForm() {
  let valid = true;
  if ($('#fname-field').val().trim().length == 0) {
    valid = false;
    $('#fname-field').addClass('is-invalid');
  }

  if ($('#mname-field').val().trim().length == 0) {
    valid = false;
    $('#mname-field').addClass('is-invalid');
  }

  if ($('#lname-field').val().trim().length == 0) {
    valid = false;
    $('#lname-field').addClass('is-invalid');
  }

  const dob = $('#dob-field')[0].valueAsDate;
  if (!dob || dob.getTime() > Date.now()) {
    valid = false;
    $('#dob-field').addClass('is-invalid');
  }

  const age = $('#age-field')[0].valueAsNumber;
  if (isNaN(age) || age <= 0) {
    valid = false;
    $('#age-field').addClass('is-invalid');
  }

  const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const email = $('#email-field').val();
  if (!emailRegExp.test(email)) {
    valid = false;
    $('#email-field').addClass('is-invalid');
  }

  return valid;
}

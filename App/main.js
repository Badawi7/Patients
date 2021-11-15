let patientId, formMode;

$(document).ready(init);

function init() {
  initRouter();
  initEdit();
  renderTable();
}

function initRouter() {
  $('.action-link').click(onActionLinkClick); //Applies to any button responsible for routing
}

function initEdit() {
  $('.patient-add-btn').click(onPatientAddClick);
  $('.patient-edit form').on('submit', onPatientEditFormSubmit);

  //Triggered when the delete confirmation dialog is shown
  $('#patient-del-dialog').on('show.bs.modal', onPatientDeleteDialogShow);

  $('.patient-del-confirm-btn').click(onPatientDeleteConfirmed);
}

function navigate(target) {
  //Hide all screens first
  hideAll();

  $(target).show();
}

function hideAll() {
  $('.component').hide();
}

function openList() {
  navigate('.patients-list');
  renderTable();
}

function openEdit(id) {
  patientId = id;
  if (id === undefined) {
    formMode = 'new';
    $('.patient-edit-del-btn').hide();
    resetControls();
  }
  else {
    formMode = 'edit';
    $('.patient-edit-del-btn').show();
    const selectedPatient = getPatientById(id);
    loadControlsData(selectedPatient);
  }

  navigate('.patient-edit');
}

function onActionLinkClick(event) {
  //Show only the component specified in the data-target attribute of the clicked button
  const targetComponentSelector = $(event.target).data('target');
  navigate(targetComponentSelector);
}

function onPatientAddClick() {
  openEdit();
}

function onPatientEditClick(event) {
  const selectedRow = $(event.target).closest('tr');
  const seletedPatientId = selectedRow.data('id');
  openEdit(seletedPatientId);
}

function onPatientEditFormSubmit(event) {
  const patient = getControlsData();
  if (formMode === 'edit') {
    editPatient(patient);
  }
  else {
    addPatient(patient);
  }
  openList();
  event.preventDefault(); //Prevent submitting the form
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
  deletePatient(targetPatientId);
  openList();
}

function renderTable() {
  const tableBodyEl = $('.patients-list table tbody');
  tableBodyEl.empty(); //Clear the table first
  const rowTemplate = $('.patients-table-template').html();

  patientsData.forEach(function (record) {
    const rowHTML = renderTemplate(rowTemplate, record);
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
    fname: $('#fname-field').val(),
    mname: $('#mname-field').val(),
    lname: $('#lname-field').val(),
    gender: genderRNL.value,
    DOB: $('#dob-field')[0].valueAsDate,
    email: $('#email-field').val(),
    lastCheck: $('#last-check-field')[0].valueAsDate,
    status: $('#status-field').val(),
    Active: $('#active-check').prop('checked'),
  };

  return patient;
}

function resetControls() {
  $('.patient-edit-heading').html('New Patient');
  $('#fname-field').val('');
  $('#mname-field').val('');
  $('#lname-field').val('');

  const genderRNL = $('.patient-edit form')[0].elements['gender'];
  genderRNL.value = '';

  $('#dob-field').val('');
  $('#email-field').val('');
  $('#last-check-field').val('');
  $('#status-field').val('0');
  $('#active-check').prop('checked', false);
}

function renderTemplate(templateText, data) {
  return templateText.replaceAll(/{{2}(.+?)}{2}/g, (match, key) => data[key]);
  //In the above line, match is the entire matched placeholder, and key is
  //the captured group, which is the token inside the set of double braces.
}

function addPatient(patient) {
  patient.ID = getNewId();
  patient.creationDate = new Date();
  patient.CreatedBy = 1;
  patientsData.push(patient);
  return patient;
}

function editPatient(patient) {
  //Use the global patientId to get the target patient object,
  //because the patient object passed as an argument has no ID
  const targetPatient = getPatientById(patientId);
  targetPatient.fname = patient.fname;
  targetPatient.mname = patient.mname;
  targetPatient.lname = patient.lname;
  targetPatient.gender = patient.gender;
  targetPatient.DOB = patient.DOB;
  targetPatient.email = patient.email;
  targetPatient.lastCheck = patient.lastCheck;
  targetPatient.status = patient.status;
  targetPatient.Active = patient.Active;
  return targetPatient;
}

function deletePatient(id) {
  const patientIndex = getPatientIndexById(id);
  const deletedPatient = patientsData.splice(patientIndex, 1)[0];
  return deletedPatient;
}

//This function looks for the largest ID in the patients array, and returns that plus one
function getNewId() {
  let maxId = 0;

  for (let i = 0; i < patientsData.length; i++) {
    if (patientsData[i].ID > maxId) {
      maxId = patientsData[i].ID;
    }
  }

  return maxId + 1; //Return the next available number
}

function getPatientIndexById(id) {
  let index;

  for (let i = 0; i < patientsData.length; i++) {
    if (patientsData[i].ID === id) {
      index = i;
      break; //Stop searching, as the index has been found
    }
  }

  return index;
}

function getPatientById(id) {
  let patient;

  for (let i = 0; i < patientsData.length; i++) {
    if (patientsData[i].ID === id) {
      patient = patientsData[i];
      break; //Stop searching, as the patient object has been found
    }
  }

  return patient;
}

let patientsListEl, patientEditEl, usersListEl, userEditEl;

$(document).ready(init);

function init() {
  patientsListEl = $('.patients-list'); //The element that holds the Patients List screen
  patientEditEl = $('.patient-edit'); //The element that holds the Patient Edit screen
  usersListEl = $('.users-list'); //The element that holds the Users List screen
  userEditEl = $('.user-edit'); //The element that holds the User Edit screen

  $('.sidebar .sidebar-menu .patients-btn').click(onPatientsClick);
  $('.patient-add-btn').click(onPatientsAddClick);
  $('.patient-edit-btn').click(onPatientEditClick);
  $('.patient-edit form').on('submit', onPatientEditSubmit);
  $('.patient-edit-cancel-btn').click(onPatientCancelClick);

  $('.sidebar .sidebar-menu .users-btn').click(onUsersClick);
  $('.user-add-btn').click(onUsersAddClick);
  $('.user-edit-btn').click(onUserEditClick);
  $('.user-edit form').on('submit', onUserEditSubmit);
  $('.user-edit-cancel-btn').click(onUserCancelClick);
}

function onPatientsClick() {
  goToPatientsList();
}

function onUsersClick() {
  goToUsersList();
}

function onPatientsAddClick() {
  goToPatientEdit();
}

function onUsersAddClick() {
  goToUserEdit();
}

function onPatientEditClick() {
  goToPatientEdit();
}

function onUserEditClick() {
  goToUserEdit();
}

function onPatientEditSubmit(event) {
  event.preventDefault(); //Prevent submitting for now
  goToPatientsList();
}

function onPatientCancelClick() {
  goToPatientsList();
}

function onUserEditSubmit(event) {
  event.preventDefault(); //Prevent submitting for now
  goToUsersList();
}

function onUserCancelClick() {
  goToUsersList();
}

//This function causes only the Patients List
//screen to be shown, and hides the other ones
function goToPatientsList() {
  patientEditEl.hide();
  usersListEl.hide();
  userEditEl.hide();
  patientsListEl.show();
}

//This function causes only the Patient Edit
//screen to be shown, and hides the other ones
function goToPatientEdit() {
  patientsListEl.hide();
  usersListEl.hide();
  userEditEl.hide();
  patientEditEl.show();
}

//This function causes only the Users List
//screen to be shown, and hides the other ones
function goToUsersList() {
  patientsListEl.hide();
  patientEditEl.hide();
  userEditEl.hide();
  usersListEl.show();
}

//This function causes only the User Edit
//screen to be shown, and hides the other ones
function goToUserEdit() {
  patientsListEl.hide();
  patientEditEl.hide();
  usersListEl.hide();
  userEditEl.show();
}

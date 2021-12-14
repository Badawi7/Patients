class PatientEdit {
  patientId;
  formMode;

  constructor() {
  }

  init() {
    $('.patient-edit .save-btn').click(this.onPatientSaveClick);

    //Triggered when the delete confirmation dialog is shown
    $('#patient-del-dialog').on('show.bs.modal', this.onPatientDeleteDialogShow);

    $('.patient-del-confirm-btn').click(this.onPatientDeleteConfirmed);
  }

  open(id) {
    this.clearValidationFeedback();
    this.patientId = id;
    if (id === undefined) {
      this.formMode = 'new';
      $('.patient-edit-del-btn').hide();
      this.resetControls();
    }
    else {
      this.formMode = 'edit';
      $('.patient-edit-del-btn').show();
      const selectedPatient = dataService.getPatientById(id);
      this.loadControlsData(selectedPatient);
    }

    routerEngine.navigate('.patient-edit');
  }

  onPatientSaveClick = () => {
    this.clearValidationFeedback();
    if (!this.validateForm()) {
      return;
    }
    const patient = this.getControlsData();
    if (this.formMode === 'edit') {
      dataService.editPatient(patient);
    }
    else {
      dataService.addPatient(patient);
    }
    patientsList.open();
  }

  /* This is the event handler that is triggered when the delete
  confirmation dialog is shown. Its purpose is to display the patient's
  ID in the dialog, and store it for use when deletion is confirmed. */
  onPatientDeleteDialogShow = (event) => {
    /* Determine whether the button that triggered the modal is
    the Delete button in the Edit screen or not (if not, it will
    be one of the Delete buttons in the Patients List screen).
    The Delete button in Edit screen has .patient-edit-del-btn */
    const trigger = $(event.relatedTarget);
    let id;

    if (trigger.hasClass('patient-edit-del-btn')) {
      //Triggered from Edit Patient screen
      id = this.patientId;
    }
    else {
      //Triggered from Patients List screen
      const selectedRow = trigger.closest('tr');
      id = selectedRow.data('id'); //Get the ID stored in the associated row
    }

    $('#patient-del-dialog .patient-id').html(id); //Display the ID in the dialog
    $('#patient-del-dialog .patient-del-confirm-btn').data('id', id); //Store the ID in the confirmation (Yes) button
  }

  onPatientDeleteConfirmed(event) {
    const targetPatientId = $(event.target).data('id'); //Get the ID stored in the confirmation (Yes) button
    dataService.deletePatient(targetPatientId);
    patientsList.open();
  }

  loadControlsData(patient) {
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

  getControlsData() {
    const genderRNL = $('.patient-edit form')[0].elements['gender'];

    const patient = {
      ID: this.patientId,
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

  resetControls() {
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

  clearValidationFeedback() {
    $('#fname-field').removeClass('is-invalid');
    $('#mname-field').removeClass('is-invalid');
    $('#lname-field').removeClass('is-invalid');
    $('#dob-field').removeClass('is-invalid');
    $('#age-field').removeClass('is-invalid');
    $('#email-field').removeClass('is-invalid');
  }

  validateForm() {
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
}

class PatientEdit {
  patientId = null;
  formMode = null;

  constructor() {
  }

  init() {
    $('.patient-edit .save-btn').click(this.onSavePatientClick);

    //Triggered when the delete confirmation dialog is shown
    $('#patient-edit-del-dialog').on('show.bs.modal', this.onDeletePatientDialogShow);

    $('#patient-edit-del-dialog .patient-del-confirm-btn').click(this.onDeletePatientConfirmed);
  }

  open(id) {
    this.clearValidationFeedback();
    this.patientId = id;
    if (id) {
      this.formMode = 'edit';
      $('.patient-edit-del-btn').prop('disabled', false);
      const selectedPatient = dataService.get(id);
      this.loadControlsData(selectedPatient);
    }
    else {
      this.formMode = 'new';
      $('.patient-edit-del-btn').prop('disabled', true);
      this.resetControls();
    }

    routerEngine.navigate('.patient-edit');
  }

  onSavePatientClick = () => {
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

  /* This is the event handler that is triggered when
  the delete confirmation dialog is shown. Its purpose
  is to display the patient's name and ID in the dialog. */
  onDeletePatientDialogShow = () => {
    const patient = dataService.get(this.patientId);
    const fullName = patient.fname + ' ' + patient.mname + ' ' + patient.lname;
    $('#patient-edit-del-dialog .patient-name').html(fullName); //Display the name in the dialog
    $('#patient-edit-del-dialog .patient-id').html(this.patientId); //Display the ID in the dialog
  }

  onDeletePatientConfirmed = () => {
    dataService.deletePatient(this.patientId);
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
    $('.is-invalid').removeClass('is-invalid');
    $('.error-message').hide();
  }

  validateForm() {
    let valid = true;
    const fieldsToValidate = $('[data-validation]');
    const self = this;
    fieldsToValidate.each(function(i, el) {
      if (!self.validateField($(el))) {
        valid = false;
      }
    });

    return valid;
  }

  validateField(field) {
    let valid = null;
    switch (field.data('validation')) {
      case 'required':
        valid = this.validateRequiredField(field);
        break;
      case 'positive-number':
        valid = this.validatePositiveNumberField(field);
        break;
      case 'email':
        valid = this.validateEmailField(field);
        break;
      case 'past-date':
        valid = this.validatePastDateField(field);
        break;
      default:
        throw 'Invalid validation type.';
    }
    if (!valid) {
      this.showError(field);
    }
    return valid;
  }

  validateRequiredField(field) {
    const valid = (field.val().trim().length > 0);
    return valid;
  }

  validatePastDateField(field) {
    const date = field[0].valueAsDate;
    const valid = (date != null && date.getTime() < Date.now());
    return valid;
  }

  validatePositiveNumberField(field) {
    const n = field[0].valueAsNumber;
    const valid = (n > 0);
    return valid;
  }

  validateEmailField(field) {
    const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const email = field.val();
    const valid = emailRegExp.test(email);
    return valid;
  }

  showError(field) {
    field.addClass('is-invalid');
    field.siblings('.error-message').show();
  }
}

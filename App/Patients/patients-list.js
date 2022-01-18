class PatientsList {
  constructor() {
  }

  init() {
    $('.patient-add-btn').click(this.onAddPatientClick);

    //Triggered when the delete confirmation dialog is shown
    $('#patient-list-del-dialog').on('show.bs.modal', this.onDeletePatientDialogShow);

    $('#patient-list-del-dialog .patient-del-confirm-btn').click(this.onDeletePatientConfirmed);
    this.renderTable();
  }

  open() {
    routerEngine.navigate('.patients-list');
    this.renderTable();
  }

  onAddPatientClick() {
    patientEdit.open();
  }

  onEditPatientClick(event) {
    const selectedRow = $(event.target).closest('tr');
    const seletedPatientId = selectedRow.data('id');
    patientEdit.open(seletedPatientId);
  }

  /* This is the event handler that is triggered when the delete confirmation
  dialog is shown. Its purpose is to display the patient's name and ID in the
  dialog, and store the ID for use when deletion is confirmed. */
  onDeletePatientDialogShow(event) {
    const trigger = $(event.relatedTarget);
    const selectedRow = trigger.closest('tr');
    const id = selectedRow.data('id'); //Get the ID stored in the associated row
    const patient = dataService.get(id);
    const fullName = patient.fname + ' ' + patient.mname + ' ' + patient.lname;
    $('#patient-list-del-dialog .patient-name').html(fullName); //Display the name in the dialog
    $('#patient-list-del-dialog .patient-id').html(id); //Display the ID in the dialog
    $('#patient-list-del-dialog .patient-del-confirm-btn').data('id', id); //Store the ID in the confirmation (Yes) button
  }

  onDeletePatientConfirmed = (event) => {
    const targetPatientId = $(event.target).data('id'); //Get the ID stored in the confirmation (Yes) button
    dataService.deletePatient(targetPatientId);
    this.renderTable();
  }

  renderTable() {
    const tableBodyEl = $('.patients-list table tbody');
    tableBodyEl.empty(); //Clear the table first
    const rowTemplate = $('.patients-table-template').html();

    const patientsArr = dataService.getAll();
    patientsArr.forEach(function (record) {
      const rowHTML = templateEngine.renderTemplate(rowTemplate, record);
      tableBodyEl.append(rowHTML);
    });

    this.addEditClickEvent(); //Attach an event handler to the newly created Edit buttons
  }

  addEditClickEvent() {
    $('.patient-edit-btn').click(this.onEditPatientClick);
  }
}

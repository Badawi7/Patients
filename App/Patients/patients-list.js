class PatientsList {
  constructor() {
  }

  init() {
    $('.patient-add-btn').click(this.onPatientAddClick);
    this.renderTable();
  }

  open() {
    routerEngine.navigate('.patients-list');
    this.renderTable();
  }

  onPatientAddClick() {
    patientEdit.open();
  }

  onPatientEditClick(event) {
    const selectedRow = $(event.target).closest('tr');
    const seletedPatientId = selectedRow.data('id');
    patientEdit.open(seletedPatientId);
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

    $('.patient-edit-btn').click(this.onPatientEditClick); //Attach an event handler to the newly created Edit buttons
  }
}

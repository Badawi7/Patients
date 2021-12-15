class PatientsList {
  constructor() {
  }

  init() {
    $('.patient-add-btn').click(this.onAddPatientClick);
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

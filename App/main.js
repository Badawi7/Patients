$(document).ready(init);

function init() {
  $('.router-link').click(onRouterLinkClick); //Applies to any button responsible for routing

  //Temporary (start)
  navigate('.patients-list');
  renderTable($('.patients-list table'), patientsData);
  //Temporary (end)
}

function onRouterLinkClick(event) {
  //Hide all screens first
  hideAllComponents();

  //Show only the component specified in the data-target attribute of the clicked button
  const targetComponentSelector = $(event.target).data('target');
  navigate(targetComponentSelector);
}

function hideAllComponents() {
  $('.component').hide();
}

function navigate(target) {
  $(target).show();
}

function renderTable(targetTable, sourceData) {
  const tableBodyEl = targetTable.find('tbody');
  tableBodyEl.html(''); //Clear the table first
  sourceData.forEach(function (sourceRecord) {
    addTableRow(tableBodyEl, sourceRecord);
  });
}

function addTableRow(targetTableBody, record) {
  let rowHTML = '<tr><td>' +
    record.ID + '</td><td>' +
    record.fname + ' ' + record.mname + ' ' + record.lname + '</td><td>' +
    record.email + '</td><td>' +
    record.gender + '</td><td>' +
    record.DOB + '</td><td>' +
    record.Active + '</td><td>By ' +
    record.CreatedBy + ' at ' + record.creationDate + '</td><td>' +
    '<button type="button" class="btn btn-outline-secondary router-link" ' +
    'data-target=".patient-edit">Edit</button></td></tr>';

  targetTableBody.append(rowHTML);
}

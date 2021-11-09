$(document).ready(init);

function init() {
  renderTable();
  $('.action-link').click(onActionLinkClick); //Applies to any button responsible for routing
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
  const rowTemplate = '<tr><td>{{ID}}</td>' +
  '<td>{{fname}} {{mname}} {{lname}}</td>' +
  '<td>{{email}}</td>' +
  '<td>{{gender}}</td>' +
  '<td>{{DOB}}</td>' +
  '<td>{{Active}}</td>' +
  '<td>By {{CreatedBy}} at {{creationDate}}</td>' +
  '<td><button type="button" class="btn btn-outline-secondary action-link" ' +
  'data-target=".patient-edit">Edit</button></td></tr>';

  patientsData.forEach(function (record) {
    const rowHTML = renderTemplate(rowTemplate, record);
    tableBodyEl.append(rowHTML);
  });
}

function renderTemplate(templateText, data) {
  let result = templateText;
  let currentPosition = result.indexOf('{{');
  while (currentPosition > -1) {
    const end = result.indexOf('}}', currentPosition + 2); //Start searching after the opening braces
    const placeholder = result.substring(currentPosition, end + 2);
    const key = result.substring(currentPosition + 2, end);
    result = result.replace(placeholder, data[key]);

    currentPosition = result.indexOf('{{', currentPosition); //Start searching from the current position
  }
  return result;
}

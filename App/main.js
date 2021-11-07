$(document).ready(init);

function init() {
  $('.action-link').click(onActionLinkClick); //Applies to any button responsible for routing

  //Temporary (start)
  navigate('.patients-list');
  renderTable($('.patients-list table'), patientsData);
  //Temporary (end)
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

  patientsData.forEach(function (record) {
    const rowHTML = `<tr><td>${record.ID}</td>
    <td>${record.fname} ${record.mname} ${record.lname}</td>
    <td>${record.email}</td>
    <td>${record.gender}</td>
    <td>${record.DOB}</td>
    <td>${record.Active}</td>
    <td>By ${record.CreatedBy} at ${record.creationDate}</td>
    <td><button type="button" class="btn btn-outline-secondary router-link" data-target=".patient-edit">Edit</button></td></tr>`;
    tableBodyEl.append(rowHTML);
  });
}

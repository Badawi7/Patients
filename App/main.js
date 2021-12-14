let dataService, routerEngine, templateEngine;
let patientsList, patientEdit;

$(document).ready(init);

function init() {
  dataService = new DataService;
  routerEngine = new RouterEngine;
  templateEngine = new TemplateEngine;
  patientsList = new PatientsList;
  patientEdit = new PatientEdit;
  dataService.init();
  routerEngine.init();
  templateEngine.init();
  patientsList.init();
  patientEdit.init();
}

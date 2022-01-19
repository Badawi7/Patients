let dataService, routerEngine, templateEngine, validationEngine;
let patientsList, patientEdit;

$(document).ready(init);

function init() {
  dataService = new DataService;
  routerEngine = new RouterEngine;
  templateEngine = new TemplateEngine;
  validationEngine = new ValidationEngine;
  patientsList = new PatientsList;
  patientEdit = new PatientEdit;
  dataService.init();
  routerEngine.init();
  templateEngine.init();
  validationEngine.init();
  patientsList.init();
  patientEdit.init();
}

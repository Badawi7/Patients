class DataService {
  constructor() {
  }

  init() {
  }

  addPatient(patient) {
    patient.ID = this.getNewId();
    patient.creationDate = new Date();
    patient.CreatedBy = 1;
    patientsData.push(patient);
    return patient;
  }
  
  editPatient(patient) {
    const targetPatient = this.getPatientById(patient.ID);
    targetPatient.fname = patient.fname;
    targetPatient.mname = patient.mname;
    targetPatient.lname = patient.lname;
    targetPatient.gender = patient.gender;
    targetPatient.DOB = patient.DOB;
    targetPatient.email = patient.email;
    targetPatient.lastCheck = patient.lastCheck;
    targetPatient.status = patient.status;
    targetPatient.Active = patient.Active;
    return targetPatient;
  }
  
  deletePatient(id) {
    const patientIndex = this.getPatientIndexById(id);
    const deletedPatient = patientsData.splice(patientIndex, 1)[0];
    return deletedPatient;
  }
  
  //This function looks for the largest ID in the patients array, and returns that plus one
  getNewId() {
    let maxId = 0;
  
    for (let i = 0; i < patientsData.length; i++) {
      if (patientsData[i].ID > maxId) {
        maxId = patientsData[i].ID;
      }
    }
  
    return maxId + 1; //Return the next available number
  }
  
  getPatientIndexById(id) {
    let index;
  
    for (let i = 0; i < patientsData.length; i++) {
      if (patientsData[i].ID === id) {
        index = i;
        break; //Stop searching, as the index has been found
      }
    }
  
    return index;
  }
  
  getPatientById(id) {
    let patient;
  
    for (let i = 0; i < patientsData.length; i++) {
      if (patientsData[i].ID === id) {
        patient = patientsData[i];
        break; //Stop searching, as the patient object has been found
      }
    }
  
    return patient;
  }
  
  getAll() {
    return patientsData;
  }
}

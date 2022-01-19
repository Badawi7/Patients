class ValidationEngine {
  constructor() {
  }

  init() {
  }

  validateForm() {
    let valid = true;
    let summary = '';
    const fieldsToValidate = $('[data-validation]');
    const self = this;
    fieldsToValidate.each(function(i, el) {
      if (!self.validateField($(el))) {
        valid = false;
        summary += $(el).siblings('.error-message').html() + '<br>';
      }
    });
    $('.patient-edit .error-summary').html(summary);
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

  clearValidationFeedback() {
    $('.patient-edit .error-summary').html('');
    $('.is-invalid').removeClass('is-invalid');
    $('.error-message').hide();
  }
}

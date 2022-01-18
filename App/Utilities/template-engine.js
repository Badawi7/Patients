class TemplateEngine {
  constructor() {
  }

  init() {
  }

  renderTemplate(templateText, data) {
    //In the following line, match is the entire matched placeholder, and token is
    //the captured group, which is the string inside the set of double braces.
    const renderedText = templateText.replaceAll(/{{2}(.+?)}{2}/g, (match, token) => this.#placeholderReplacer(token, data));
    return renderedText;
  }

  #placeholderReplacer(token, data) {
    const parts = token.split(' | ');
    const value = data[parts[0]];
    let result = null;
    if (parts.length < 2) {
      result = value;
    }
    else {
      switch (parts[1]) {
        case 'date':
          if (parts.length > 2) {
            result = this.datePipe(value, parts[2]);
          }
          else {
            result = this.datePipe(value, 'DD/MM/YYYY');
          }
          break;
        case 'status':
          result = this.statusPipe(value);
          break;
        case 'gender':
          result = this.genderPipe(value);
          break;
        default:
          throw 'Invalid formatter';
      }
    }
    return result;
  }

  datePipe(date, format) {
    const dateStr = moment(date).format(format);
    return dateStr;
  }

  statusPipe(value) {
    let status = null;
    switch (value) {
      case 0:
        status = 'inactive';
        break;
      case 1:
        status = 'active';
        break;
      default:
        throw 'Invalid status value';
    }
    return status;
  }

  genderPipe(value) {
    let gender = null;
    switch (value) {
      case 1:
        gender = 'Male';
        break;
      case 2:
        gender = 'Female';
        break;
      default:
        throw 'Invalid gender value';
    }
    return gender;
  }
}

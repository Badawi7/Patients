class TemplateEngine {
  constructor() {
  }

  init() {
  }

  renderTemplate(templateText, data) {
    return templateText.replaceAll(/{{2}(.+?)}{2}/g, (match, key) => data[key]);
    //In the above line, match is the entire matched placeholder, and key is
    //the captured group, which is the token inside the set of double braces.
  }
}

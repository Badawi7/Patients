class RouterEngine {
  constructor() {
  }

  init() {
    $('.action-link').click(this.onActionLinkClick);
  }

  navigate(target) {
    //Hide all screens first
    this.hideAll();

    $(target).show();
  }

  hideAll() {
    $('.component').hide();
  }

  onActionLinkClick = (event) => {
    //Show only the component specified in the data-target attribute of the clicked button
    const targetComponentSelector = $(event.target).data('target');
    this.navigate(targetComponentSelector);
  }
}

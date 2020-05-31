import {settings, select} from '../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
    thisWidget.value = settings.amountWidget.defaultValue;
  }

  getElements(element) {
    const thisWidget = this;
    thisWidget.element = element;
    thisWidget.input = element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = element.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.lineIncrease = element.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);

    if (
      thisWidget.value !== newValue &&
      newValue >= settings.amountWidget.defaultMin &&
      newValue <= settings.amountWidget.defaultMax
    ) {
      thisWidget.value = newValue;
      thisWidget.input.value = newValue;
      thisWidget.announce();
    }
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', (e) => {
      thisWidget.setValue(e.target.value);
    });

    thisWidget.linkDecrease.addEventListener('click', () => {
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.lineIncrease.addEventListener('click', () => {
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  announce() {
    const thisWidget = this;
    const event = new CustomEvent('updated', {
      bubbles: true,
    });
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;

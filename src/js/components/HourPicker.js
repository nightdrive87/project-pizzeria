import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';

class HourPicker extends BaseWidget {
  constructor(element) {
    super(element, settings.hours.open);

    const thisWidget = this;

    thisWidget.dom.input = element.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = element.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.renderValue();
    thisWidget.dom.input.addEventListener('change', (e) => {
      thisWidget.value = e.target.value;
    });
    thisWidget.value = settings.hours.open;
    thisWidget.renderValue();
  }

  parseValue(value) {
    return utils.numberToHour(value);
  }

  isValid() {
    return true;
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}

export default HourPicker;

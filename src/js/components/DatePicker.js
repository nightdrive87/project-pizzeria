import {settings, select} from '../settings.js';
import {utils} from '../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget {
  constructor(element) {
    super(element, utils.dateToStr(new Date()));

    const thisWidget = this;
    thisWidget.dom.input = element.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    thisWidget.dom.input.value = thisWidget.value;
    flatpickr(thisWidget.dom.input, {
      defaultValue: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate
    });
  }

  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {

  }


}

export default DatePicker;

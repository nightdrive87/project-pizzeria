import {templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();

  }

  render(elemet) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    elemet.innerHTML = generatedHTML;

    thisBooking.dom = {
      wrapper: elemet,
      peopleAmount: elemet.querySelector(select.booking.peopleAmount),
      hoursAmount: elemet.querySelector(select.booking.hoursAmount),
    };
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

  }
}

export default Booking;

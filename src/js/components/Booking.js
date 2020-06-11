import {templates, select, settings, classNames} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import {utils} from '../utils.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();

    thisBooking.tables = [];

  }

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam
      ],
      eventsCurrent: [
        startDateParam,
        endDateParam,
        settings.db.notRepeatParam
      ],
      eventsRepeat: [
        endDateParam,
        settings.db.repeatParam
      ]
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&')
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat)
    ])
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(([bookings, eventsCurrent, eventsRepeat]) => {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};


    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of bookings) {
      for (let table of item.tables) {
        thisBooking.makeBooked(item.date, item.hour, item.duration, table);
      }
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for (let item of eventsRepeat) {
      if (item.repeat === 'daily') {
        for (let date = minDate; date < maxDate; date = utils.addDays(date, 1)) {
          thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
        }
      }
    }

    thisBooking.updateDOM();
  }

  isBooked(date, hour, table, duration) {
    const thisBooking = this;

    if (thisBooking.booked[date]) {
      const startHour = utils.hourToNumber(hour);
      for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
        if (thisBooking.booked[date][hourBlock] && thisBooking.booked[date][hourBlock].includes(table)) {
          return true;
        }
      }
    }
    return false;
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    if (!thisBooking.booked[date]) {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      if (!thisBooking.booked[date][hourBlock]) {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  render(elemet) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    elemet.innerHTML = generatedHTML;

    thisBooking.dom = {
      wrapper: elemet,
      peopleAmount: elemet.querySelector(select.booking.peopleAmount),
      hoursAmount: elemet.querySelector(select.booking.hoursAmount),
      datePicker: elemet.querySelector(select.widgets.datePicker.wrapper),
      hourPicker: elemet.querySelector(select.widgets.hourPicker.wrapper),
      tables: elemet.querySelectorAll(select.booking.tables),
      form: elemet.querySelector(select.booking.form),
      phone: elemet.querySelector(select.booking.phone),
      address: elemet.querySelector(select.booking.address),
      starters: elemet.querySelectorAll(select.booking.starters)
    };

    for (let table of thisBooking.dom.tables) {
      table.addEventListener('click', () => {
        const tableId = parseInt(table.getAttribute('data-table'));
        if (thisBooking.tables.includes(tableId)) {
          table.classList.remove(classNames.booking.tableBooked);
          const idx = thisBooking.tables.indexOf(tableId);
          thisBooking.tables.splice(idx, 1);
        } else {
          if (!table.classList.contains(classNames.booking.tableBooked)) {
            thisBooking.tables.push(tableId);
            table.classList.add(classNames.booking.tableBooked);
          }
        }
      });
    }

    thisBooking.dom.form.addEventListener('submit', (e) => {
      e.preventDefault();
      thisBooking.sendBooking();
    });

    thisBooking.starters = [];

    thisBooking.dom.starters.forEach(input => {
      input.addEventListener('change', (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          thisBooking.starters.push(value);
        } else {
          const idx = thisBooking.starters.indexOf(value);
          thisBooking.starters.splice(idx, 1);
        }
      });
    });
  }


  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    thisBooking.tables = [];

    let allAvailable = false;
    if (!thisBooking.booked[thisBooking.date] || !thisBooking.booked[thisBooking.date][thisBooking.hour]) {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }

    }

  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', () => {
      thisBooking.updateDOM();
    });

    thisBooking.dom.datePicker.addEventListener('change', () => {
      thisBooking.updateDOM();
    });
  }

  sendBooking() {
    const thisBooking = this;

    const date = thisBooking.datePicker.value;
    const hour = thisBooking.hourPicker.value;
    const tables = thisBooking.tables;
    const duration = 1;


    if (tables.length === 0) {
      alert('Not selected');
      return;
    }

    let booked = false;
    for (let table of tables) {
      if (thisBooking.isBooked(date, hour, table, duration)) {
        booked = true;
        break;
      }
    }

    if (booked) {
      alert('Already booked');
      return;
    }

    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: date,
      hour: hour,
      tables: tables,
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
      duration: duration,
      repeat: false,
      starters: thisBooking.starters
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(response => response.json())
      .then(() => thisBooking.getData());
  }
}

export default Booking;

import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Booking from './components/Booking.js';
import Cart from './components/Cart.js';

const app = {
  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(productData, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;
    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(response => response.json())
      .then(parsedResponse => {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', (e) => {
      thisApp.cart.add(e.detail.product);
    });
  },

  initPages: function () {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.homeLinks = document.querySelectorAll(select.nav.links_home);
    const idFromHash = window.location.hash.replace('#/', '');

    for (let link of thisApp.homeLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
      

    let pageMatchingHash = false;
    for (let page of thisApp.pages) {
      if (page.id === idFromHash) {
        pageMatchingHash = true;
        break;
      }
    }

    if (pageMatchingHash) {
      thisApp.activatePage(idFromHash);
    } else {
      thisApp.activatePage(thisApp.pages[0].id);
    }

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }

    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') === `#${pageId}`
      );
    }
  },

  initBooking() {
    const bookingElement = document.querySelector(select.containerOf.booking);
    this.booking = new Booking(bookingElement);
  },


  init: function () {
    const thisApp = this;
    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initBooking();
  }
};

app.init();


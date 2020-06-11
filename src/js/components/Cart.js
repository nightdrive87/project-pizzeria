import {settings, select, templates, classNames} from '../settings.js';
import {utils, toggleClass} from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initAction();
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {
      wrapper: element,
      toggleTrigger: element.querySelector(select.cart.toggleTrigger),
      productList: element.querySelector(select.cart.productList),
      form: element.querySelector(select.cart.form),
      phone: element.querySelector(select.cart.phone),
      email: element.querySelector(select.cart.address),
    };

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    thisCart.renderTotalsKeys.forEach(key => {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    });
  }

  initAction() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', () => {
      toggleClass(thisCart.dom.wrapper, classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', () => {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', (e) => {
      thisCart.remove(e.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', (e) => {
      e.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.update();
  }

  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.parentElement.removeChild(cartProduct.dom.wrapper);
    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    thisCart.renderTotalsKeys.forEach(key => {
      thisCart.dom[key].forEach(elem => {
        elem.innerHTML = thisCart[key];
      });
    });
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      address: 'test',
      totalPrice: thisCart.totalPrice,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      phone: thisCart.dom.phone.value,
      email: thisCart.dom.email.value,
      products: []
    };

    thisCart.products.forEach(product => {
      payload.products.push(product.getData());
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(response => response.json())
      .then(parsed => {
        console.log(parsed);
      });
  }
}

export default Cart;

import {select, templates, classNames} from '../settings.js';
import {utils, toggleClass} from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
  }

  renderInMenu() {
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.element.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    thisProduct.accordionTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      toggleClass(thisProduct.element, classNames.menuProduct.wrapperActive);

      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      activeProducts.forEach((e) => {
        if (e !== thisProduct.element) {
          e.classList.remove(classNames.menuProduct.wrapperActive);
        }
      });
    });
  }

  initOrderForm() {
    const thisProduct = this;
    //console.log('initOrderForm', thisProduct);

    thisProduct.form.addEventListener('submit', (e) => {
      e.preventDefault();
      thisProduct.processOrder();
    });

    thisProduct.formInputs.forEach((input) => {
      input.addEventListener('change', () => {
        thisProduct.processOrder();
      });
    });

    thisProduct.cartButton.addEventListener('click', (e) => {
      e.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });

  }

  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', () => {
      thisProduct.processOrder();
    });
  }

  processOrder() {
    const thisProduct = this;
    //console.log('processOrder', thisProduct);

    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('formData', formData);

    thisProduct.params = {};

    let price = thisProduct.data.price;

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      for (let optionId in param.options) {
        const option = param.options[optionId];
        const isSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (isSelected && !option.default) {
          price += option.price;
        } else if (!isSelected && option.default) {
          price -= option.price;
        }

        const img = thisProduct.imageWrapper.querySelector(`.${paramId}-${optionId}`);
        if (img) {
          if (isSelected) {
            img.classList.add(classNames.menuProduct.wrapperActive);
          } else {
            img.classList.remove(classNames.menuProduct.wrapperActive);
          }
        }

        if (isSelected) {
          if (!thisProduct.params[paramId]) {
            thisProduct.params[paramId] = {
              label: param.label,
              options: {}
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
        }

      }
    }

    thisProduct.priceSingle = price;
    thisProduct.price = price * thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct
      }
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;

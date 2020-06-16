/* global Handlebars */
'use strict';
let index = 0;
let indexIcons = 0;

function slider() {
  let targetElement;
  const templateSlide = Handlebars.compile(document.getElementById('template-slide').innerHTML);

  const quoteOne = {
    title: 'Lorem ipsum dolor amet',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor non ante non lobortis. Nunc consectetur nisi mauris, ut suscipit ligula placerat vel. Nam rhoncus diam est, id maximus eros auctor in.',
    author: 'John Doe'
  };

  const quoteTwo = {
    title: 'Lorem ipsum dolor amet 2',
    quote: 'ellentesque varius urna lectus, vel mollis nibh egestas vel. In in mi in erat suscipit consectetur et eget erat. Nullam ac consequat quam,',
    author: 'Issac Newton'
  };

  const quoteThree = {
    title: 'Lorem ipsum dolor amet 3',
    quote: 'Morbi quis magna nec tortor egestas eleifend vel rutrum libero. Nunc quis aliquet quam, ac pharetra sem. Vestibulum quis ante quis elit rhoncus sodales varius in nisi. Vivamus in felis id est vehicula sollicitudin.',
    author: 'Albert Einstein'
  };

  targetElement = document.querySelector('.carousel');
  const quotes = [];

  quotes.push(quoteOne);
  quotes.push(quoteTwo);
  quotes.push(quoteThree);

  for (let quote of quotes) {
    const generatedHTML = templateSlide(quote);
    targetElement.insertAdjacentHTML('beforeend', generatedHTML);
  }

  const wrappers = targetElement.querySelectorAll('.slide');
  const icons = document.querySelectorAll('.slide-icon i');

  for (let i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = 'none';

  }

  for (let i = 0; i < icons.length; i++) {
    icons[i].classList.remove('fas');
    icons[i].classList.add('far');
  }

  index++;
  indexIcons++;
  if (index > wrappers.length) {
    index = 1;
  }

  if (indexIcons > icons.length) {
    indexIcons = 1;
  }
  
  icons[indexIcons - 1].classList.remove('far');
  wrappers[index - 1].style.display = 'block';
  setTimeout(slider, 3000);
  icons[indexIcons - 1].classList.add('fas');
}

slider();









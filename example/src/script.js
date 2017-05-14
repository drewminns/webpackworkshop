import data from './data';
import image from './image';
import webpackImage from './webpackImage';
import './styles/main.scss';

import { multiply } from './utils/math.js';

const message = `Math is cool. Here's the result of 3 * 3 = ${ multiply(3,3) }`;

var app = document.getElementById('app');
app.innerHTML = `
  <h1>Hello ${data.location}!</h1>
  <p>${message}</p>
  <div>${image}</div>
  <div>${webpackImage}</div>
`;

if (module.hot) {
  module.hot.accept();
}

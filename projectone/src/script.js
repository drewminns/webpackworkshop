import data from './data';
import image from './image';
import webpackImage from './webpackImage';

import './styles/main.scss';

var app = document.getElementById('app');
app.innerHTML = `
  <p>Hello ${data.location}!</p>
  <div>${image}</div>
  <div>${webpackImage}</div>
`;

if (module.hot) {
  module.hot.accept();
}

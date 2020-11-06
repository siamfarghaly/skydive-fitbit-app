import document from 'document';
import { switchPage } from '../navigation';

let $buttonAction = null;

function doSomething() {
  console.log('hallo index');
}

export function destroy() {
  console.log('destroy index page');
  $buttonAction = null;
}

export function init() {
  console.log('init index page');
  $buttonAction = document.getElementById('action-button');

  $buttonAction.onclick = () => {
    switchPage('action', true);
  };

  doSomething();
}

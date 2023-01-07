import React from 'react';
import ReactDOM from 'react-dom';
import {ipcRenderer} from 'electron';

import styles from './privacy.css';

document.documentElement.lang = 'en';

const openDesktopSettings = (e) => {
  e.preventDefault();
  ipcRenderer.send('open-desktop-settings');
};

const canUpdatesBeEnabled = ipcRenderer.sendSync('update-checker/can-be-enabled');

ReactDOM.render((
  // Please make sure privacy.html is always the same as this.
  <main>
    <h1>Privacy Policy</h1>
    <p><i>Updated 2023/01/05</i></p>

    <p>Built for Ouertal Bashir MS</p>
  </main>
), require('../app-target'));

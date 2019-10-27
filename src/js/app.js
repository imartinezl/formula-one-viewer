"use strict";

import FController from './Controller';
import 'bulma/css/bulma.css';
import '../css/main.css';

document.addEventListener("DOMContentLoaded", () => {
    let appController = new FController();
    appController.init();
});
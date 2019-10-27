"use strict";

import FHTTPHelper from './helpers/HTTPHelper'
import ErgastAPI from './components/ErgastAPI'

export default class FController {

    constructor() {
        this._ergastAPI = new ErgastAPI();
    }

    init() {
        this._ergastAPI.init();
    }

    initEvents() {

    }

}
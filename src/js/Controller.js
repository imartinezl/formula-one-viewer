"use strict";

import ErgastAPI from './components/ErgastAPI';
import PointsGenerator from './components/PointsGenerator';
import Chartjs from './components/Chartjs';

export default class FController {

    constructor() {
        this._ergastAPI = new ErgastAPI();
        this._points = new PointsGenerator();
        this._chart = new Chartjs();
    }

    init() {
        this._ergastAPI.init();
        this._chart.init();
        this._ergastAPI.requestData().then((data) => {
            console.log(data);
            this._points.init(data);
            this._points.update();
            this._chart.updateData(this._points.data, this._points.labels);
        });
    }

    initEvents() {

    }

}
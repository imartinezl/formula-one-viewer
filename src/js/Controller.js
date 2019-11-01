"use strict";

import ErgastAPI from './components/ErgastAPI';
import Standings from './components/Standings';
import ScoresChart from './components/ScoresChart';

export default class FController {

    constructor() {
        this._ergastAPI = new ErgastAPI();
        this._standings = new Standings();
        this._scoresChart = new ScoresChart();
    }

    init() {
        this._ergastAPI.init();
        this._scoresChart.init();
        this._ergastAPI.requestData().then((ergastData) => {
            console.log(ergastData);
            this._standings.init(ergastData, this._scoresChart._scores, this._scoresChart._fastlap);
            this._scoresChart.setStandings(this._standings);
        });

    }

    initEvents() {

    }

}
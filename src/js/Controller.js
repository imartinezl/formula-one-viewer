"use strict";

import ErgastAPI from './components/ErgastAPI';
import Standings from './components/Standings';
import ScoresChart from './components/ScoresChart';
import config from './config/appConfig';

export default class FController {

    constructor() {
        this._ergastAPI = new ErgastAPI();
        this._standings = new Standings();
        this._scoresChart = new ScoresChart();

        this._select_year = document.getElementById('select-year');
    }

    init() {
        this.initSelectOptions();
        this._scoresChart.init();
        let season = this._select_year.value;
        this.requestData(season);
        this.initEvents();
    }

    initEvents(){
        this._select_year.addEventListener("change", () => {
            let season = this._select_year.value;
            this.requestData(season);
        });
    }

    initSelectOptions(){
        for (let i = 0; i < config.seasons.length; i++) {
            let option = document.createElement('option');
            option.value = config.seasons[i];
            option.text = config.seasons[i];
            this._select_year.add( option ) 
        }
        this.season = this._select_year.value;
    }
    
    requestData(season) {
        this._ergastAPI.requestData(season).then((ergastData) => {
            console.log(ergastData);
            this._standings.init(ergastData, this._scoresChart._scores, this._scoresChart._fastlap);
            this._scoresChart.setStandings(this._standings);
        });

    }

}
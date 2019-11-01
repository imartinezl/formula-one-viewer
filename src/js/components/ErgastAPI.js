"use strict";
import config from '../config/appConfig';
import HTTPHelper from '../helpers/HTTPHelper';

export default class ErgastAPI {

    constructor() {
        console.log('test created');
    }

    init() {
        console.log('test initialized');
        this.url = this.createURL();
    }

    createURL(){
        this.baseurl = 'http://ergast.com/api';
        let series = 'f1';
        let season = '2019';
        let round = '';
        let service = 'results';
        let format = '.json';
        let params = '?limit=500';
        let url = [this.baseurl, series, season, round, service].filter(Boolean).join('/') + format + params;
        return url;
    }

    
    requestData(){
        return HTTPHelper.get(this.url);
    }
    
}
"use strict";
import HTTPHelper from '../helpers/HTTPHelper';

export default class ErgastAPI {

    constructor() {

    }
    
    init() {
        
    }

    createURL(season){
        this.baseurl = 'https://ergast.com/api';
        let series = 'f1';
        //let season = '2019';
        let round = '';
        let service = 'results';
        let format = '.json';
        let params = '?limit=500';
        let url = [this.baseurl, series, season, round, service].filter(Boolean).join('/') + format + params;
        return url;
    }

    
    requestData(season){
        this.url = this.createURL(season);
        return HTTPHelper.get(this.url);
    }
    
}
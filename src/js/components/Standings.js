"use strict";

import StandingsChart from './StandingsChart';
const {flag, code, name, countries} = require('country-emoji');

export default class Standings {

    constructor() {
        this.standingsChart = new StandingsChart();
        this.reset();
    }
    
    init(ergastData, scores, fastlap) {
        this.races = ergastData.MRData.RaceTable.Races;
        this.scores = scores;
        this.fastlap = fastlap;
        this.standingsChart.init();
        this.update();
    }

    reset(){
        this.labels = [];
        this.standings = {};
    }

    update(){
        this.reset();
        this.races.map(race => this.processRace(race));
        this.standingsChart.updateData(this.standings, this.labels);
    }

    updateScores(s){
        this.scores = s;
        this.update();
    }
    updateFastlap(fl){
        this.fastlap = fl;
        this.update();
    }

    processRace(race){
        race.Results.map( e => this.processPosition(e));
        this.labels.push(this.getRaceLabel(race.Circuit));
    }
    processPosition(result){
        let points = this.calculatePoints(result);
        let driverId = result.Driver.driverId;
        let constructorId = result.Constructor.constructorId;
        this.initDriver(driverId);
        this.addPoints(driverId, constructorId, points);
    }
    
    initDriver(driverId){
        if(! (driverId in this.standings)){    
            this.standings[driverId] = {
                constructorId: [], 
                total: 0, 
                cumsum: [], 
                perRace: []
            };
        }
    }
    addPoints(driverId, constructorId, points){
        this.standings[driverId].constructorId.push(constructorId);
        this.standings[driverId].total += points;
        this.standings[driverId].cumsum.push(this.standings[driverId].total);
        this.standings[driverId].perRace.push(points);
    }
    calculatePoints(result){
        let pos = parseInt(result.position);
        let points = 0;
        if(this.scores[pos-1]){
            points += this.scores[pos-1];
        }
        if(result.FastestLap){
            if(result.FastestLap.rank == "1"){
                points += this.fastlap;
            }
        }
        return points;
    }
    getRaceLabel(raceCircuit){
        let raceLocationCountry = raceCircuit.Location.country;
        let emoji = flag(raceLocationCountry);
        return [raceLocationCountry, emoji];
    }
}
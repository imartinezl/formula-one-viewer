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
        this.races.map((race, index) => this.processRace(race, index));
        // fix empty drivers
        console.log(this.races.length)
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

    processRace(race, index){
        race.Results.map( e => this.processPosition(e, index));
        this.labels.push(this.getRaceLabel(race.Circuit));
    }
    processPosition(result, index){
        let points = this.calculatePoints(result);
        let driverId = result.Driver.driverId;
        let constructorId = result.Constructor.constructorId;
        this.initDriver(driverId);
        this.addPoints(driverId, constructorId, points, index);
        
    }
    
    initDriver(driverId){
        if(! (driverId in this.standings)){    
            this.standings[driverId] = {
                constructorId: [], 
                total: 0, 
                cumsum: [], 
                perRace: [],
                index: [],
            };
        }
    }

    addPoints(driverId, constructorId, points, index){
        this.standings[driverId].index.push(index);
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

    pushLast(x){
        x.push(x[x.length-1])
    }

    fillEmptyDrivers(){
        // TO-DO:
        // get number of races (maximum of constructorId, for instance)
        // for each driverId, if array is not full, add one element to 
        // - constructorId: same as previous
        // - cumsum: add 0
        // - perRace: add 0
        var nraces = this.races.length;
        console.log(nraces);
        for (var driverId in this.standings) {
            pos = 0;
            index = 0;
            while(pos < nraces){
                if(this.standings[driverId].index[pos] == index){
                    pos++;
                    index++;
                }else{
                    this.standings[driverId].index.aplice(pos, 0, index)
                    index++;
                }
            }
            // if(n < nraces){
            //     this.pushLast(this.standings[driverId].constructorId);
            //     this.standings[driverId].cumsum.push(this.standings[driverId].total);
            //     this.standings[driverId].perRace.push(0);
            // }
        }

    }
}
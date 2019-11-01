"use strict";
const {flag, code, name, countries} = require('country-emoji');

export default class PointsGenerator {

    constructor() {
        this.labels = [];
        this.data = {};

        this.races = [];

        this.scores = [25,18,15,12,10,8,6,4,2,1];
        this.fastlap = 1;
    }
    
    init(ergastData) {
        this.races = ergastData.MRData.RaceTable.Races;
    }

    set setScores(scores){
        this.scores = scores;
    }
    set setFastlap(fastlap){
        this.fastlap = fastlap;
    }

    calculatePoints(result){
        let pos = parseInt(result.position);
        let points = 0;
        if(this.scores[pos]){
            points += this.scores[pos];
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
    initDriver(driverId){
        if(! (driverId in this.data)){    
            this.data[driverId] = {
                constructorId: [], 
                total: 0, 
                cumsum: [], 
                perRace: []
            };
        }
    }
    addPoints(driverId, constructorId, points){
        this.data[driverId].constructorId.push(constructorId);
        this.data[driverId].total += points;
        this.data[driverId].cumsum.push(this.data[driverId].total);
        this.data[driverId].perRace.push(points);
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


    update(){
        // let input = document.getElementById("input1");
        // let value = parseInt(input.value);
        // console.log(value);
        // scores[0] = value;
        this.races.map(race => this.processRace(race));
        console.log(this.data, this.labels);
    }
}
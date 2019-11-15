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
        this.labels_metadata = [];
        this.standings = {};
        this.standings_metadata = {}
    }

    update(){
        this.reset();
        this.races.map((race, index) => this.processRace(race, index));
        // fix empty drivers
        this.fillEmptyDrivers();
        this.standingsChart.updateData(this.standings, this.labels, this.standings_metadata, this.labels_metadata);
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
        this.processRaceInfo(race)
    }
    processPosition(result, index){
        let points = this.calculatePoints(result);
        let driverId = result.Driver.driverId;
        let constructorId = result.Constructor.constructorId;
        this.initDriver(driverId);
        this.addPoints(driverId, constructorId, points, index);
        this.driverMetadata(result);
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

    processRaceInfo(race){
        let raceLocationCountry = race.Circuit.Location.country;
        let emoji = flag(raceLocationCountry);
        this.labels.push([raceLocationCountry, emoji].join(' '));
        this.labels_metadata.push({
            raceName: race.raceName, 
            round: race.round,
            season: race.season,
            flag: emoji,
            url: race.url
        });
    }

    pushLast(x){
        x.push(x[x.length-1])
    }

    fillEmptyDrivers(){
        var nraces = this.races.length;
        for (var driverId in this.standings) {
            
            for (let index = 0; index < nraces; index++) {
                if(this.standings[driverId].index[index] != index){
                    this.standings[driverId].index.splice(index, 0, index);
                    this.standings[driverId].constructorId.splice(index, 0, this.standings[driverId].constructorId[0]);
                    this.standings[driverId].perRace.splice(index, 0, 0);
                }
            }
            this.standings[driverId].cumsum = [];
            let cumsum = 0;
            for (let index = 0; index < nraces; index++) {
                cumsum += this.standings[driverId].perRace[index];
                this.standings[driverId].cumsum.push(cumsum);
            }

        }

    }

    driverMetadata(result){
        let driverId = result.Driver.driverId;
        if(!this.standings_metadata[driverId]){
            this.standings_metadata[driverId] = {};
            this.standings_metadata[driverId].code = result.Driver.code || '';
            this.standings_metadata[driverId].dateOfBirth = result.Driver.dateOfBirth || '';
            this.standings_metadata[driverId].name = result.Driver.givenName + ' ' + result.Driver.familyName
            this.standings_metadata[driverId].number = result.Driver.permanentNumber || '';
            this.standings_metadata[driverId].position = result.position || '';
            this.standings_metadata[driverId].grid = result.grid || '';
            this.standings_metadata[driverId].constructor = result.Constructor.name || '';
        }
    }
}
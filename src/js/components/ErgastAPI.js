"use strict";
import config from '../config/appConfig';
import HTTPHelper from '../helpers/HTTPHelper';
var _ = require('lodash');
const {flag, code, name, countries} = require('country-emoji');

import Chart from 'chart.js';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

export default class ErgastAPI {

    constructor() {
        console.log('test created');
    }

    init() {
        console.log('test initialized');
        let url = this.createURL();
        this.requestData(url);
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

    requestData(url){
        HTTPHelper.get(url)
        .then((data) => {
            console.log(data.MRData.RaceTable.Races[0])

            let driverId = ["albon", "bottas","gasly","giovinazzi","grosjean","hamilton",
              "hulkenberg","kevin_magnussen","kubica","kvyat", "leclerc",
              "max_verstappen","norris","perez","raikkonen","ricciardo",
              "russell","sainz","stroll","vettel"]
            let driverColor = ["#1E41FF","#00D2BE","#469BFF","#9B0000","#F0D787","#00D2BE",
                 "#FFF500","#F0D787","#FFFFFF","#469BFF","#DC0000",
                 "#1E41FF","#FF8700","#F596C8","#9B0000","#FFF500",
                 "#FFFFFF","#FF8700","#F596C8","#DC0000"]
            var driverExtra = {};
            driverId.forEach((key, i) => driverExtra[key] = driverColor[i]);

            var datasets = [];
            var labels = [];
            let pointsData = {};
            let fastlap = 1;
            let scores = [25,18,15,12,10,8,6,4,2,1];
            let input = document.getElementById("input1");
            let value = parseInt(input.value);
            console.log(value);
            scores[0] = value;
            let races = data.MRData.RaceTable.Races
            for (let race = 0; race < races.length; race++) {
                let raceLocationCountry = races[race].Circuit.Location.country;
                let raceResults = races[race].Results;
                for (let pos = 0; pos < raceResults.length; pos++) {
                    let driver = raceResults[pos].Driver.driverId;
                    let position = parseInt(raceResults[pos].position);
                    let points = 0;
                    if(scores[position]){
                        points = scores[position-1];
                    }
                    if(raceResults[pos].FastestLap){
                        if(raceResults[pos].FastestLap.rank == "1"){
                            points += fastlap;
                        }
                    }
                    if(! (driver in pointsData)){
                        pointsData[driver] = {};
                        pointsData[driver].total = 0;
                        pointsData[driver].totalAt = [];
                        pointsData[driver].perRace = [];
                    }
                    pointsData[driver].total += points;
                    pointsData[driver].totalAt.push(pointsData[driver].total);
                    pointsData[driver].perRace.push(points);
                }
                let emoji = flag(raceLocationCountry);
                labels.push([raceLocationCountry, emoji]);
            }
            console.log(pointsData);

            
            Object.keys(pointsData).forEach(function(driver) {
                datasets.push({
                    label: driver,
                    data: pointsData[driver].totalAt,
                    borderColor: driverExtra[driver],
                    borderWidth: 1,
                    fill: false,
                    tension: 0,
                    radius: 2,
                    pointStyle: 'circle',
                    hoverBorderWidth: 3
                });
            });

            console.log(labels, datasets);
            var ctx = document.getElementById('myChart');
            var config = {
                type: 'line',
                data: {
                    labels,
                    datasets
                },
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            },
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 0
                            },
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Month'
                            },
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false,
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: 'Custom Chart Title'
                    },
                    legend: {
                        display: false,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    },
                    
                }
            };
            
            var myChart = new Chart(ctx, config);
            
        });
    }
}
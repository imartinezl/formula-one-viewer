"use strict";

import Chart from 'chart.js';
import config from '../config/appConfig';

export default class StandingsChart {

    constructor(){
        this._canvas = document.getElementById('standings_canvas');
        this._ctx = this._canvas.getContext('2d');
        this._config = this.baseConfig();
    }

    init(){
    
    }

    updateData(standings, labels){
        let datasets = [];
        for (var driverId in standings) {
            let constructors = standings[driverId].constructorId;
            let currentConstructor = [...constructors].pop();
            let lineColor = config.constructorColor[currentConstructor];
            let pointColors = constructors.map(e => config.constructorColor[e])
            datasets.push({
                label: driverId,
                data: standings[driverId].cumsum,
                pointBackgroundColor: pointColors,
                borderColor: lineColor,
                borderWidth: 1,
                fill: false,
                tension: 0,
                radius: 2,
                pointStyle: 'circle',
                hoverBorderWidth: 3
            });
        }
        
        if(this._chart){
            this._chart.data = {datasets, labels};
            this._chart.update({duration: 0});
        }else{
            this._config.data = {datasets, labels};
            this._chart = new Chart(this._ctx, this._config);
        }
    }


    baseConfig(){
        var config = {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                showLines: true,
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
        return config;
    }
}
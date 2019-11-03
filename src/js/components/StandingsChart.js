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
        labels = labels.map(e => e.join(' '));
        console.log(labels);
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
                            labelString: 'Grand Prix'
                        },
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            autoSkip: false,
                            minRotation: 35,
                            maxRotation: 40
                        },
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Points'
                        },
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: false,
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
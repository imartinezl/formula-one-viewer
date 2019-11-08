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
        console.log(standings);
        labels = labels.map(e => e.join(' '));
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
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Grand Prix',
                            fontFamily: 'F1-Regular',
                            fontSize: 12
                        },
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            autoSkip: false,
                            minRotation: 35,
                            maxRotation: 40,
                            fontFamily: 'F1-Regular',
                            fontSize: 12
                        },
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Points',
                            fontFamily: 'F1-Regular',
                            fontSize: 12
                        },
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            beginAtZero: true,
                            fontFamily: 'F1-Regular',
                            fontSize: 12
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
                tooltips: {
                    enabled: true,
                    intercept: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    titleFontFamily: 'F1-Regular',
                    titleAlign: 'center',
                    bodyFontFamily: 'F1-Regular',
                    bodyAlign: 'center',
                    xPadding: 10,
                    yPadding: 10,
                    cornerRadius: 3,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            var item = data.datasets[tooltipItem.datasetIndex];
                            // console.log(tooltipItem)
                            return item.label + ': ' + (tooltipItem.yLabel)
                        }
                    }
                }
                
            }
        };
        return config;
    }
}
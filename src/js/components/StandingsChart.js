"use strict";

import config from '../config/appConfig';
import Chart from 'chart.js';
import 'chartjs-plugin-zoom';

export default class StandingsChart {

    constructor() {
        this._canvas = document.getElementById('standings_canvas');
        this._ctx = this._canvas.getContext('2d');
        this._config = this.baseConfig();

        this._resetZoom = document.getElementById('reset-zoom');
    }

    init() {
        this.initEvents();
    }
    
    initEvents(){
        this._resetZoom.addEventListener("click", this.resetZoomAction.bind(this));
        this._canvas.addEventListener("dblclick", this.resetZoomAction.bind(this));
    }
    
    onZoomComplete(chart){
        this.displayZoomButton();
    }

    hideZoomButton(){
        this._resetZoom.style.display = 'none';
    }
    
    displayZoomButton(){
        this._resetZoom.style.display = 'block';
    }

    resetZoomAction(){
        if (this._chart) {
            this._chart.resetZoom();
            this.hideZoomButton();
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    

    updateData(standings, labels, standings_metadata, labels_metadata) {
        // console.log(standings, labels);
        let datasets = [];
        let datasets_metadata = [];
        for (var driverId in standings) {
            let constructors = standings[driverId].constructorId;
            let currentConstructor = [...constructors].pop();
            let lineColor = config.constructorColor[currentConstructor];
            let randomColor = this.getRandomColor();
            let pointColors = constructors.map(e => {
                let color = config.constructorColor[e];
                if(color === "#------"){
                    color = randomColor;
                }
                return color
            });
            datasets.push({
                label: driverId,
                data: standings[driverId].cumsum,
                pointBackgroundColor: pointColors,
                borderColor: lineColor,
                borderWidth: 1.5,
                fill: false,
                tension: 0,
                radius: 2,
                pointStyle: 'circle',
                hoverBorderWidth: 3,
                pointHoverBorderWidth: 5
            });
            datasets_metadata.push(standings_metadata[driverId])
        }

        if (this._chart) {
            this._chart.data = { datasets, labels, datasets_metadata, labels_metadata };
            this._chart.update({ duration: 0 });
        } else {
            this._config.data = { datasets, labels, datasets_metadata, labels_metadata };
            this._chart = new Chart(this._ctx, this._config);
        }
    }

    onClick(e, activePoints){
        if(this._chart && activePoints.length > 0){
            let index = activePoints[0]._index
            let url = this._chart.data.labels_metadata[index].url
            console.log(url)
            Object.assign(document.createElement('a'), { target: '_blank', href: url}).click();
            //var win = window.open(url, '_blank');
        }
    }

    baseConfig() {
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
                            display: false,
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
                    intercept: true,
                    mode: 'nearest',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFontFamily: 'F1-Regular',
                    titleAlign: 'left',
                    titleMarginBottom: 10,
                    bodyFontFamily: 'F1-Regular',
                    bodyAlign: 'left',
                    footerFontFamily: 'F1-Regular',
                    footerAlign: 'left',
                    footerFontStyle: 'normal',
                    footerMarginTop: 6,
                    footerSpacing: 6,
                    xPadding: 12,
                    yPadding: 12,
                    cornerRadius: 3,
                    caretSize: 10,
                    displayColors: true,
                    callbacks: {
                        title: function (tooltipItem, data){
                            let title = [];
                            for(let i in tooltipItem){
                                let item = tooltipItem[i];
                                let point = data.datasets_metadata[item.datasetIndex];
                                let label = data.labels_metadata[item.index];
                                // console.log('title:', point, label, item)
                                title.push(point.name + ' / ' + item.value)
                            }
                            return title
                        },
                        label: function (tooltipItem, data) {
                            let item = tooltipItem;
                            let point = data.datasets_metadata[item.datasetIndex];
                            let label = data.labels_metadata[item.index];
                            // console.log('footer:', point, label, item)
                            let text = '   ' + point.constructor;
                            if(point.number !== ''){
                                text += ' #' + point.number;
                            }
                            return text;
                        },
                        footer: function (tooltipItem, data) {
                            let item = tooltipItem[0];
                            let point = data.datasets_metadata[item.datasetIndex];
                            let label = data.labels_metadata[item.index];
                            // console.log('title:', point, label, item)
                            let race_info = label.flag + '    ' + label.raceName + ' R' + label.round;
                            let result_info = '🏁    Grid: P' + point.grid[item.index] + ' | Finish: P' + point.position[item.index];
                            if(tooltipItem.length > 1 || point.grid[item.index] === '' || point.position[item.index] === ''){
                                return race_info
                            }else{
                                return [race_info, result_info]
                            }
                        }
            
                    }
                },
                pan: {
                    enabled: false,
                },
                zoom: {
                    enabled: true,
                    drag: true,
                    mode: 'y',
                    speed: 0.05,
                    drag: {
                        borderColor: 'rgba(0,0,0,0.5)',
                        borderWidth: 0.5,
                        backgroundColor: 'rgb(225,6,0,0.1)',
                        animationDuration: 250,
                    },
                    onZoomComplete: this.onZoomComplete.bind(this),
                },
                onHover: function(e) {
                    var point = this.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'crosshair';
                },
                onClick: this.onClick.bind(this),
                animation: {
                    // duration: 500,
                    // easing: 'easeInExpo',
                }
            },
        };
        return config;
    }
}
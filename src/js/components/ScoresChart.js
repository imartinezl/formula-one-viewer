"use strict";

import config from '../config/appConfig';
import Chart from 'chart.js';
import 'chartjs-plugin-dragdata';

export default class ScoresChart {

    constructor() {
        this._canvas = document.getElementById('points_canvas');
        this._ctx = this._canvas.getContext('2d');
        this._config = this.baseConfig();
        this._labels = [];
        this._scores = [];
        this._select_system = document.getElementById('select-system');
    }

    init() {
        this.initEvents();
        this.initSelectOptions();
        this.update();
    }

    initSelectOptions() {
        for (let name in config.pointSystem) {
            let option = document.createElement('option');
            option.value = name;
            option.text = name;
            this._select_system.add(option)
        }
    }

    update() {
        let years = this._select_system.value;
        this._labels = config.positions;
        this._scores = config.pointSystem[years].scores.slice();
        this._fastlap = config.pointSystem[years].fastlap;
        this.draw();
    }

    initEvents() {
        this._select_system.addEventListener("change", () => {
            this.update();
            this._standings.updateScores(this._scores);
        });
    }

    draw() {
        let labels = [...this._labels, "Fast Lap"];
        let datasets = [{
            data: [...this._scores, this._fastlap],
            backgroundColor: "#e10600",
            borderColor: "#44AA22",
            borderWidth: 0,
            hoverBackgroundColor: "#ff5c58",
            barPercentage: 0.8,
            minBarLength: 5,


        }];
        if (this._chart) {
            this._chart.data = { datasets, labels };
            this._chart.update();
        } else {
            this._config.data = { datasets, labels };
            this._chart = new Chart(this._ctx, this._config);
        }
    }

    setStandings(s) {
        this._standings = s;
    }

    onDragEnd(e, datasetIndex, index, value) {
        this._scores[index] = value;
        this._standings.updateScores(this._scores);
        e.target.style.cursor = 'default';
    }

    onDragStart(e, datasetIndex, index, value) {
        e.target.style.cursor = 'grabbing';
    }
    onDrag(e, datasetIndex, index, value) {
        e.target.style.cursor = 'grabbing';
    }

    baseConfig() {
        var config = {
            type: 'bar',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                dragData: true,
                dragX: false,
                dragDataRound: 0,
                onDragStart: this.onDragStart.bind(this),
                onDrag: this.onDrag.bind(this),
                onDragEnd: this.onDragEnd.bind(this),
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Position',
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
                            labelString: 'Points Awarded',
                            fontFamily: 'F1-Regular',
                            fontSize: 12
                        },
                        gridLines: {
                            display: true,
                        },
                        ticks: {
                            beginAtZero: true,
                            max: 30,
                            min: 0,
                            fontFamily: 'F1-Regular',
                            fontSize: 12
                        }
                    }]
                },
                title: {
                    display: false,
                    text: 'Custom Chart Title',
                },
                legend: {
                    display: false,
                    labels: {
                        fontColor: '#e10600'
                    }
                },
                tooltips: {
                    enabled: false,
                },
                hover: {
                    onHover: function(e) {
                       var point = this.getElementAtEvent(e);
                       if (point.length) e.target.style.cursor = 'grab';
                       else e.target.style.cursor = 'default';
                    }
                },
                animation: {
                    //duration: 1000,
                    easing: 'easeInExpo',
                }
            }
        }
        return config;
    }
}
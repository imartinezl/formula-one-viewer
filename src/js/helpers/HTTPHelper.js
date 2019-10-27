"use strict";

export default class HTTPHelper {

    static get(url, params) {

        if (params) {
            url += '?' + FHTTPHelper.object2URLParams(params);
        }

        console.log("request get to : " + url);
        let promise = new Promise((resolve, reject) => {

            let request = new XMLHttpRequest();
            request.open('GET', url, true);

            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    var data = JSON.parse(this.response);
                    resolve(data);
                } else {
                    reject({ error: "something wrong happened" });
                }
            };

            request.onerror = function () {
                reject({ error: "something wrong happened" });
            };

            request.send();

        });


        return promise;

    }

    static post(url, data) {

        let promise = new Promise((resolve, reject) => {

            let request = new XMLHttpRequest();
            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

            console.log("request post to : " + url, "data: " + JSON.stringify(data));

            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    var response = JSON.parse(this.response);
                    resolve(response);
                } else {
                    reject({ error: "something wrong happened" });
                }
            };

            request.onerror = function () {
                reject({ error: "something wrong happened" });
            };

            request.send(JSON.stringify(data));

        });

        return promise;
    }

    static object2URLParams(data) {
        let str = '';
        for (var key in data) {
            if (str != '') {
                str += '&';
            }
            str += key + '=' + data[key];
        }

        return str;
    }

};
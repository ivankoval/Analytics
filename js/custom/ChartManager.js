/**
 * Created by IvanK on 3/8/2015.
 */
var ChartManager = function() {
    var self = this;
    this.chartDivId = 'chart';
    this.userData = undefined;
    this.userId = undefined;
    this.chartPoints = undefined;
    this.chart = undefined;
    this.startTS = 0;
    this.endTS = (moment(new Date().getTime()).startOf('day') + 86400)*1000;

    this.init = function(userData, userId) {
        self.userData = userData;
        self.userId = userId;
        self.chart = new BarChart();
        self.chart.init(self.chartDivId, "Activity chart");

        self.preparePoints(function() {
            self.plotChart();
        });
        self.changeDates();
    }

    this.barClicked = function(item) {
        console.log(item);
    }

    this.preparePoints = function(callback) {
        var arr = [];

        $.each(self.userData, function(i, item) {
            if(!self.userId || self.userId == item.userId) {
                var day = moment(item.startTimestamp).startOf('day').unix()*1000;
                arr.push(day);
            }
        });

        self.chartPoints = CountFrequency(arr);
        callback();
    }

    this.plotChart = function() {
        self.chart.clear();

        $.each(self.chartPoints, function(i, item) {
            if(item.timeStamp > self.startTS && item.timeStamp < self.endTS) {
                self.chart.push(item.freq, item.dateVal.toString(), function() {
                    self.barClicked(item);
                });
            }
        });

        self.chart.render();
    }

    this.changeDates = function() {

        $("#datetimepicker6").on("dp.change",function   (e) {
            self.startTS = moment(e.date).startOf('day').unix() * 1000 - 1;
            self.plotChart();
        });

        $("#datetimepicker7").on("dp.change",function (e) {
            self.endTS = moment(e.date).startOf('day').unix() * 1000 + 1;
            self.plotChart();
        });
    }

}
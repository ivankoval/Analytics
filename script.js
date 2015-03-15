/**
 * Created by IvanK on 3/3/2015.
 */

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function CountFrequency(arr) {
    var a = [], b = [], data = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    for(var k = 0; k < a.length; k++) {
        var obj = {};
        obj.dateVal = moment(a[k]).format('MMMM Do YYYY');
        obj.freq = b[k];
        data.push(obj);
    }

    return data;
}

var BarChart = function() {
    var self = this;
    this.divId = '';
    this.title = '';
    this.data = [];

    this.options = {
        title: {
            text: self.title
        },
        data: [{
            dataPoints: self.data
        }]
    };

    this.init = function(divId, title) {
        self.divId = divId;
        self.title = title;
        self.options.title.text = title;
        self.plot = new CanvasJS.Chart(self.divId, self.options);
    };

    this.render = function() {
        self.plot.render();
    };

    this.clear = function() {
        while(self.data.length > 0) {
            self.data.pop();
        }
    }

    this.push = function(yVal, label) {
        self.data.push({
            y: yVal,
            label: label
        });
    };
}

var GetData = function(userId, plot) {
    var self = this;

    this.userId = userId;
    this.token = "bVMfac8nL7";
    this.json = undefined;
    this.url = "http://api.cardiomood.com/getSessions.php?token=" + self.token + "&userId=" + self.userId;

    this.ajaxRequest = function(callback) {

        $.ajax({
            url: self.url
        }).done(function(data) {
            self.json = JSON.parse(data);
            callback();
        });
    };

    self.ajaxRequest(function(){
        plot();
    });

}

var PlotChart = function(userId) {
    var self = this;
    this.startTS = 0;
    this.endTS = (moment(new Date().getTime()).startOf('day') + 86400)*1000;
    this.chart = new BarChart();

    this.plot = function() {
        self.chart.init("chart", "Activity chart");
        var arr = [];
        self.chart.clear();

        $.each(self.data.json, function(i, item) {
            var day = moment(item.startTimestamp).startOf('day').unix()*1000;

            if(day > self.startTS && day < self.endTS) {
                arr.push(day);
            }
        });

        arr = CountFrequency(arr);

        $.each(arr, function(i, item) {
            self.chart.push(item.freq, item.dateVal.toString());
        });

        self.chart.render();
    }

    this.render = function() {

        $("#datetimepicker6").on("dp.change",function (e) {
            self.startTS = moment(e.date).startOf('day').unix() * 1000 - 1;
            self.plot();
        });

        $("#datetimepicker7").on("dp.change",function (e) {
            self.endTS = moment(e.date).startOf('day').unix() * 1000 + 1;
            self.plot();
        });
    }

    this.data = new GetData(userId, self.plot);
    self.render();

}

var ShowUser = function(userId) {
    var appId = "SSzU4YxI6Z6SwvfNc2vkZhYQYl86CvBpd3P2wHF1";
    var jsKey = "0ppjIVaWy3aqHyGEA95InejakxRELOMrePgRfREt";
    Parse.initialize(appId, jsKey);
    var query = new Parse.Query(Parse.User);
    query.equalTo("objectId", userId);
    query.find({
       success: function(result) {
           for(var i = 0; i < result.length; i++) {
               var object = result[i];
               $("#info").html(object.get("firstName") + " " + object.get("lastName") + " " + object.get("username"));
           }
       }
    });
}

$(function(){
    var userId = GetURLParameter("userId");
    PlotChart(userId);
    ShowUser(userId);
});
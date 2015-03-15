/**
 * Created by IvanK on 3/8/2015.
 */

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
            color: "#4AACC5",
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

    this.push = function(yVal, label, onClick) {
        self.data.push({
            y: yVal,
            label: label,
            click: onClick
        });
    };
}
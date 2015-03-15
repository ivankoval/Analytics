/**
 * Created by IvanK on 3/8/2015.
 */

function initParse() {
    var appId = "SSzU4YxI6Z6SwvfNc2vkZhYQYl86CvBpd3P2wHF1";
    var jsKey = "0ppjIVaWy3aqHyGEA95InejakxRELOMrePgRfREt";
    Parse.initialize(appId, jsKey);
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
        obj.timeStamp = moment(a[k]);
        obj.dateVal = moment(a[k]).format('MMMM Do YYYY');
        obj.freq = b[k];
        data.push(obj);
    }

    return data;
}

//TODO merge getUsers and getSessions
function getUsers(date, callback) {
    var users = [];

    initParse();
    var CardioSession = Parse.Object.extend("CardioSession");
    var query = new Parse.Query(CardioSession);
    query.greaterThanOrEqualTo("startTimestamp", date._i);
    query.lessThan("startTimestamp", date._i + 86400000);
    query.find({
        success: function(results) {
            for(var i = 0; i < results.length; i++) {
                var object = results[i];
                users.push(object.get("userId"));
            }
            callback(users.getUnique());
        }
    });
}

function getSessions(date, callback) {


    var sessions = [];

    initParse();
    var CardioSession = Parse.Object.extend("CardioSession");
    var query = new Parse.Query(CardioSession);
    query.greaterThanOrEqualTo("startTimestamp", date._i);

    query.lessThan("startTimestamp", date._i + 86400000);
    query.find({
        success: function(results) {
            for(var i = 0; i < results.length; i++) {
                var object = results[i];
                sessions.push({obj: object.id, user: object.get('userId')});
            }
            callback(sessions);
        }
    });
}

Array.prototype.getUnique = function(){
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
}
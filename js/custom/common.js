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

function getSessionsInDate(date, callback) {
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

function getUniqueValues(array) {
    var isExs = [], uniqueArray = [];
    for(var i = 0; i < array.length; i++) {
        var obj = array[i];
        if(isNaN(isExs[obj])) {
            isExs[obj] = true;
            uniqueArray.push(obj);
        }
    }
    return uniqueArray;
}

function enablePreloader(){
    $('.gallery-loader').removeClass('hide');
}

function disablePreloader(){
    $('.gallery-loader').addClass('hide');
}

function loadAllDataFromParseRecursively(className, page, createdAt, results, callback){
    if (className == undefined){
        callback({error: 'className is not defined'});
        return;
    }
    var q = new Parse.Query(Parse.Object.extend(className));
    q.limit(1000);
    q.skip(page * 1000);
    q.greaterThan('createdAt', createdAt);
    q.addAscending('createdAt');
    q.find(function(list){
        if (page > 8){
            page = 0;
            createdAt = results[results.length - 1].createdAt;
        }
        page = page + 1;

        results = results.concat(list);
        if (list.length < 1000){
            disablePreloader();
            callback(results);
            return;
        }
        loadAllDataFromParseRecursively(className, page, createdAt, results, callback);
    });
}

function loadAllDataFromParse(className, callback){
    initParse();
    enablePreloader();
    loadAllDataFromParseRecursively(className, 0, new Date(0), [], callback);
}

function compare(a,b) {
    if (a.freq < b.freq)
        return -1;
    if (a.freq > b.freq)
        return 1;
    return 0;
}
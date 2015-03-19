/**
 * Created by IvanK on 3/15/2015.
 */

var AllUsersManager = function() {
    var self = this;
    this.users = [];
    this.sessions = [];
    this.usersArrayRanked = [];

    this.init = function(callback) {
        loadAllDataFromParse('CardioSession', function(sessions) {
            self.sessions = sessions;
            loadAllDataFromParse('_User', function(users) {
                self.users = users;
                callback();
            });
        });
    }

    this.getUserById = function(userId){
        for(var i = 0; i < self.users.length; i++) {
            var object = self.users[i];
            if(object.id == userId) {
                return object;
            }
        }
    }

    this.getSessionById = function(sessionId) {
        for(var i = 0; i < self.sessions.length; i++) {
            var object = self.sessions[i];
            if(object.id == sessionId) {
                return object;
            }
        }
    }
    //TODO Last session by Id

    this.getLastSessionById = function(userId) {
        var lastSession = undefined;
        for(var i = 0; i < self.sessions.length; i++) {
            var session = self.sessions[i];

            if(session.attributes['userId'] == userId) {
                lastSession = session;

            }
        }
        return lastSession;
    }

    this.getTopUsers = function(start, end, callback) {
        var userFreq = [], tuples = [];

        for(var i = 0; i < self.sessions.length; i++) {
            var obj = self.sessions[i];
            if(obj.attributes.startTimestamp > start && obj.attributes.startTimestamp < end) {
                var userId = obj.attributes.userId;
                (isNaN(userFreq[userId])) ? userFreq[userId] = 1 : userFreq[userId]++ ;
            }
        }

        for (var key in userFreq) {
            tuples.push({user: key, freq: userFreq[key]});
        }

        tuples.sort(compare);
        self.usersArrayRanked = tuples;
        callback();

    }
}
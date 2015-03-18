/**
 * Created by IvanK on 3/15/2015.
 */

var AllUsersManager = function() {
    var self = this;
    this.users = [];
    this.sessions = [];
    this.userFreq = [];
    this.usersAsc = [];

    this.init = function(callback) {
        loadAllDataFromParse('CardioSession', function(sessions) {
            self.sessions = sessions;
            loadAllDataFromParse('_User', function(users) {
                self.users = users;
                self.getNumOfSessions();
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

    this.getNumOfSessions = function() {
        for(var i = 0; i < self.sessions.length; i++) {

            var obj = self.sessions[i];
            var userId = obj.attributes.userId;
            (isNaN(self.userFreq[userId])) ? self.userFreq[userId] = 1 : self.userFreq[userId]++ ;
        }
    }

    this.getTopUsers = function(callback) {
        var tuples = [];

        for (var key in self.userFreq) {
            if(key != 'getUnique'){
                tuples.push({user: key, freq: self.userFreq[key]});
            }
        }

        tuples.sort(compare);
        self.usersAsc = tuples;
        callback();

    }
}
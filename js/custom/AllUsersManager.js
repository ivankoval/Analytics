/**
 * Created by IvanK on 3/15/2015.
 */

var AllUsersManager = function() {
    var self = this;
    this.users = [];

    this.init = function() {
        initParse();
        var userQuery = new Parse.Query(Parse.User);
        userQuery.descending("createdAt");
        userQuery.limit(1000);
        var skip = 0;
        self.find(userQuery, skip, function() {
            self.getEmail();
        });
    }


    this.find = function(query, skip, callback) {
        query.skip(1000*skip);
        query.find({
            success: function(results) {
                for(var i = 0; i < results.length; i++) {
                    var object = results[i];
                    self.users.push({id: object.id, email: object.get('email')});
                }

                if(results.length == 1000) {
                    skip++;
                    self.find(query, skip);
                }
                else {
                    callback();
                }

            }
        });
    }

    this.getEmail = function(userId){

    }
}
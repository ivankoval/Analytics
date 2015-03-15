/**
 * Created by IvanK on 3/8/2015.
 */

//    todo вход id выход всякие методы
var UserInfoManager = function() {
    var self = this;
    this.currentUser = undefined;
    this.userFirstName = '';
    this.userLastName = '';
    this.userLogin = '';
    this.tag = '';

    this.init = function(currentUser, tag) {
        initParse();
        self.currentUser = currentUser;
        self.tag = tag;
        if(currentUser) {
            self.prepareUserInfo(function() {
                self.showUserInfo();
            });
        }
    }

    this.prepareUserInfo = function(callback) {
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", self.currentUser);
        query.find({
            success: function (result) {
                for (var i = 0; i < result.length; i++) {
                    var object = result[i];
                    self.userFirstName = object.get("firstName");
                    self.userLastName = object.get("lastName");
                    self.userLogin = object.get("username");
                    callback();
                }
            }
        });
    }

    this.showUserInfo = function() {
        $(self.tag).html(self.userFirstName + " " + self.userLastName + " " + self.userLogin);
    }

}
/**
 * Created by IvanK on 3/12/2015.
 */
var ModalManager = function() {
    var self = this;
    this.users = undefined;
    this.url = '/analytics/userSessions.html?userId=';

    this.init = function(users, allUsersManager) {
        self.users = users;
        $('.list-group').empty();

        for(var i = 0; i < users.length; i++) {
            var user = allUsersManager.getUserById(users[i]);
            $('.list-group').append('<li class="list-group-item"><a href="#" data-id="'+ users[i] +'" class="link">' +  user.attributes['email'] + '</a></li>');
        }
        $('.modal').modal('show');
    }

}
/**
 * Created by IvanK on 3/12/2015.
 */
//todo show user name
var ModalManager = function() {
    var self = this;
    this.users = undefined;
    //this.url = 'http://api.cardiomood.com/analytics/userSessions.html?userId=';
    this.url = '/analytics/userSessions.html?userId=';

    this.init = function(users) {
        self.users = users;
        $('.list-group').empty();

        for(var i = 0; i < users.length; i++) {
            $('.list-group').append('<li class="list-group-item"><a href="#" data-id="'+ users[i] +'" class="link">' +  users[i] + '</a></li>');
        }
        $('.modal').modal('show');
    }

}
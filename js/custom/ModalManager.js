/**
 * Created by IvanK on 3/12/2015.
 */
var ModalManager = function() {
    var self = this;
    this.users = undefined;

    this.init = function(users, allUsersManager) {
        self.users = users;
        $('#modalUsersList').empty();
        $('#modalUserListHeader').html('Total users: ' + users.length);


        for(var i = 0; i < users.length; i++) {
            var user = allUsersManager.getUserById(users[i]);
            $('#modalUsersList').append('<li class="list-group-item"><a href="#" data-id="'+ users[i] +'" class="modalLink">' +  user.attributes['email'] + '</a></li>');
        }
        $('#usersModal').modal('show');
    }

}
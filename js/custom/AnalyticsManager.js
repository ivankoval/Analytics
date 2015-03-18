/**
 * Created by IvanK on 3/8/2015.
 */

var AnalyticsManager = function() {
    var self = this;
    this.currentUserId = undefined;
    this.allUserData = undefined;
    this.chartManager = new ChartManager();
    this.allUsersManager = new AllUsersManager();

    this.init = function() {
        self.allUsersManager.init(
            function(){
                self.allUsersManager.getTopUsers(function () {
                    self.topUsers();
                });

                self.loadData(function(){
                    self.initChartManager();
                })
            }
        );

        self.initCalendarDialog();

        self.showAllUsers();
        self.changeUserId();
        self.clickedUserModal();
    }

    this.initCalendarDialog = function() {
        $('#datetimepicker6').datetimepicker();
        $('#datetimepicker7').datetimepicker();
        $("#datetimepicker6").on("dp.change",function (e) {
            $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
        });
        $("#datetimepicker7").on("dp.change",function (e) {
            $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
        });
    }

    this.initChartManager = function() {
        self.chartManager.init(self.allUserData, self.currentUserId);
        self.chartManager.barClicked = function(item) {

            if(!self.currentUserId) {
                var modal = new ModalManager();
                getUsers(item.timeStamp, function (results) {
                    modal.init(results, self.allUsersManager);
                });
            }

            getSessions(item.timeStamp, function(sessions) {
                self.clickedUserSession(sessions);
            })
        }
    }

    this.loadData = function(callback) {
        enablePreloader();
        var token = "bVMfac8nL7";

        $.ajax({
            url: "http://api.cardiomood.com/getSessions.php?token=" + token + "&start=1"
        }).done(function(data) {
            disablePreloader();
            self.allUserData = JSON.parse(data);
            callback();
        });

    }

    this.showAllUsers = function() {
        $('#allUsers').on('click', function() {
            self.currentUserId = undefined;
            self.render();
        });
    }

    this.changeUserId = function() {
        $('#changeUser').on('click', function() {
            var userId =  $('#getUserId').val();
            if(!userId) {
                alert('userId empty!');
                return;
            }

            var user = self.allUsersManager.getUserById(userId);
            if(user) {
                self.currentUserId = userId;
                self.render();
            }
            else {
                alert('invalid userId!');
                return;
            }
        });
    }

    this.userInfo = function() {
        if(self.currentUserId) {
            $('.well').css("display", "block");
            var user = self.allUsersManager.getUserById(self.currentUserId);

            $('#userName').html(user.attributes['firstName'] + " " + user.attributes['lastName']);
            $('#userId').html(self.currentUserId);
            $('#userEmail').text(user.attributes['email']);
            $('#userFbId').attr('href', 'https://www.facebook.com/' + user.attributes['facebookId']);
        }
    }

    this.topUsers = function() {
    //    TODO получить все поля от UserInfoManager и собрать статистику
        if(!self.currentUserId) {
            $('#topUsers').css("display", "block");
            for(var i = self.allUsersManager.usersAsc.length - 1; i >= 0; --i) {
                var userId = self.allUsersManager.usersAsc[i]['user'];
                var sessionsNum = self.allUsersManager.usersAsc[i]['freq'];
                var user = self.allUsersManager.getUserById(userId);
                user.attributes['email']
                $('#topUsersList').append('<li class="list-group-item"><a href="#" data-id="'+ userId +
                '" class="link">' + user.attributes['email'] + ' (' + moment(user.createdAt).format("MMM Do YY") +
                ') <span style="float:right">' + sessionsNum + '</span></a></li>');
            }
        }
    }

    this.clickedUserModal = function() {
        $('body').on('click', '.link', function() {
            var id = $(this).attr('data-id');
            self.currentUserId = id;
            $('.modal').modal('hide');
            self.render();
        });
    }

    this.clickedUserSession = function(sessions) {
        if(self.currentUserId) {
            showSessions();
        }
        $('#showSessions').on('click', showSessions);

        function showSessions(){
            $('#stress').empty();

            for(var i = 0; i < sessions.length; i++) {
                if(self.currentUserId) {
                    if(self.currentUserId == sessions[i].user){
                        var user = self.allUsersManager.getUserById(sessions[i].user);
                        $('#stress').append('<div id="patientArticle" class="col-md-6 col-md-offset-3" itemscope itemtype="http://schema.org/Article" > <div id="articleHead" class="pb10 bb"> <div id="articleName"> <h1 itemprop="name"> <a href="http://doctor.cardiomood.com/user.html?id='+ sessions[i].user +'" target="_blank" >'+ user.attributes['email'] +'</a> </h1> </div> </div> <div id="articleContent" itemprop="articleSection" class="patientArticle production pt10" > <h3 style="text-align: center">Heart rate chart</h3> <img style="margin: 0 auto; display: block" src="http://share.cardiomood.com/getImage.php?sessionId='+ sessions[i].obj +'&type=pulse"> </div></div>');
                    }
                }
                else {
                    var user = self.allUsersManager.getUserById(sessions[i].user);
                    $('#stress').append('<div id="patientArticle" class="col-md-6 col-md-offset-3" itemscope itemtype="http://schema.org/Article" > <div id="articleHead" class="pb10 bb"> <div id="articleName"> <h1 itemprop="name"> <a href="http://doctor.cardiomood.com/user.html?id='+ sessions[i].user +'" target="_blank" >'+ user.attributes['email'] +'</a> </h1> </div> </div> <div id="articleContent" itemprop="articleSection" class="patientArticle production pt10" > <h3 style="text-align: center">Heart rate chart</h3> <img style="margin: 0 auto; display: block" src="http://share.cardiomood.com/getImage.php?sessionId='+ sessions[i].obj +'&type=pulse"> </div></div>');
                }
            }
        }
    }

    this.render = function() {
        self.chartManager.init(self.allUserData, self.currentUserId);
        $('#stress').empty();
        $('.well').css("display", "none");
        $('#topUsers').css("display", "none");
        $('#topUsersList').empty();
    //    TODO удалить то что в UserInfo и TopUser и
        self.userInfo();
        self.topUsers();
    }
}
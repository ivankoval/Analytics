/**
 * Created by IvanK on 3/8/2015.
 */

var AnalyticsManager = function() {
    var self = this;
    this.startTS = 0;
    this.endTS = (moment(new Date().getTime()).startOf('day') + 86400)*1000;
    this.currentUserId = undefined;
    this.allUserData = undefined;
    this.chartManager = new ChartManager();
    this.allUsersManager = new AllUsersManager();

    this.init = function() {
        self.allUsersManager.init(
            function(){
                self.allUsersManager.getTopUsers(self.startTS, self.endTS, function () {
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
        self.clickedUserInStat()
    }

    this.initCalendarDialog = function() {
        $('#datetimepicker6').datetimepicker();
        $('#datetimepicker7').datetimepicker();
        $("#datetimepicker6").on("dp.change",function (e) {
            $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
            self.startTS = moment(e.date).startOf('day').unix() * 1000 - 1;
            self.allUsersManager.getTopUsers(self.startTS, self.endTS, function () {
                $('#topUsersList').empty();
                self.topUsers();
            });
        });

        $("#datetimepicker7").on("dp.change",function (e) {
            $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
            self.endTS = moment(e.date).startOf('day').unix() * 1000 + 1;
            self.allUsersManager.getTopUsers(self.startTS, self.endTS, function () {
                $('#topUsersList').empty();
                self.topUsers();
            });
        });
    }

    this.initChartManager = function() {
        self.chartManager.init(self.allUserData, self.currentUserId);
        self.chartManager.barClicked = function(item) {

            if(!self.currentUserId) {
                var modal = new ModalManager();
                getSessionsInDate(item.timeStamp, function (results) {
                    var usersArray = [];
                    for(var i = 0; i < results.length; i++) {
                        usersArray.push(results[i].user);
                    }

                    modal.init(getUniqueValues(usersArray), self.allUsersManager);
                });
            }

            getSessionsInDate(item.timeStamp, function(sessions) {
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
        if(!self.currentUserId) {
            $('#topUsers').css("display", "block");
            $('#totalSessions').empty();

            var totalSessions = 0;
            for(var i = self.allUsersManager.usersArrayRanked.length - 1; i >= 0; --i) {
                var userId = self.allUsersManager.usersArrayRanked[i]['user'];
                var sessionsNum = self.allUsersManager.usersArrayRanked[i]['freq'];
                var user = self.allUsersManager.getUserById(userId);
                var lastSession = self.allUsersManager.getLastSessionById(userId).attributes['startTimestamp'];

                totalSessions += sessionsNum;
                $('#topUsersList').append('<a href="#" class="statLink list-group-item" style="min-height: 40px" data-id="'+ userId +
                '"><span style="float: left">' + user.attributes['email'] +
                ' (' + moment(user.createdAt).format("DD-MM-YYYY") +'; ' + moment(lastSession).format("DD-MM-YYYY")  +
                ')</span> <span style="float: right">' + sessionsNum + '</span></a>');
            }
            $('#totalSessions').html("Total sessions: " + totalSessions);
        }
    }

    this.clickedUserModal = function() {
        $('body').on('click', '.modalLink', function() {
            var id = $(this).attr('data-id');
            self.currentUserId = id;
            $('#usersModal').modal('hide');
            self.render();
        });
    }

    this.clickedUserInStat = function() {
        $('body').on('click', '.statLink', function() {
            var id = $(this).attr('data-id');
            self.currentUserId = id;
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
                        var session = self.allUsersManager.getSessionById(sessions[i].obj);
                        $('#stress').append('<div id="patientArticle" class="col-md-6 col-md-offset-3" itemscope itemtype="http://schema.org/Article" > <div id="articleHead" class="pb10 bb"> <div id="articleName"> <h1 itemprop="name"> <a href="http://doctor.cardiomood.com/user.html?id='+ sessions[i].user + '&sessionId=' + sessions[i].obj +'" target="_blank" >'+ user.attributes['email'] +'</a> </h1> </div> </div> <div id="articleContent" itemprop="articleSection" class="patientArticle production pt10" > <h3 style="text-align: center">'+ session.attributes['name'] +'</h3> <img style="margin: 0 auto; display: block" src="http://share.cardiomood.com/getImage.php?sessionId='+ sessions[i].obj +'&type=pulse"> </div></div>');
                    }
                }
                else {
                    var user = self.allUsersManager.getUserById(sessions[i].user);
                    var session = self.allUsersManager.getSessionById(sessions[i].obj);
                    $('#stress').append('<div id="patientArticle" class="col-md-6 col-md-offset-3" itemscope itemtype="http://schema.org/Article" > <div id="articleHead" class="pb10 bb"> <div id="articleName"> <h1 itemprop="name"> <a href="http://doctor.cardiomood.com/user.html?id='+ sessions[i].user +'&sessionId='+ sessions[i].obj +'" target="_blank" >'+ user.attributes['email'] +'</a> </h1> </div> </div> <div id="articleContent" itemprop="articleSection" class="patientArticle production pt10" > <h3 style="text-align: center">'+ session.attributes['name']+ '</h3> <img style="margin: 0 auto; display: block" src="http://share.cardiomood.com/getImage.php?sessionId='+ sessions[i].obj +'&type=pulse"> </div></div>');
                }
            }
        }
    }

    this.render = function() {
        self.chartManager.init(self.allUserData, self.currentUserId);
        $('#stress').empty();
        $('#topUsersList').empty();
        $('#userInfo').css("display", "none");
        $('#topUsers').css("display", "none");
        self.userInfo();
        self.topUsers();
    }
}
/**
 * Created by IvanK on 3/8/2015.
 */

var AnalyticsManager = function() {
    var self = this;
    this.currentUserId = undefined;
    this.allUserData = undefined;
    this.chartManager = new ChartManager();
    this.userInfoManager = new UserInfoManager();
    this.allUsersManager = new AllUsersManager();

    this.init = function() {
        self.userInfoManager.init(self.currentUserId);
        self.allUsersManager.init();

        self.initCalendarDialog();
        self.loadData(function(){
            self.initChartManager();
        });
        self.showAllUsers();
        self.changeUserId();
        self.topUsers();
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
                    modal.init(results);
                });
            }

            getSessions(item.timeStamp, function(sessions) {
                self.clickedUserSession(sessions);
            })
        }
    }

    this.loadData = function(callback) {
        //TODO подправить start
        var token = "bVMfac8nL7";

        $.ajax({
            url: "http://api.cardiomood.com/getSessions.php?token=" + token + "&start=1"
        }).done(function(data) {
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
            initParse();
            var userQuery = new Parse.Query(Parse.User);
            userQuery.equalTo('objectId', userId);
            userQuery.find({
                success: function(results) {
                    if(results.length == 0) {
                        alert('invalid userId!');
                        return;
                    }
                    self.currentUserId = userId;
                    self.render();
                }
            });
        });
    }

    this.userInfo = function() {
        if(self.currentUserId) {

        }
    //TODO всякие разные поля от UserInfoManager
    }

    this.topUsers = function() {
    //    TODO получить все поля от UserInfoManager и собрать статистику
        if(!self.currentUserId) {

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
        $('#showSessions').on('click', function() {
            $('#stress').empty();

            for(var i = 0; i < sessions.length; i++) {
                var url = "http://share.cardiomood.com/getImage.php?sessionId=" + sessions[i].obj + "&type=pulse";
                $('#stress').append('<div id="patientArticle" class="col-md-6 col-md-offset-3" itemscope itemtype="http://schema.org/Article" > <div id="articleHead" class="pb10 bb"> <div id="articleName"> <h1 itemprop="name"> <a href="http://doctor.cardiomood.com/user.html?id='+ sessions[i].user +'" target="_blank" >'+ sessions[i].user +'</a> </h1> </div> </div> <div id="articleContent" itemprop="articleSection" class="patientArticle production pt10" > <h3 style="text-align: center">Heart rate chart</h3> <img style="margin: 0 auto; display: block" src="http://share.cardiomood.com/getImage.php?sessionId='+ sessions[i].obj +'&type=pulse"> </div></div>');

            }
        });
    }

    this.render = function() {
        self.chartManager.init(self.allUserData, self.currentUserId);
        self.userInfoManager.init(self.currentUserId);
        $('#stress').empty();
    //    TODO удалить то что в UserInfo и TopUser и
        self.userInfo();
        self.topUsers();
    }
}
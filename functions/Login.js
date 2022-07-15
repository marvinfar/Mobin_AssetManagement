$(document).delegate("#cmdLogin", "click", function() {
    setUserLevelToButton();
    var u = $("#txtUserName").val();
    var p = $("#txtPassword").val();
    if (u === '') {
        $("#txtUserName").notify('نام کاربری خالی می باشد');
        $("#txtUserName").focus();
        return;
    }
    if (p === '') {
        $("#txtPassword").notify('کلمه ی عبور خالی می باشد');
        $("#txtPassword").focus();
        return;
    }
    $.ajax({
        type: "Post",
        url: "/login/CheckLoginUserPass",
        data: { 'un': u, 'pw': p },
        dataType: "json",
        success: function (result) {
            if (!result.active) {
                $("#LoginBox").notify("کاربر مورد نظر غیر فعال می باشد", "warn");
                return;
            } else {
                //SaveLoginLog(u);
                sessionStorage.setItem('user_name', result.username);
                sessionStorage.setItem('user_id', result.Id);
                sessionStorage.setItem('user_lvl', result.levelCode);
                window.location.href = '/dashboard/dashboardView';
            }
        },
        error: function (result) {
            $.notify("نام کاربری یا رمز عبور اشتباه می باشد", "error");
        }
    });

});

function SaveLoginLog(u) {
        var d = [];
        var dt = new Date();
        var xtime = dt.toLocaleTimeString();
        var xdate = dt.toLocaleDateString();

        d[0] = u;
        d[1] = xtime;
        d[2] = xdate;
        d[3] = $("#lblIP").text();

    $.ajax({
        type: "Post",
        url: "/login/SaveLoginLog",
        data: { 'd': d },
        dataType: "json",
        success: function (result) { }
        
    });
}

$(document).ready(function () {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.ipify.org/?format=json", true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var ip = JSON.parse(this.responseText).ip;
            $("#lblip").text(ip);
        }
    };


    $("#txtDate").MdPersianDateTimePicker({
        Trigger: 'focus',
        Placement: 'top',
        ToDate: true, // default is false,
        FromDate: true,
        EnableTimePicker: false
    });
    
   

    sessionStorage.clear();
});
//fetch all users list

$(document).delegate("#cmdChangePassClose", "click", function() {
        window.close();
});

$(document).delegate("#cmdChangePassUpdate", "click", function() {
    if (checkEmpty($('#txtChangePassPassword'))) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: "رمز عبور را وارد نمایید ",
            type: 'red',
            boxWidth: '15%',
            useBootstrap: false
        });
        $('#txtChangePassPassword').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblChangePassUserID').text();
    d[1] = $('#txtChangePassPassword').val();
    $.ajax({
        type: "Post",
        url: "/defineUsers/ChangePassword",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            if (result) {
                sessionStorage.clear();
                window.location.href = "/Login/LoginView";
            }
        }
    });
});




$(document).ready(function () {
    CheckUserSession();

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height": "300px" });
    $("#lblChangePassUserID").text(sessionStorage.getItem('user_id'));
    $("#lblChangePassUserName").text(sessionStorage.getItem('user_name'));
    $("#txtChangePassPassword").focus();
    $('#frmModalGetData1').show();

  
});
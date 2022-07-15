//fetch all users list
function GetUsersList() {
    $('#divTableUsers').show();
    $("#LoadingStatus").html("در حال بارگذاری...");
    
    $.ajax({
        type: "Get",
        url: '/defineUsers/GetUsersList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            
            var setData = $("#SetUsersList");
            var  strText = "";
            
            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].Id +
                    "' data-id='" + data[i].levelCode+"' >" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].Id +
                    "</td>" +
                    "<td>" +
                    data[i].username +
                    "</td>" +
                    "<td style='display: none'>" +
                    data[i].password +
                    "</td>" +
                    "<td>" +
                    data[i].levelDescription+
                    "</td>" +
                    "<td>" +
                    "<input type='checkbox' name='ch' disabled " + Checked(data[i].active) +"> "+
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });



}

function Checked(v) {
    //This function determinate actived or disabled user by tik on Checkbox Column
    var r = "";
    if (v) {
        r = "checked";
        return r;
    }
}

function GetUsersLevel(s) {
    $.ajax({
        type: "Get",
        url: '/defineUsers/GetUsersLevelList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            var setData = $('#selUserLevel');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].levelCode +
                    "'>" +
                    data[i].levelDescription +
                    "</option>";

            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selUserLevel option[value=' + s + ']').prop('selected', true);
        
    }

    });

}
function addNewUsers() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height": "300px" });
    GetUsersLevel(-1);

    $('#frmModalGetData1').show();
    $('#txtUserName').focus();
    $('#lblUserID').text("0");
    $('#txtUserName').val("");
    $('#txtPassword').val("");

}


$(document).mouseup(function (e) {
    var container = $("#frmModalGetData1");

    // If the target of the click isn't the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});

function checkEmpty(inp) {
    
    if (inp.val() === "") {
        return true;
    }

}


function subMenuOpen() {
    var getName = function () {
        document.onclick = function (e) {
            if (e.target.className == 'myBtn') {
                var image = e.target.getAttribute("id");
                var i = image.indexOf("-");
                var u = image.substring(i + 1);

                if ($("#sm-" + u).is(":visible")) {
                    $("#sm-" + u).hide();
                } else {
                    $("#sm-" + u).show();
                }

                //////////////////////
            }
        }
    }
    getName();


}


function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    
    if (checkEmpty($('#txtUserName'))) {
        alert("لطفا نام کاربر را وارد نمایید");
        $('#txtUserName').focus();
        return;
    }

    if (checkEmpty($('#txtPassword'))) {
        alert("لطفا رمز عبور را وارد نمایید");
        $('#txtPassword').focus();
        return;
    }

    var selectedId = $('#selUserLevel option:selected').val();
    if (selectedId == -1) {
        alert("لطفاسطح دسترسی را انتخاب نمایید");
        $('#selUserLevel').focus();
        return;
    }

    var d = [];
    d[0] = $('#lblUserID').text();
    d[1] = $('#txtUserName').val();
    d[2] = $('#txtPassword').val();
    d[3] = selectedId;
    d[4] = $('#chkActive').prop("checked");
    $.ajax({
        type: "Post",
        url: "/defineUsers/SaveUsers",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            GetUsersList();
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var pId = $('.rowSelected').find('td').eq(1).text();
    var pName = $('.rowSelected').find('td').eq(2).text();
    if (pId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی نام کالا :" + pName + "--- کد کالا:" + pId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        alert('یک سطر را انتخاب نمایید');
    }

}

$(document).ready(function () {
    CheckUserSession();
    $('#divTableUsers').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    GetUsersList();
    GetUsersLevel(-1);
    
});
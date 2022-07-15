//fetch all product group list

function GetUserLevel() {
    $.ajax({
        type: "Get",
        url: '/userLevel/GetUserLevel',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#lstUserLevel');
            var strText = "";
            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].levelCode +
                    "'>" +
                    data[i].levelDescription + "</option>";

            }
            $(setData).html(strText);
        }

    });

}

function AddNewUserLevel() {
    
    if (!checkEmpty($('#txtUserLevel'))) {
        var d = [];
        d[0] = 0;
        d[1] = $('#txtUserLevel').val();
        $.ajax({
            type: "Post",
            url: "/userLevel/SaveUserLevel",
            data: { 'd': d },
            dataType: "json",
            success: function (result) {
                GetUserLevel();
                $('#txtUserLevel').val("");
                $('#txtUserLevel').focus();
            }
        });
    }
    else {
        alert("لطفا عنوان سطح دسترسی را وارد نمایید");
        $('#txtUserLevel').focus();
    }


}

function EditUserLevel() {
    var selectedId = $('#lstUserLevel option:selected').val();
    var editmode = $("#cmdEditUserLevel").data('id');
    if (editmode === 0) {
        if (selectedId > 0) {
            $("#cmdEditUserLevel").data('id', 1); //1 means edit mode
            $("#cmdEditUserLevel").html('ثبت تغییرات');
            $("#cmdAddUserLevel").prop('disabled', true);
            $("#cmdDelUserLevel").prop('disabled', true);
            $("#cmdBack").prop('disabled', true);
            $("#lstUserLevel").prop('disabled', true);
            $("#txtUserLevel").val($('#lstUserLevel option:selected').html());
            $("#txtUserLevel").select();

        } else {
            alert("لطفا مقداری را از لیست انتخاب نمایید");
        }
    } else { // Update Click 
        if (!checkEmpty($('#txtUserLevel'))) {
            var d = [];
            d[0] = selectedId;
            d[1] = $('#txtUserLevel').val();
            $.ajax({
                type: "Post",
                url: "/userLevel/SaveUserLevel",
                data: { 'd': d },
                dataType: "json",
                success: function (result) {
                    GetUserLevel();
                    $('#txtUserLevel').val("");
                    $('#txtUserLevel').focus();
                }
            });
            $("#cmdEditUserLevel").data('id', 0); // Exit edit mode and Save
            $("#cmdEditUserLevel").html('ویرایش');
            $("#cmdAddUserLevel").prop('disabled', false);
            $("#cmdDelUserLevel").prop('disabled', false);
            $("#cmdBack").prop('disabled', false);
            $("#lstUserLevel").prop('disabled', false);

        }
        else {
            alert("لطفا عنوان سطح دسترسی را وارد نمایید");
            $('#txtUserLevel').focus();
        }
    }
}

function checkEmpty(inp) {
    
    if (inp.val()=== "") {
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


function editProduct() {
    //the select product group id
    var pId = $('.rowSelected').find('td').eq(1).text();
    var pName = $('.rowSelected').find('td').eq(2).text();
    var pGId = $('.rowSelected').data('id');

    if (pId.length > 0) {
        $('#lblProductID').text(pId);
        $('#txtProductName').val(pName);
        $('#selProductGroup option[value=' + pGId + ']').prop('selected', true);

        $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height": "300px" });
        $('#frmModalGetData1').show();
        $('#txtProductName').focus();
    } else {
        alert('یک سطر را انتخاب نمایید');
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {

    if (checkEmpty($('#txtProductName').val())) {
        alert("لطفا مقدار را وارد نمایید");
        $('#txtProductName').focus();
        return;
    }

    var selectedId = $('#selProductGroup option:selected').val();
    if (selectedId == -1) {
        alert("لطفا گروه کالا را انتخاب نمایید");
        $('#selProductGroup').focus();
        return;
    }

    var d = [];
    d[0] = $('#lblProductID').text();
    d[1] = $('#txtProductName').val();
    d[2] = selectedId;
    $.ajax({
        type: "Post",
        url: "/products/SaveProducts",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindProducts('#SetProductList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var selectedId = $('#lstUserLevel option:selected').val();
    var selectedName = $('#lstUserLevel option:selected').html();
    if (selectedId > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی عنوان دسترسی :" + selectedName + "--- کد دسترسی:" + selectedId);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        alert("لطفا مقداری را از لیست انتخاب نمایید");
    }

}


function DeleteUserLevel() {
    var selectedId = $('#lstUserLevel option:selected').val();
    $.ajax({
        type: "Post",
        url: "/userLevel/DeleteUserLevel",
        data: { 'userLevelCode': parseInt(selectedId) },
        dataType: "json",
        success: function (result) {
            GetUserLevel();
            closeModal('frmModalDelete');
        }

    });
}

$(document).ready(function () {
    CheckUserSession();
    $('#frmModalDelete').hide();
    GetUserLevel();
});
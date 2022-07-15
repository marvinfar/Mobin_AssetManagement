//fetch all product group list
function DataBindProducts(t) {
    $('#divTableProducts').show();
    $("#LoadingStatusProducts").html("در حال بارگذاری...");
    
    $.ajax({
        type: "Get",
        url: '/products/GetProductList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].productId +
                    "' data-id='" + data[i].productGroupId +"' >" +
                    "<td>" +
                    (i + 1) +
                    "</td>" +
                    "<td>" +
                    data[i].productId +
                    "</td>" +
                    "<td>" +
                    data[i].productName +
                    "</td>" +
                    "<td>" +
                    data[i].productGroupNameX +
                    "</td>" +
                    "</tr>";


            }

            $("#LoadingStatusProducts").html(" ");
            $(setData).html(strText);
        }

    });



}

function GetProductGroup(s) {
    $.ajax({
        type: "Get",
        url: '/products/GetProductGroupList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $('#selProductGroup');
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<option value='" +
                    data[i].productGroupId +
                    "'>" +
                    data[i].productGroupName + "</option>";

            }
            $(setData).html(strText);
            strText += "<option value=-1>انتخاب کنید</option>";
            $(setData).html(strText);
            $('#selFilterPG').html(strText);
            //select last item
            $('#selProductGroup option[value=' + s + ']').prop('selected', true);
            $('#selFilterPG option[value=' + s + ']').prop('selected', true);
        }

    });

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

function addNewProduct() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height": "300px" });

    GetProductGroup(-1);


    $('#frmModalGetData1').show();
    $('#txtProductName').focus();
    $('#lblProductID').text("0");
    $('#txtProductName').val("");
}

function editProduct() {
    //the select product group id
    var pId = $('.rowSelected').find('td').eq(1).text();
    var pName = $('.rowSelected').find('td').eq(2).text();
    var pGId = $('.rowSelected').data('id');
    GetProductGroup(pGId);
    if (pId.length > 0) {
        $('#lblProductID').text(pId);
        $('#txtProductName').val(pName);
        

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

    if (checkEmpty($('#txtProductName'))) {
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

function deleteProduct() {
    var pId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/products/DeleteProduct",
        data: { 'pId': parseInt(pId) },
        dataType: "json",
        success: function (result) {
            DataBindProducts('#SetProductList');
            closeModal('frmModalDelete');
        }

    });
}

$(document).delegate("#cmdClearFilter", "click", function() {
    $("#txtFilterPName").val("");
    $("#selFilterPG").val(-1);
    DataBindProducts('#SetProductList');
});

function applyFilter() {
    var selectedId = $('#selFilterPG option:selected').val();
    var boolCheck = checkEmpty($('#txtFilterPName'));
    if (boolCheck && selectedId == -1) {
        alert("لطفا مقدار را وارد نمایید");
        $('#txtFilterPName').focus();
        return;
    }
    else {
        var d = [];
        d[0] = $('#txtFilterPName').val();
        d[1] = selectedId;

        $.ajax({
            type: "POST",
            url: "/products/GetProductFilter",
            data: { 'd': d },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetProductList');
                var strText = "";

                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].productId +
                        "' data-id='" + data[i].productGroupId + "' >" +
                        "<td>" +
                        (i + 1) +
                        "</td>" +
                        "<td>" +
                        data[i].productId +
                        "</td>" +
                        "<td>" +
                        data[i].productName +
                        "</td>" +
                        "<td>" +
                        data[i].productGroupNameX +
                        "</td>" +
                        "</tr>";
                }
                $("#LoadingStatusProducts").html(" ");
                $(setData).html(strText);
            }
        });
    }

}
$(document).ready(function () {
    CheckUserSession();
    $('#divTableProducts').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
    GetProductGroup(-1);
    DataBindProducts('#SetProductList');
    $.notify(sessionStorage.getItem('user_name') + " خوش آمدید ", { className: 'success', position: "top,center" });
});
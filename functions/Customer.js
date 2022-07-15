//fetch all Customer list
function DataBindCustomer(t) {
    $('#divTableCustomer').show();
    $("#LoadingStatus").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/customer/GetCustomerList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var  strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].customerId +
                    "'>" +
                    "<td style='width: 15px'>" +
                    (i + 1) +
                    "</td>" +
                    "<td style='width: 25px'>" +
                    data[i].customerId +
                    "</td>" +
                    "<td style='width: 150px'>" +
                    data[i].customerFName +
                    "</td>" +
                    "<td style='width: 150px'>" +
                    data[i].customerLName +
                    "</td>" +
                    "<td style='width: 150px'>" +
                    Null2Empty(data[i].customerMobile) +
                    "</td>" +
                    "<td>" +
                    Null2Empty(data[i].customerPhone) +
                    "</td>" +
                    "<td style='width: 200px'>" +
                    Null2Empty(data[i].customerAddress) +
                    "</td>" +
                    "<td style='width: 100px'>" +
                    Null2Empty(data[i].customerCompany) +
                    "</td>" +
                    "</tr>";
            }

            $("#LoadingStatus").html(" ");
            $(setData).html(strText);
        }

    });
}

function addNewCustomer() {

    $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height":"650px" });


    $('#frmModalGetData1').show();
    $('#txtCustomerFName').focus();
    $('#lblCustomerID').text("0");
    $('#txtCustomerFName').val("");
}

function editCustomer() {
    //the select  id
    var cus=[]; // id,fname,lname,mobile,phone,add,comp
    for (var i = 0; i <= 6; i++) {
        cus[i] = $('.rowSelected').find('td').eq(i+1).text();
    }
    if (cus[1].length > 0) {
        $('#lblCustomerID').text(cus[0]);
        $('#txtCustomerFName').val(cus[1]);
        $('#txtCustomerLName').val(cus[2]);
        $('#txtCustomerMobile').val(cus[3]);
        $('#txtCustomerPhone').val(cus[4]);
        $('#txtCustomerAddress').val(cus[5]);
        $('#txtCustomerCompany').val(cus[6]);

        $('#frmModalGetData1').css({ "top": "200px", "left": "800px", "height": "650px" });
        $('#frmModalGetData1').show();
        $('#txtCustomerFName').focus();
    } else {
        $.notify('یک سطر را انتخاب نمایید',"warn");
    }
}

function closeModal(frm) {
    //$('#frmModalGetData1').hide();
    $('#' + frm).hide();
}

function cmdUpdate() {
    var fname = $('#txtCustomerFName');
    var lname = $('#txtCustomerLName');
    if (checkEmpty(fname) || checkEmpty(lname)) {
        $('#txtCustomerFName').notify("لطفا نام یا نام خانوادگی را وارد نمایید","warn");
        $('#txtCustomerFName').focus();
        return;
    }
    var d = [];
    d[0] = $('#lblCustomerID').text();
    d[1] = $('#txtCustomerFName').val();
    d[2] = $('#txtCustomerLName').val();
    d[3] = $('#txtCustomerMobile').val();
    d[4] = $('#txtCustomerPhone').val();
    d[5] = $('#txtCustomerAddress').val();
    d[6] = $('#txtCustomerCompany').val();

    $.ajax({
        type: "Post",
        url: "/customer/SaveCustomers",
        data: { 'd': d },
        dataType: "json",
        success: function (result) {
            DataBindCustomer('#SetCustomerList');
            closeModal('frmModalGetData1');
        }
    });
}

function showDeleteModal() {
    var customerId = $('.rowSelected').find('td').eq(1).text();
    var fname = $('.rowSelected').find('td').eq(2).text();
    var lname = $('.rowSelected').find('td').eq(3).text();

    if (customerId.length > 0) {
        $('#lblDisplayDeleteInfo').text("اطلاعات سطر انتخابی :" + fname  + " " + lname);
        $('#frmModalDelete').css({ "top": "200px", "left": "800px" });
        $('#frmModalDelete').show();
    } else {
        $.notify('یک سطر را انتخاب نمایید', "warn");
    }

}

function deleteCustomer() {
    
    var CustomerId = $('.rowSelected').find('td').eq(1).text();
    $.ajax({
        type: "Post",
        url: "/customer/DeleteCustomer",
        data: { 'CustomerId': Number(CustomerId) },
        dataType: "json",
        success: function (result) {
            DataBindCustomer('#SetCustomerList');
            closeModal('frmModalDelete');
        },
        error: function() {
            $("#cmdDeleteCustomer").notify("کد مورد نظر در سایر اطلاعات گردش دارد حذف امکانپذیز نمی باشد", "error");
        }

    });
}

function applyFilter() {
    var condition = false;
    var strSql = "SELECT * FROM tblCustomer WHERE ";

    var ln = $('#txtFilterLName').val();
    var mob = $('#txtFilterMobile').val();

    if (ln !== "") {
        strSql += "customerLName LIKE N'%" + ln + "%' AND ";
        condition = true;
    }
    if (mob !== "") {
        strSql += "customerMobile LIKE '" + mob + "%' AND ";
        condition = true;
    }
    
    if (condition) {
        strSql = strSql.substring(strSql.length - 4, 0);
        
        $.ajax({
            type: "GET",
            url: "/customer/ApplyFilter",
            data: { 'strSql': strSql },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetCustomerList');
                var strText = "";

                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].customerId +
                        "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 25px'>" +
                        data[i].customerId +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].customerFName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].customerLName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        Null2Empty(data[i].customerMobile) +
                        "</td>" +
                        "<td>" +
                        Null2Empty(data[i].customerPhone) +
                        "</td>" +
                        "<td style='width: 200px'>" +
                        Null2Empty(data[i].customerAddress) +
                        "</td>" +
                        "<td style='width: 100px'>" +
                        Null2Empty(data[i].customerCompany) +
                        "</td>" +
                        "</tr>";
                }
                $("#LoadingStatus").html(" ");
                $(setData).html(strText);

            }
        });
    }

}

function clearFilter() {
    DataBindCustomer('#SetCustomerList');

    $("#txtFilterLName").val("");
    $("#txtFilterMobile").val("");
}

$(document).mouseup(function (e) {
    var container = $("#frmModalGetData1");

    // If the target of the click isn't the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});


$(document).ready(function () {
    CheckUserSession();
    $('#divTableCustomer').hide();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();

    DataBindCustomer('#SetCustomerList');
});

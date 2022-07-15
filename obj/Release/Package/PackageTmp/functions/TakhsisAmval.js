
//fetch all product details list
function DataBindFindProduct(t) {
    $('#divFactor').show();
    $("#LoadingStatusProductDetails").html("در حال بارگذاری...");

    $.ajax({
        type: "Get",
        url: '/productDetails/GetProductDetailsList',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var setData = $(t);
            var strText = "";

            for (var i = 0; i < data.length; i++) {
                strText += "<tr class='row_" +
                    data[i].pdId +
                    "' data-id='" + data[i].pdId + "'>" +
                    "<td style='width: 5%'>" + (i + 1) + "</td>" +
                    "<td style='width: 10%' data-pid='" + data[i].productId + "'>" +
                    data[i].productName +
                    "</td>" +
                    "<td style='width: 5%'>" +
                    data[i].productGroupName +
                    "</td>" +
                    "<td style='width: 10%' data-brand='" + data[i].pBrand + "'>" +
                    Null2Empty(data[i].brandName) +
                    "</td>" +
                    "<td style='width: 5%' data-material='" + data[i].pMaterial + "'>" +
                    Null2Empty(data[i].materialName) +
                    "</td>" +
                    "<td style='width: 5%' data-color='" + data[i].pColor + "'>" +
                    Null2Empty(data[i].colorName) +
                    "</td>" +
                    "<td style='width: 5%' data-size='" + data[i].pSize + "'>" +
                    Null2Empty(data[i].sizeName) +
                    "</td>" +
                    "<td style='width: 5%' data-gender='" + data[i].pGender + "'>" +
                    Null2Empty(data[i].genderName) +
                    "</td>" +
                    "<td style='width: 5%' data-country='" + data[i].pCountry + "'>" +
                    Null2Empty(data[i].countryName) +
                    "</td>" +
                    "<td style='width: 10%' >" + Null2Empty(data[i].pDescription )+
                 
                    "</tr>";
            }


            $("#LoadingStatusProductDetails").html(" ");
            $(setData).html(strText);
        }

    });
}

$(document).delegate("#txtAmvalNumber", "keyup", function (e) {
    
    if (isNaN($(this).val())) {
        $(this).notify("عدد وارد شود", { autoHideDelay: 1000});
    }
});

$(document).delegate("#txtAmvalNumber", "focusout", function () {
    if ($("#txtAmvalNumber").val() !== "") {
        $("#lblCheckAmval").trigger("click");
    }

});

$(document).delegate("#txtAmvalFindProducts", "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblAmvalFindpdID").html("0000");
    var strFind = $('#txtAmvalFindProducts').val();
    
    if (strFind.length !== 0) {
        $("#tPDFilter").css("visibility", "visible");

       $.ajax({
            type: "GET",
           url: "/productDetails/ProductSearchFilter",
            data: { 'str': strFind },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetProductDetailsList');
                var strText = "";
                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].pdId +
                        "' data-id='" + data[i].pdId + "'>" +
                        "<td style='width: 5%'>" + (i + 1) + "</td>" +
                        "<td style='width: 80%'>" +
                        data[i].productNameX +
                        "</td>" +
                        "</tr>";
                }
                $("#LoadingStatusProductDetails").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tPDFilter").css("visibility", "collapse");
        $("#lblAmvalFindpdID").html("0000");
    }

    
});

$(document).delegate("#txtAmvalCustomer", "keyup", function (e) {
    if (e.keyCode==13 || e.keyCode==27){return}
    $("#lblAmvalCustomerId").html("0000");
    var strFind = $('#txtAmvalCustomer').val();
    var strSql = "SELECT * FROM tblCustomer WHERE ";

    if (strFind.length !== 0) {
        $("#tCustomerFilter").css("visibility", "visible");

        strSql += "CustomerLName LIKE N'%" + strFind + "%' ";

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
                        "' data-id='" + data[i].customerId + "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
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
                        "</tr>";
                    
                }
                
                $("#LoadingStatusCustomer").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#lblAmvalCustomerId").html("0000");
    }


});

$(document).delegate("#txtFindCustomer", "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    
    $("#lblFindCusIdGardesh").html("0000");
    var strFind = $('#txtFindCustomer').val();
    var strSql = "SELECT * FROM tblCustomer WHERE ";
    var position = $('#txtFindCustomer').position();
    if (strFind.length !== 0) {
        
        $("#tCustomerFilterGardesh").css("visibility", "visible");
        

        strSql += "CustomerLName LIKE N'%" + strFind + "%' ";

        $.ajax({
            type: "GET",
            url: "/customer/ApplyFilter",
            data: { 'strSql': strSql },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetCustomerListGardesh');
                var strText = "";
                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].customerId +
                        "' data-id='" + data[i].customerId + "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
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
                        "</tr>";

                }

                $("#LoadingStatusCustomerGardesh").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tCustomerFilterGardesh").css("visibility", "collapse");
        $("#lblAmvalCustomerId").html("0000");
    }
});

$(document).delegate("input", "keypress", function (e) {
    /* ENTER PRESSED*/
    if (e.keyCode == 13) {
        /* FOCUS ELEMENT */
        var inputs = $(this).parents("div").eq(0).find(":input:text");
        var idx = inputs.index(this);
        
        if (idx === inputs.length - 1 ) {
            inputs[0].focus();
        } else {
            inputs[idx + 1].focus(); //  handles submit buttons
            inputs[idx + 1].select();
        }
        return false;
    }
});

$(document).delegate("#cmdFindGardesh", "click", function () {
    var amn = $("#txtFindAmvalNumber").val();
    var cusn = $("#txtFindCustomer").val();
    var cusid = $("#lblFindCusIdGardesh").text();

    if (amn === "" && cusn === "") {
        $("#cmdFindGardesh").notify(" یکی از موارد جستجو باید کامل شود", "warn");
        return;
    }
    if (amn !== "" && cusn !== "") {
        $("#cmdFindGardesh").notify(" دریک زمان امکان انتخاب یک مورد جستجو وجود دارد", "warn");
        return;
    }

    var searchType = -1, para = null;
    var header = "";

    if (amn !== "") {//find gardesh amval
        searchType = 1;
        para = amn;
        header = "<tr> <th>ردیف</th><th>شماره اموال</th>";
        header += "<th>نام کالا</th><th>نام شخص</th>";
        header += "<th>توضیحات </th><th>تاریخ</th>";
        header += "<th>وضعیت کنونی</th>" ;
        header += "<th>وضعیت اسقاط</th>" + "</tr>";
    };

    if (cusn !== "") {//find customer's amval
        searchType = 2;
        para = cusid;
        header = "<tr> <th>ردیف</th><th>نام شخص</th>";
        header += "<th>شماره اموال</th><th>نام کالا</th>";
        header += "<th>توضیحات </th><th>تاریخ</th>" + "</tr>";
    };
    //
    $.ajax({
        type: "GET",
        url: "/takhsisAmval/GetGardeshAmvalCustomer",
        data: { 'searchType': searchType , 'para':para},
        dataType: "json",
        success: function (data) {
            $("#thListGardesh").html(header);
            var strText = "";
            var dt = "";
            for (var i = 0; i < data.length; i++) {
                var newValue = data[i].myDate.split('-');
                dt = Miladi2Farsi(Number(newValue[0]), Number(newValue[1]), Number(newValue[2]));
                dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                if (searchType === 1) {
                    strText += "<tr>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].amval +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].productNameX +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].customerFName +
                        " " +
                        data[i].customerLName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].description +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        dt +
                        "</td>" +
                        "<td style='width: 90px'>" +
                        (data[i].active===true?"تحویل":"") +
                        "</td>" +
                        "<td style='width: 90px'>" +
                        (data[i].esghat === true ? "بله" : "") +
                        "</td>" +
                        "</tr>";
                } else {
                    strText += "<tr>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].customerFName +
                        " " +
                        data[i].customerLName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].amval +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].productNameX +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].description +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        dt+
                        "</td>" +
                        "</tr>";

                }
            }
            $("#SetListGardesh").html(strText);
        }
    });

});

$(document).delegate("#cmdClearGardesh", "click", function () {
    $("#txtFindCustomer").val("");
    $("#lblFindCusIdGardesh").text("0000");
    $("#txtFindAmvalNumber").val("");
    $("#txtFindAmvalNumber").focus();
    $("#SetListGardesh").html("");
});

$(document).delegate("#cmdSaveAmval", "click", function(e) {

    if (sessionStorage.getItem('user_id') === null) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' اعتبار کاربری شما به اتمام رسیده است لطفا مجددا وارد شود',
            type: 'red',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }
    if ($("#selAction").val() === "3" && $("#lblMessage").data('id') === "1937") {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: 'اموال مورد نظر هم اکنون در انبار می باشد و شامل عملیات تسویه نمی شود',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }
    
    if (checkEmpty($("#txtAmvalCustomer")) || $("#lblAmvalCustomerId").text() === "0000") {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' نام مشتری یا خریدار کامل شود',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        $("#txtAmvalCustomer").focus();
        return;
    }
    if (checkEmpty($("#txtAmvalFindProducts")) || $("#lblAmvalFindpdID").text() === "0000") {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' کالایی انتخاب نشده است',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        $("#txtAmvalFindProducts").focus();
        return;
    }
    if (!CheckFarsiValidDate($('#txtSabtAmvalDate').val())) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' اشکال در ورود تاریخ',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        $('#txtSabtAmvalDate').focus();
        return;
    };
    if (checkEmpty($("#txtAmvalDesc"))) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' موردی را بعنوان توضیحات ثبت نمایید',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }
    if ($('#txtAmvalNumber').val().length !== 5) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' شماره اموال صحیح نمی باشد',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }
    
    if ($("#selAction").val() === "2" && $("#lblAmvalCustomerId").text() === "1937") {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: ' نام کاربر انبار انتخاب شده است آیا این مورد شامل تسویه می باشد؟',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }
    /////
    var d = [];
    d[0] = $('#lblAmvalCustomerId').text();
    d[1] = $('#lblAmvalFindpdID').text();
    d[2] = $('#txtAmvalNumber').val();
    var newVal = $('#txtSabtAmvalDate').val().split('/');
    var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d[3] = x[0] + "/" + x[1] + "/" + x[2];
    d[4] = "True"; //active
    d[5] = "False"; //esghat
    d[6] = $('#txtAmvalDesc').val();
    d[7] = sessionStorage.getItem('user_id') === null ? 2 : sessionStorage.getItem('user_id');
    d[8] = $("#selAction").val();
    $.ajax({
        type: "POST",
        url: "/takhsisAmval/SaveAmval",
        data: { 'd': d },
        dataType: "json",
        success: function(result) {
            if (result) {
                $("#txtAmvalNumber").notify("ثبت موفق", "success");
                $("#txtAmvalCustomer").focus();
                $("#txtAmvalCustomer").val("");
                $("#lblAmvalCustomerId").html("0000");
                $("#txtAmvalFindProducts").val("");
                $("#lblAmvalFindpdID").html("0000");
                $("#txtAmvalNumber").val("");
                $("#lblMessage").html("پیام");
                $("#lblMessage").hide();
                $("#txtAmvalDesc").val("");
            } else {
                $("#txtAmvalNumber").notify("این شماره اموال قبلا اسقاط شده است و یا اینکه به کالای دیگری تعلق دارد");
                $("#txtAmvalNumber").focus();
                $("#txtAmvalNumber").select();
            }
        },
        error: function() {
            $("#txtAmvalNumber").notify("این شماره اموال ثبت نشده است ابتدا باید به کالایی تخصیص داده شود");
            $("#txtAmvalNumber").focus();
            $("#txtAmvalNumber").select();
        }
    });
});

$(document).delegate("#txtAmvalNumber", "keyup", function() {
    $("#lblMessage").text("پیام");
    $("#lblMessage").hide();
    $("#txtAmvalFindProducts").val("");
    $("#lblAmvalFindpdID").text("0000");
});

$(document).delegate("#lblCheckAmval", "click", function(e) {
    var n = $("#txtAmvalNumber").val();
    if (n.length !== 5) {
        $("#txtAmvalNumber").notify("اموال وارد شده صحیح نمی باشد", "warn");
        return;
    };
    if (!isNaN(n)) {
        $.ajax({
            type: "POST",
            url: "/takhsisAmval/GetAmvalProduct",
            data: { 'n': n },
            dataType: "json",
            success: function (data) {
                if (data !== null) {
                    $("#txtAmvalFindProducts").val(data.productNameX);
                    $("#lblAmvalFindpdID").text(data.pdId);
                    $("#txtAmvalCustomer").focus();
                    $.ajax({
                        type: "GET",
                        url: "/takhsisAmval/GetAmvalCustomer",
                        data: { 'n': n },
                        dataType: "json",
                        success: function (data) {
                            if (data.length > 0) {
                                if (data[0].esghat) {
                                    $('#lblMessage').text("این شماره اموال اسقاط شده است");
                                } else {
                                    var x = data[0].customerFName + " " + data[0].customerLName;
                                    var y = data[0].productName;
                                    $('#lblMessage').text("این شماره اموال متعلق به " + x + " و کالای " + y + " می باشد");
                                }
                                $('#lblMessage').show();
                            } else {
                                $('#lblMessage').text("شماره اموال بااین مشخصات تخصیص داده نشده است");
                                $('#lblMessage').show();
                            };
                            $('#lblMessage').data('id', data[0].customerId);
                        }
                    });
                } 
            },
            error: function() {
              $("#txtAmvalFindProducts").val("");
               $("#lblAmvalFindpdID").text("0000");
               $('#lblMessage').show();
               $('#lblMessage').text("این شماره اموال تعریف نشده است و باید به کالایی اختصاص یابد");
            }
        });

    } else {
        $("#txtAmvalNumber").notify("اموال وارد شده صحیح نمی باشد", "warn");
    }
});

$(document).delegate("#selAction", "change", function() {

    if ($("#selAction").val() === "3") {
        $('#txtAmvalCustomer').val("انبار انبار مبین");
        $('#lblAmvalCustomerId').text("1937");
        $('#txtAmvalDesc').val("تسویه و برگشت به انبار");
    } else {
        $('#txtAmvalCustomer').val("");
        $('#lblAmvalCustomerId').text("0000");
    }
});
$(document).on("dblclick", "#tPDFilter tbody ",
    function () {
        
        var pname = $('.rowSelected').find('td').eq(1).text();
        var pdid = $('.rowSelected').data('id');

        $("#txtAmvalFindProducts").val(pname);
        $("#lblAmvalFindpdID").text(pdid);
        $("#tPDFilter").css("visibility", "collapse");
        $("#txtAmvalFindProducts").select();
    });

$(document).on("dblclick", "#tCustomerFilter tbody",
    function () {
        var fname = $('.rowSelected').find('td').eq(1).text();
        var lname = $('.rowSelected').find('td').eq(2).text();
        var cusId = $('.rowSelected').data('id');
        
        $("#txtAmvalCustomer").val(fname + " " + lname );
        $("#lblAmvalCustomerId").text(cusId);
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#txtAmvalCustomer").select();
    });

$(document).on("dblclick", "#tCustomerFilterGardesh tbody",
    function () {
        var fname = $('.rowSelected').find('td').eq(1).text();
        var lname = $('.rowSelected').find('td').eq(2).text();
        var cusId = $('.rowSelected').data('id');

        $("#txtFindCustomer").val(fname + " " + lname);
        $("#lblFindCusIdGardesh").text(cusId);
        $("#tCustomerFilterGardesh").css("visibility", "collapse");
        $("#txtFindCustomer").select();
    });

$(document).ready(function () {
    CheckUserSession();
    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
    $('#lblMessage').hide();
    
    var uname = sessionStorage.getItem('user_name');
    $.notify(uname + " خوش آمدید ", { className: 'success', position: "top,center" });

    var today = GetCurrentShamsiDate();
    $('#txtSabtAmvalDate').val(today);
    
    $('#txtUserName').val(uname);
    
    $('#txtAmvalCustomer').focus();
    
});

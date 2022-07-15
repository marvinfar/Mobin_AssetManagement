
//fetch all product details list
function DataBindFindProduct(t) {
    $('#divEsghat').show();
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

$(document).delegate("#txtEsghatAmvalNumber", "keyup", function (e) {
    $("#lblEsghatMessage").html("پیام");
    $("#lblEsghatMessage").hide();
    $("#txtEsghatAmvalCustomer").val("");
    $("#lblEsghatAmvalCustomerId").text("0000");
    $("#txtEsghatAmvalProducts").val("");
    $("#lblEsghatAmvalFindpdID").text("0000");
    $('#cmdSaveEsghatAmval').attr("disabled", "disabled");
    if (isNaN($(this).val())) {
        $(this).notify("عدد وارد شود", { autoHideDelay: 1000});
    }
});

$(document).delegate("#txtEsghatAmvalNumber", "focusout", function () {
    if ($("#txtEsghatAmvalNumber").val() !== "") {
        $("#cmdCheckEsghatAmval").trigger("click");
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


$(document).delegate("#cmdFindEsghatAmval", "click", function () {
    var amn = $("#txtFindEsghatAmvalNumber").val();
    var d1 = $("#txtFindEsghatDate1").val();
    var d2 = $("#txtFindEsghatDate2").val();

    if (amn === "" && d1 === "") {
        $("#cmdFindEsghatAmval").notify(" یکی از موارد جستجو باید کامل شود", "warn");
        return;
    }
    if (d2 === "" && d1 !== "") {
        $("#txtFindEsghatDate2").val(d1);
        d2 = d1;
    }

    if (d1 + d2 !== "") {
        if (!CheckFarsiValidDate(d1) || !CheckFarsiValidDate(d2)) {
            $("#cmdFindEsghatAmval").notify(" تاریخ جستجو باید صحیح باشد", "warn");
            return;
        }
    }
    if (FarsiDateDiff(d1, d2) < 0) {
        $("#cmdFindEsghatAmval").notify(" تاریخ دوم نباید کمتر از تاریخ اول باشد", "warn");
        return;
    }
    if (d1 + d2 !== "") {
        var newVal1 = d1.split('/'), newVal2 = d2.split('/');
         d1 = Farsi2Miladi(Number(newVal1[0]), Number(newVal1[1]), Number(newVal1[2]));
         d2 = Farsi2Miladi(Number(newVal2[0]), Number(newVal2[1]), Number(newVal2[2]));
        d1 = d1[0] + "-" + d1[1] + "-" + d1[2];
        d2 = d2[0] + "-" + d2[1] + "-" + d2[2];
    }
    var para = [];
    para[0] = amn;
    para[1] = d1;
    para[2] = d2;
    //
    $.ajax({
        type: "POST",
        url: "/esghatAmval/GetEsghatAmvalList",
        data: { 'para': para },
        dataType: "json",
        success: function (data) {
            var strText = "";
            var dt = "";
            for (var i = 0; i < data.length; i++) {
                var newValue = data[i].myDate.split('-');
                dt = Miladi2Farsi(Number(newValue[0]), Number(newValue[1]), Number(newValue[2]));
                dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                strText += "<tr>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].amval +
                    "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].CustomerName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].ProductName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        Null2Empty(dt) +
                        "</td>" +
                        "<td style='width: 250px'>" +
                        Null2Empty(data[i].esghatDescription) +
                        "</td>" + "</tr>";
            }
            $("#SetListEsghat").html(strText);
        }
    });

});

$(document).delegate("#cmdClearFindEsghatamval", "click", function () {
    $("#txtFindEsghatAmvalNumber").val("");
    $("#txtFindEsghatDate1").val("");
    $("#txtFindEsghatDate2").val("");
    $("#txtFindEsghatAmvalNumber").focus();
    $("#SetListEsghat").html("");
});

$(document).delegate("#cmdClearEsghatDate", "click", function () {
    $("#txtFindEsghatDate1").val("");
    $("#txtFindEsghatDate2").val("");
});

$(document).delegate("#cmdTodayEsghatDate", "click", function () {
    var today = GetCurrentShamsiDate();
    $('#txtFindEsghatDate1').val(today);
    $('#txtFindEsghatDate2').val(today);
});

$(document).delegate("#cmdSaveEsghatAmval", "click", function (e) {
    if (sessionStorage.getItem('user_id') === null) {
        alert("اعتبار کاربری شما به اتمام رسیده است لطفا مجددا وارد شود");
        return;
    }
    
    if (checkEmpty($("#txtAmvalCustomer")) || $("#lblAmvalCustomerId").text() === "0000") {
        $("#cmdCheckEsghatAmval").notify("شماره اموال را وارد نموده و برروی دکمه چک کلیک کنید", "warn");
        $("#txtEsghatAmvalNumber").focus();
        return;
    }
    if (checkEmpty($("#txtAmvalFindProducts")) || $("#lblAmvalFindpdID").text() === "0000") {
        $("#cmdCheckEsghatAmval").notify("شماره اموال را وارد نموده و برروی دکمه چک کلیک کنید", "warn");
        $("#txtEsghatAmvalNumber").focus();
        return;
    }
    if (!CheckFarsiValidDate($('#txtEsghatAmvalDate').val())) {
        $('#txtEsghatAmvalDate').notify("اشکال در ورود تاریخ", "warn");
        return;
    };
    if (checkEmpty($("#txtEsghatAmvalDesc"))) {
        $('#txtEsghatAmvalDesc').notify("موردی را بعنوان توضیحات ثبت نمایید", "warn");
        return;
    }
    if ($('#txtEsghatAmvalNumber').val().length !== 5) {
        $('#txtEsghatAmvalNumber').notify("شماره اموال صحیح نمی باشد", "warn");
        return;
    }
    /////
    var d = [];
    d[0] = $("#lblRadifTakhsis").text();//ردیف اموالی که در جدول تخصیص پیدا شده است و باید اکتیو آن فالس و اسقاط آن ترو شود و رکورد جدیدی به ازای آن ثبت گردد تا مشخص شود چرا اسقاط شده است و در اختیار چ کسی بوده که ساقاط شده است
    d[1] = $('#txtEsghatAmvalNumber').val();
    d[2] = $('#lblEsghatAmvalCustomerId').text();
    d[3] = $('#lblEsghatAmvalFindpdID').text();
    
    var newVal = $('#txtEsghatAmvalDate').val().split('/');
    var x = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d[4] = x[0] + "/" + x[1] + "/" + x[2];
    d[5] = $('#txtEsghatAmvalDesc').val();
    d[6] = sessionStorage.getItem('user_id');

    $.ajax({
        type: "POST",
        url: "/esghatAmval/SaveEsghatAmval",
        data: { 'd': d },
        dataType: "json",
        success: function(result) {
            $("#txtEsghatAmvalNumber").notify("ثبت موفق","success");
            $("#txtEsghatAmvalNumber").focus();
            $("#txtEsghatAmvalNumber").val("");
            $("#txtEsghatAmvalCustomer").val("");
            $("#lblEsghatAmvalCustomerId").html("0000");
            $("#txtEsghatAmvalProducts").val("");
            $("#lblEsghatAmvalFindpdID").html("0000");
            $("#lblEsghatMessage").html("پیام");
            $("#lblEsghatMessage").hide();
            $("#txtEsghatAmvalDate").val("");
            $("#lblRadifTakhsis").text("XXXX");
            $("#cmdSaveEsghatAmval").atrr('disabled','disabled');
        }
    });
});

$(document).delegate("#cmdCheckEsghatAmval", "click", function (e) {
    
    var n = $("#txtEsghatAmvalNumber").val();
    if (n.length !== 5) {
        $("#txtEsghatAmvalNumber").notify("شماره اموال وارد شده صحیح نمی باشد", "warn");
        return;
    };
    if (!isNaN(n)) {
        $.ajax({
            type: "GET",
            url: "/esghatAmval/CheckAmvalInEsghat",
            data: { 'n': n },
            dataType: "json",
            success: function (data) {
                if (data) {
                    // true = already esghat
                    $('#lblEsghatMessage').text("این شماره اموال اسقاط شده است");
                    $("#lblEsghatMessage").show();
                } else {//bayad check shavad aya be kasi taalogh darad?
                    $.ajax({
                        type: "GET",
                        url: "/esghatAmval/CheckAmvalInTakhsis",
                        data: { 'n': n },
                        dataType: "json",
                        success: function (result) {
                            if (result != null) {
                                var x = result.customerFName + " " + result.customerLName;
                                var y = result.productName;
                                $('#lblEsghatMessage')
                                    .text("این شماره اموال متعلق به " + x + " و کالای " + y + " می باشد");
                                $("#txtEsghatAmvalCustomer").val(x);
                                $("#lblEsghatAmvalCustomerId").text(result.customerId);
                                $("#txtEsghatAmvalProducts").val(y);
                                $("#lblEsghatAmvalFindpdID").text(result.pdId);
                                $("#lblRadifTakhsis").text(result.radif);
                                $('#cmdSaveEsghatAmval').removeAttr('disabled');
                                $("#txtEsghatAmvalDesc").focus();
                            }
                        },
                        error: function (ajaxContext) {
                            $('#lblEsghatMessage')
                                .text("این شماره اموال تخصیص نیافته است و تا قبل از تخصیص قابل اسقاط نمی باشد ");
                        }
                    });
                    $('#lblEsghatMessage').show();
                };
            }
        });

    } else {
        $("#txtEsghatAmvalNumber").notify("شماره اموال وارد شده صحیح نمی باشد", "warn");
    }
});

$(document).on("dblclick", "#tPDFilter tbody ",
    function () {
        
        var pname = $('.rowSelected').find('td').eq(1).text();
        var pbrand = $('.rowSelected').find('td').eq(3).text();
        var pmat = $('.rowSelected').find('td').eq(4).text();
        var pcolor = $('.rowSelected').find('td').eq(5).text();
        var psize = $('.rowSelected').find('td').eq(6).text();
        var pDesc = $('.rowSelected').find('td').eq(9).text();
        var pdid = $('.rowSelected').data('id');

        $("#txtEsghatAmvalProducts").val(pname + " " + pbrand + " " + pcolor+" "+pmat+" "+psize+" " +pDesc);
        $("#lblEsghatAmvalFindpdID").text(pdid);
        $("#tPDFilter").css("visibility", "collapse");
        $("#txtEsghatAmvalProducts").select();
    });

$(document).on("dblclick", "#tCustomerFilter tbody",
    function () {
        var fname = $('.rowSelected').find('td').eq(1).text();
        var lname = $('.rowSelected').find('td').eq(2).text();
        var cusId = $('.rowSelected').data('id');
        
        $("#txtEsghatAmvalCustomer").val(fname + " " + lname );
        $("#lblEsghatAmvalCustomerId").text(cusId);
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#txtEsghatAmvalCustomer").select();
    });

$(document).ready(function () {
    CheckUserSession();

    $('#frmModalDelete').hide();
    $('#frmModalGetData1').hide();
    $('#lblEsghatMessage').hide();
    
    var uname = sessionStorage.getItem('user_name');
    $.notify(uname + " خوش آمدید ", { className: 'success', position: "top,center" });

    var today = GetCurrentShamsiDate();
    $('#txtEsghatAmvalDate').val(today);
    $('#txtFindEsghatDate1').val(today);
    $('#txtFindEsghatDate2').val(today);
    
    $('#txtUserName').val(uname);
    
    $('#txtEsghatAmvalNumber').focus();
    $('#cmdSaveEsghatAmval').attr("disabled", "disabled");

    $("#lblRadifTakhsis").text("XXXX");
    $("#lblRadifTakhsis").hide();
});

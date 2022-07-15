$(document).delegate('input', 'change', function (e) {
    var count = 0, subName = "";
    
    count = $("#divUpRepAmval input:radio").length;
    
    if ($(this).is(':radio')) {
        
        for (var i = 1; i<=count; i++) {
            if ($(this).val() === i.toString()) {
                $(".RepAm" + i.toString()).removeAttr('disabled');
            } else {
                $(".RepAm"  + i.toString() ).prop('disabled', 'disabled');
            }
        }
    }
    
    if ($("#rdb1").is(":checked")) {
        if ($("#chkAmvalListAll").is(":checked")) {
            $("#selRepAmvalFilterAny").prop('disabled', false);
            $("#txtAmvalFindReport1").prop('disabled', false);
        } else {
            $("#selRepAmvalFilterAny").prop('disabled', 'disabled');
            $("#txtAmvalFindReport1").prop('disabled', 'disabled');
        }
    }
});

function CheckAndGetDate() {
    var d1, d2, newVal = null;
    d1 = $('#txtRepAmvalDate1').val();
    d2 = $('#txtRepAmvalDate2').val();

    if (d2 === "" && d1 !== "") {
        $("#txtRepAmvalDate2").val(d1);
        d2 = d1;
    }

    if (!CheckFarsiValidDate(d1) || !CheckFarsiValidDate(d2)) {
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: 'تاریخ جستجو باید صحیح باشد',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }

    if (FarsiDateDiff(d1, d2) < 0) {
        $("#txtRepAmvalDate1").notify(" تاریخ دوم نباید کمتر از تاریخ اول باشد", "warn");
        $.alert({
            title: 'توجه',
            escapeKey: true,
            backgroundDismiss: true,
            content: 'تاریخ دوم نباید کمتر از تاریخ اول باشد',
            type: 'orange',
            boxWidth: '15%',
            useBootstrap: false
        });
        return;
    }
    newVal = $('#txtRepAmvalDate1').val().split('/');
    d1 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d1 = d1[0] + '-' + d1[1] + '-' + d1[2];
    newVal = $('#txtRepAmvalDate2').val().split('/');
    d2 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
    d2 = d2[0] + '-' + d2[1] + '-' + d2[2];

    return [d1, d2];
}

function RepAllAmvalWithCondition() {
    //Report 1
    var d = [];
    var valSelect = $("#selRepAmvalFilterAny").val();
    
    if ($("#chkAmvalListAll").is(':checked')) { // if conditions are deal!
        d[0] = valSelect;
        d[1] = $("#txtAmvalFindReport1").val();
        if (valSelect === "1") { //search by Amval
            if ($("#txtAmvalFindReport1").val() === "" ) {
                $.alert({
                    title: 'توجه',
                    escapeKey: true,
                    backgroundDismiss: true,
                    content: 'اموال وارد شده صحیح نمی باشد',
                    type: 'orange',
                    boxWidth: '15%',
                    useBootstrap: false
                });
                return;
            }
        }
        if (Number(valSelect) >= 2 && Number(valSelect) <= 4) { //Search by other item
            if ($("#txtAmvalFindReport1").val() === "") {
                $.alert({
                    title: 'توجه',
                    escapeKey: true,
                    backgroundDismiss: true,
                    content: 'مقداری جهت جستجو وارد نشده است',
                    type: 'orange',
                    boxWidth: '15%',
                    useBootstrap: false
                });
                return;
            }
        }
        if (valSelect === "5") { //Search by Date
            var x = CheckAndGetDate();
            d[1] = x[0];
            d[2] = x[1];
        }
    }
    var header = "<tr><th>ردیف</th><th>شماره اموال</th><th> نام کالا</th>";
    header += "<th>تاریخ خرید</th><th>قیمت خرید</th><th>شماره SAP</th>";
    header += "<th>سریال </th><th>بارکد </th><th style='width: 250px'>توضیحات</th></tr>";
        
    $.ajax({
        type: "POST",
        url: "/defAmvalProduct/GetAmvalList",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#SetRepListAmval").html("");
            $("#thRepListAmval").html(header);
            
            var strText = "";
            var dt = "";
            for (var i = 0; i < data.length; i++) {
                if (data[i].myDate !== null) {
                    var newValue = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(newValue[0]), Number(newValue[1]), Number(newValue[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                } else {
                    dt = "";
                }

                strText = "<tr data-id='" + data[i].pdId + "'>" +
                    "<td style='width: 15px'>" +
                    (i + 1) +
                    "</td>" +
                    "<td style='width: 50px'>" +
                    data[i].amval +
                    "</td>" +
                    "<td style='width: 350px'>" +
                    data[i].productNameX +
                    "</td>" +
                    "<td style='width: 50px'>" +
                    Null2Empty(dt) +
                    "</td>" +
                    "<td style='width: 60px'>" + CurrencyFormat(Null2Empty(data[i].buyPrice)) +
                    "</td>" +
                    "<td style='width: 60px'>" +
                    Null2Empty(data[i].sapPR) +
                    "</td>" +
                    "<td style='width: 60px'>" +
                    Null2Empty(data[i].serialNumeber) +
                    "</td>" +
                    "<td style='width: 60px'>" +
                    Null2Empty(data[i].barcodeNumber) +
                    "</td>" +
                    "<td style='width: 250px'>" +
                    Null2Empty(data[i].description) +
                    "</td>" +
                    "</tr>";
                $("#SetRepListAmval").append(strText);
            }

        }
    });

}

function RepAllEsghatWithDate() {
    var para = [];
    if ($("#chkAmvalEsghatList").is(':checked')) {
        var x = CheckAndGetDate();
        para[0] = "";
        para[1] = x[0];
        para[2] = x[1];
    } else {
        para[0] = "", para[1] = "", para[2] = "";
    }
    var header = "<tr><th>ردیف</th><th>شماره اموال</th><th> نام شخص/کاربر</th>";
        header += "<th> نام کالای اسقاطی</th>";
        header += "<th>تاریخ اسقاط</th><th>شرح اسقاط</th>";
    
    $.ajax({
        type: "POST",
        url: "/esghatAmval/GetEsghatAmvalList",
        data: { 'para': para },
        dataType: "json",
        success: function (data) {
            $("#SetRepListAmval").html("");
            $("#thRepListAmval").html(header);

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
            $("#SetRepListAmval").html(strText);
        }
    });
}

function RepAllServicesWithDate() {
    var para = [];
    para[0] = Number($("#lblServiceVendorId").html());
    if ($("#chkAmvalServiceList").is(':checked')) {
        var x = CheckAndGetDate();
        para[1] = x[0];
        para[2] = x[1];
    } else {
         para[1] = "", para[2] = "";
    }
    
    var header = "<tr><th colspan='6'>لیست سرویسهای انجام شده</th></tr>";
    
    $.ajax({
        type: "Post",
        url: "/rep/RepServices",
        data: { 'para': para },
        dataType: "json",
        success: function(data) {
            $("#SetRepListAmval").html("");
            $("#thRepListAmval").html(header);
            if (data.length > 0) {
                var strMergeRow = "", strData = "", r = 0, dt = "";
                var serId = data[0].serviceId;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].serviceId === serId) {
                        r += 1;
                        dt = data[i].myDate.split('-');
                        dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                        dt = dt[0] + "/" + dt[1] + "/" + dt[2];

                        strMergeRow = "<tr style='background-color:cyan'><td colspan='6'>" +
                            "سرویس انجام شده در تاریخ " +
                            dt +
                            " توسط " +
                            data[i].companyName +
                            " " +
                            Null2Empty(data[i].vendorName) +
                            " هزینه کل " +
                            Null2Empty(CurrencyFormat(data[i].serviceTotalPrice)) +
                            "</td></tr>";

                        strMergeRow +=
                            "<tr style='background-color:grey'><td style='width:10px'>ردیف</td><td>نام کالا</td><td>اموال</td><td>درخواست دهنده</td><td>هزینه مورد</td><td>شرح سرویس انجام شده</td>";

                        strData += "<tr style='background-color:white'><td style='width:10px'>" + r + "</td>";
                        strData += "<td>" + data[i].productNameX + "</td>";
                        strData += "<td>" + data[i].amval + "</td>";
                        strData += "<td>" + data[i].customerFName + " " + data[i].customerLName + "</td>";
                        strData += "<td>" + CurrencyFormat(Null2Empty(data[i].servicePrice)) + "</td>";
                        strData += "<td>" +
                            Null2Empty(data[i].serviceDescription) +
                            " " +
                            Null2Empty(data[i].serviceDetailDesc) +
                            "</td>";
                    } else {
                        $("#SetRepListAmval").append(strMergeRow + strData);
                            strMergeRow = "", strData = "", r = 0;
                            serId = data[i].serviceId;
                            i = i - 1;
                    }
                }
                $("#SetRepListAmval").append(strMergeRow + strData);
            }
        }

    });
}

function RepAmvalAssignToUser() {
    var para = [];
    if ($("#lblCustomerId").html() === "0000") {
        if ($("#chkAmvalAllAssigned").is(':checked')) {
            para[1] = 2; //all Customer all records
        } else {
            para[1] = 3; //all customer but already assigned
        }
    } else {
        if ($("#chkAmvalAllAssigned").is(':checked')) {
            para[1] = 1; //selected Customer
        } else {
            para[1] = 0;//selected customer and already assigned
        }
    }
    para[0] = $("#lblCustomerId").html();
    
    var header = "<tr><th style='width:10px'>ردیف</th><th>نام کاربر</th>";
    header += "<th style='width:80px'>شماره اموال</th><th>نام کالا</th>";
    header += "<th style='width:80px'>تاریخ</th><th style='width:20px'>تحویل؟</th><th style='width:20px'>اسقاط؟</th>";
    header += "<th style='width:350px'>توضیحات</th></tr>";

    $.ajax({
        type: "Post",
        url: "/rep/RepAmvalAssignToUser",
        data: { 'para': para },
        dataType: "json",
        success: function(data) {
            $("#SetRepListAmval").html("");
            $("#thRepListAmval").html(header);
            var dt = null, strData = "";
            for (var i = 0; i < data.length; i++) {
                dt = data[i].myDate.split('-');
                dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                dt = dt[0] + "/" + dt[1] + "/" + dt[2];

                strData = "<tr><td style='width:10px'>" + (i + 1) + "</td>";
                strData += "<td>" + data[i].CustomerName + "</td>";
                strData += "<td style='width:80px'>" + data[i].amval + "</td>";
                strData += "<td>" + data[i].productNameX + "</td>";
                strData += "<td style='width:80px'>" + dt + "</td>" + "<td style='width:20px'>" + data[i].active + "</td>";
                strData += "<td style='width:20px'>" + data[i].esghat + "</td>";
                strData += "<td style='width:350px'>" + data[i].description + "</td></tr>";

                $("#SetRepListAmval").append(strData);
            }
            MergeTable("SetRepListAmval", 1);
        }
    });

}

function RepAmvalHistory() {
    var header = "<tr><th colspan='5'>گزارش گردش اموال </th>";
    
    var para = [];
    para[0] = $("#txtRepAmvalNumberHistory").val();
    if ($("#chkAmvalNumberHistory").is(':checked')) {
        var x = CheckAndGetDate();
        para[1] = x[0];
        para[2] = x[1];
    } else {
        para[1] = "", para[2] = "";
    }

    $.ajax({
        type: "Post",
        url: "/rep/RepGardeshAmvalHistory",
        data: { 'para': para },
        dataType: "json",
        success: function (data) {
            $("#SetRepListAmval").html("");
            $("#thRepListAmval").html(header);
            if (data.length > 0) {
                var strMergeRow = "", strData = "", r = 0, dt = "";
                var status = "";
                strMergeRow = "<tr style='background-color:cyan'><td colspan='5'>" +
                    " تاریخچه ی گردش کالای  " +
                    data[0].productNameX + " به شماره اموال " +
                    data[0].amval ;
                if ($("#chkAmvalNumberHistory").is(':checked')) {
                    strMergeRow += " در بازه زمانی " + $("#txtRepAmvalDate1").val() + " تا " + $("#txtRepAmvalDate2").val();
                }
                strMergeRow += "</td></tr>";
                strMergeRow += "<tr style='background-color:cyan'>";
                strMergeRow+="<td style='width:10px'>ردیف</td><td>نام کاربر</td>";
                strMergeRow += "<td>تاریخ</td><td style='width:250px'>توضیحات</td><td>وضعیت</td></tr>";
                for (var i = 0; i < data.length; i++) {
                    r += 1;
                    dt = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                    if (data[i].active === true) { status = "تحویل شخص" }
                    if (data[i].esghat === true) { status = "اسقاط" }
                    strData += "<tr style='background-color:white'><td style='width:10px'>" + r + "</td>";
                    strData += "<td>" + data[i].customerFName + " " + data[i].customerLName+"</td>";
                    strData += "<td>" + dt + "</td>";
                    strData += "<td style='width:250px'>" + Null2Empty(data[i].description) + "</td>";
                    strData += "<td>" + status + "</td></tr>";
                }
                $("#SetRepListAmval").html(strMergeRow + strData);
            }
        }

    });
}

function RepAmvalHistoryTafkiki() {
    var para = [];
    para[0] = "";
    para[1] = "";
    para[2] = "";
    var header = "<tr><th colspan='5'>گزارش تاریخچه گردش اموال بصورت تفکیکی</th></tr>";
    if ($("#chkRepTafkikGardeshAmval").is(':checked')) {
        var x = CheckAndGetDate();
        para[1] = x[0];
        para[2] = x[1];
        header= "<tr><th colspan='5'>گزارش تاریخچه گردش اموال بصورت تفکیکی";
        header += " در بازه زمانی " + $("#txtRepAmvalDate1").val() + " تا " + $("#txtRepAmvalDate2").val();
        header += "</th></tr>";
    }
    
    $.ajax({
        type: "Post",
        url: "/rep/RepGardeshAmvalHistory",
        data: { 'para': para },
        dataType: "json",
        success: function(data) {
            $("#SetRepListAmval").html("");
            $("#thRepListAmval").html(header);
            if (data.length > 0) {
                var strMergeRow = "", strData = "", r = 0, dt = "", status = "";
                var amval = data[0].amval;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].amval === amval) {
                        status = "";
                        r += 1;
                        dt = data[i].myDate.split('-');
                        dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                        dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                        if (data[i].active === true) { status = "تحویل شخص" }
                        if (data[i].esghat === true) { status = "اسقاط" }
                        strMergeRow = "<tr style='background-color:cyan'><td colspan='5'>" +
                            " شماره اموال : " +
                            data[i].amval +
                            " نام کالا : " +
                            data[i].productNameX +
                            "</td></tr>";

                        strMergeRow +=
                            "<tr style='background-color:grey'><td style='width:10px'>ردیف</td><td>نام کاربر</td><td>تاریخ</td><td style='width:100px'>توضبحات </td><td>وضعیت</td>";

                        strData += "<tr style='background-color:white'><td style='width:10px'>" + r + "</td>";
                        strData += "<td>" + data[i].customerFName + " " + data[i].customerLName + "</td>";
                        strData += "<td>" + dt + "</td>";
                        strData += "<td style='width:250px'>" + Null2Empty(data[i].description) + "</td>";
                        strData += "<td>" + status + "</td></tr>";
                    } else {
                        $("#SetRepListAmval").append(strMergeRow + strData);
                        strMergeRow = "", strData = "", r = 0;
                        amval = data[i].amval;
                        i = i - 1;
                    }
                }
                $("#SetRepListAmval").append(strMergeRow + strData);
            }
        }
    });
}

function RepAmvalAction() {
    var para = [];
    para[0] = $("#selRepAmvalAction").val();
    para[1] = "", para[2] = "";
    if ($("#chkRepAmvalAction").is(':checked')) {
        var x = CheckAndGetDate();
        para[1] = x[0];
        para[2] = x[1];
    }
    var header = "";
    
    $.ajax({
        type: "Post",
        url: "/rep/RepActionAmval",
        data: { 'para': para },
        dataType: "json",
        success: function(data) {
            $("#SetRepListAmval").html("");
            
            if (data.length > 0) {
                header = "گزارش اموال به تفکیک عملیات-نوع عملیات : ";
                header += data[0].actionFarsiName;
                header = "<tr><th colspan='5'>" + header + "</th></tr>";
                header += "<tr><th style='width: 15px'>ردیف</th><th style='width: 50px'>تاریخ</th><th style='width: 70px'>اموال</th>";
                header += "<th style='width: 270px'>نام کالا</th><th style='width: 170px'>نام کاربر</th>";
                $("#thRepListAmval").html(header);
                var dt = "", strText = "";
                for (var i = 0; i < data.length; i++) {
                    var newValue = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(newValue[0]), Number(newValue[1]), Number(newValue[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                    strText = "<tr>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 50px'>" + dt +
                        "</td>" +
                        "<td style='width: 70px'>" +
                        data[i].amval +
                        "</td>" +
                        "<td style='width: 270px'>" + data[i].productNameX +
                        "</td>" +
                        "<td style='width: 170px'>" +
                        Null2Empty(data[i].customerFName) + " " +Null2Empty(data[i].customerLName) +
                        "</td>" + "</tr>";
                    $("#SetRepListAmval").append(strText);
                }
                //MergeTable("SetRepListAmval",1);
            }
        }
    });
}

$(document).delegate("#chkAmvalListAll", "change", function () {
    if ($("#chkAmvalListAll").is(":checked")) {
        $('#selRepAmvalFilterAny').removeAttr('disabled');
        $('#txtAmvalFindReport1').removeAttr('disabled');
    } else {
        $('#selRepAmvalFilterAny').prop('disabled', 'disabled');
        $('#txtAmvalFindReport1').prop('disabled', 'disabled');
    }
});

$(document).delegate("#selRepAmvalFilterAny", "change", function () {
    
    var valSelect = $(this).val();
    $("#txtAmvalFindReport1").val("");
    
    if (valSelect === "5") {
        $("#txtAmvalFindReport1").hide();
    } else {
        $("#txtAmvalFindReport1").show();
    }
});

$(document).delegate('#cmdRepAmval', 'click', function () {
    
    var d = [];
    
    if ($('#rdb1').is(':checked')) {
        RepAllAmvalWithCondition();
    }
    if ($('#rdb2').is(':checked')) {
        RepAllEsghatWithDate();
    }
    if ($('#rdb3').is(':checked')) {
        RepAllServicesWithDate();
    }
    if ($('#rdb4').is(':checked')) {
        RepAmvalAssignToUser();
    }
    if ($('#rdb5').is(':checked')) {
        if ($("#txtRepAmvalNumberHistory").val().length !== 5) {
            $.alert({
                title: 'توجه',
                escapeKey: true,
                backgroundDismiss: true,
                content: 'شماره اموال صحیح نمی باشد',
                type: 'orange',
                boxWidth: '15%',
                useBootstrap: false
            });
        } else {
            RepAmvalHistory();
        }
    }
    if ($('#rdb6').is(':checked')) {
        RepAmvalHistoryTafkiki();
    }
    if ($('#rdb7').is(':checked')) {
        RepAmvalAction();
    }
});

$(document).delegate("#cmdRepAmvalClear", "click", function() {
    //$("#divUpMasrafi").css("height", "50%");
    //$("#divDnMasrafi").css("height", "50%");
    $("#thRepListAmval").html("<tr><th></th></tr>");
    $("#SetRepListAmval").html("");
    $("#chkAmvalListAll").prop('checked', false);
    $("#chkAmvalEsghatList").prop('checked', false);
    $("#chkAmvalServiceList").prop('checked', false);
    $("#chkAmvalAllAssigned").prop('checked', false);
    $("#chkAmvalNumberHistory").prop('checked', false);
    $("#chkRepTafkikGardeshAmval").prop('checked', false);
    $("#chkRepAmvalAction").prop('checked', false);
    //
    $("#rdb1").prop('checked', true);
    $("#selRepAmvalFilterAny").val("1");
    $("#txtAmvalFindReport1").val("");
    $("#txtServiceVendorName").val("");
    $("#lblServiceVendorId").html("0000");
    $("#txtFactorCustomerName").val("");
    $("#lblCustomerID").html("0000");
    $("#txtRepAmvalNumberHistory").val("");
    $("#selRepAmvalAction").val("1");

    for (var i = 1; i <=7; i++) {
        $(".RepAm" + i.toString()).prop('disabled', 'disabled');     
    }
    $("#chkAmvalListAll").prop('disabled', false);

    $("#txtAmvalFindReport1").prop('disabled', 'disabled');
    $("#selRepAmvalFilterAny").prop('disabled', 'disabled');
    $("#txtAmvalFindReport1").show();
    var today = GetCurrentShamsiDate();
    var dt = new Date();
    var lastMonth = Miladi2Farsi(dt.getFullYear(), dt.getMonth(), dt.getDate());

    $("#txtRepAmvalDate1").val(lastMonth[0] + "/" + lastMonth[1] + "/" + lastMonth[2]);
    $("#txtRepAmvalDate2").val(today);

    var toggler = document.getElementsByClassName("caret");
    toggler[0].parentElement.querySelector(".nested").classList.toggle("active");
    toggler[0].classList.toggle("caret-down");


});



$(document).delegate("#cmdClearRepMasrafi", "click", function() {

});

$(document).delegate("#cmdClearRepDate", "click", function () {
    $(".Date").val("");
    
});

$(document).delegate("#cmdTodayRepDate", "click", function () {
    var today = GetCurrentShamsiDate();
    $('.Date').val(today);
    
});

$(document).delegate('#txtRepMasrafiFindProducts', "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblFindpdID").html("0000");
    $("#lblMojoodi").html("0000");
    var strFind = $('#txtRepMasrafiFindProducts').val();

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
        $("#lblFindpdID").html("0000");
    }


});

$(document).delegate('#txtRepMasrafiCustomerName', "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblCustomerId").html("0000");
    var strFind = $('#txtRepMasrafiCustomerName').val();
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
        $("#lblCustomerId").html("0000");
    }
});

$(document).delegate('#cmdExportToExcel', "click", function() {
    ExportToExcel("tblRepMasrafi");
});

$(document).on("dblclick", "#tPDFilter tbody ", function () {

        var pname = $('.rowSelected').find('td').eq(1).text();
        var pdid = $('.rowSelected').data('id');
   
        $("#txtRepMasrafiFindProducts").val(pname);
        $("#lblFindpdID").text(pdid);
        $("#tPDFilter").css("visibility", "collapse");
        $("#txtRepMasrafiFindProducts").select();
});
function LoadActions() {
    
    $.ajax({
        type: "Get",
        url: "/rep/LoadFromActionTable",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.length > 0) {
                var t = "";
                for (var i = 0; i < data.length; i++) {
                    t = "<option value=" + data[i].acId + ">" + data[i].acFaName + "</option>";
                    $("#selRepAmvalAction").append(t);
                }
                
            }
        }
    });
}

$(document).delegate("#txtFactorCustomerName", "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblCustomerId").html("0000");
    var strFind = $('#txtFactorCustomerName').val();
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
        $("#lblCustomerId").html("0000");
    }

});

$(document).on("dblclick", "#tCustomerFilter tbody", function () {
        var fname = $('.rowSelected').find('td').eq(1).text();
        var lname = $('.rowSelected').find('td').eq(2).text();
        var cusId = $('.rowSelected').data('id');

        $("#txtFactorCustomerName").val(fname + " " + lname);
        $("#lblCustomerId").text(cusId);
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#txtRepMasrafiCustomerName").select();
});

$(document).delegate("#txtServiceVendorName", "keyup", function (e) {
    if (e.keyCode == 13 || e.keyCode == 27) { return }
    $("#lblServiceVendorId").html("0000");
    var strFind = $('#txtServiceVendorName').val();
    var strSql = "SELECT * FROM tblVendors WHERE ";

    if (strFind.length !== 0) {
        $("#tVendorFilter").css("visibility", "visible");

        strSql += "companyName LIKE N'%" + strFind + "%' ";

        $.ajax({
            type: "GET",
            url: "/vendor/ApplyFilter",
            data: { 'strSql': strSql },
            dataType: "json",
            success: function (data) {
                var setData = $('#SetVendorList');
                var strText = "";
                for (var i = 0; i < data.length; i++) {
                    strText += "<tr class='row_" +
                        data[i].vendorId +
                        "' data-id='" + data[i].vendorId + "'>" +
                        "<td style='width: 15px'>" +
                        (i + 1) +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].companyName +
                        "</td>" +
                        "<td style='width: 150px'>" +
                        data[i].vendorName +
                        "</td>" +
                        "</tr>";
                }

                $("#LoadingStatusVendor").html(" ");
                $(setData).html(strText);

            }
        });
    }
    else {
        $("#tVendorFilter").css("visibility", "collapse");
        $("#lblServiceVendorId").html("0000");
    }
});

$(document).on("dblclick", "#tVendorFilter tbody", function () {
    var vname = $('.rowSelected').find('td').eq(1).text();
    var venId = $('.rowSelected').data('id');

    $("#txtServiceVendorName").val(vname);
    $("#lblServiceVendorId").text(venId);
    $("#tVendorFilter").css("visibility", "collapse");
    $("#txtServiceVendorName").select();
});

$(document).ready(function () {
    CheckUserSession();
    LoadActions();
    $("#rdb1").prop('checked', true);
    //
    var today = GetCurrentShamsiDate();

    var dt = new Date();
    var lastMonth = Miladi2Farsi(dt.getFullYear(), dt.getMonth(), dt.getDate());

    $("#txtRepAmvalDate1").val(lastMonth[0] + "/" + lastMonth[1] +"/"+ lastMonth[2] );
    $("#txtRepAmvalDate2").val(today);
    

    var count = $("#divUpRepAmval input:radio").length;
    for (var i = 2; i<=count; i++) {
       $(".RepAm"+i.toString()).prop('disabled', 'disabled');
    }


    $('#selRepAmvalFilterAny').prop('disabled', 'disabled');
    $('#txtAmvalFindReport1').prop('disabled', 'disabled');

    
});
   

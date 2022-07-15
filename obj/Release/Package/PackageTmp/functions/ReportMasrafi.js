$(document).delegate('input', 'change', function (e) {
    var count = 0, subName = "";
    if ($(this).prop("name") === "rnMasrafi") {
        count = $("#divUpMasrafi input:radio").length;
        subName= "Mas";
    }
    if ($(this).is(':radio')) {

        for (var i = 1; i<=count; i++) {
            if ($(this).val() === i.toString()) {
                $(".Rep" +subName+ i.toString()).removeAttr('disabled');
            } else {
                $(".Rep" + subName + i.toString() ).prop('disabled', 'disabled');
            }
        }
    }
});

$(document).delegate('#cmdRepMasrafi', 'click', function() {
    var d1, d2, newVal = null;
    var d = [];
    var strSql = "";
    if ($('#rdb1').is(':checked')) {
        d1 = $('#txtRepDate1').val();
        d2 = $('#txtRepDate2').val();
        
        if (d2 === "" && d1 !== "") {
            $("#txtRepDate2").val(d1);
            d2 = d1;
        }

        if (!CheckFarsiValidDate(d1) || !CheckFarsiValidDate(d2)) {
            $("#txtRepDate1").notify(" تاریخ جستجو باید صحیح باشد", "warn");
            return;
        }

        if (FarsiDateDiff(d1, d2) < 0) {
            $("#txtRepDate1").notify(" تاریخ دوم نباید کمتر از تاریخ اول باشد", "warn");
            return;
        }
        var io = $('#selRepIO').val() === "1" ? 'vOutputFactorFull' : 'vInputFactorFull';
        newVal = $('#txtRepDate1').val().split('/');
        d1 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
        d1 = d1[0] + '-' + d1[1] + '-' + d1[2];
        newVal = $('#txtRepDate2').val().split('/');
        d2 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
        d2 = d2[0] + '-' + d2[1] + '-' + d2[2];
        
        ReportMasrafiVoroodKhorooj(d1,d2,io);
    }
    if ($('#rdb2').is(':checked')) {
        
        if (Number($('#txtNumberMojoodi').val()) >= 0) {
            var op = $('#selML').val() === "1" ? "<" : ">";
            ReportMasrafiMojoodi(Number($('#txtNumberMojoodi').val()),op);
        } else {
            $('#txtNumberMojoodi').notify("عدد صحیح وارد شود","warn");

            $('#txtNumberMojoodi').select();
        }
    }
    if ($('#rdb3').is(':checked')) {
        var condition = false;
        strSql = "SELECT * FROM vOutputFactorFull WHERE ";
        if ($('#lblFindpdID').text() !== "0000") {
            strSql += "pdId=" + $('#lblFindpdID').text() + " AND ";
            condition = true;
        }
        if ($('#lblCustomerId').text() !== "0000") {
            strSql += "customerId=" + $('#lblCustomerId').text() + " AND ";
            condition = true;
        }
        d1 = $('#txtRepDate3').val();
        d2 = $('#txtRepDate4').val();

        if (d1 + d2 !== "") {
            if (d2 === "" && d1 !== "") {
                $("#txtRepDate4").val(d1);
                d2 = d1;
            }

            if (!CheckFarsiValidDate(d1) || !CheckFarsiValidDate(d2)) {
                $("#rdb3").notify(" تاریخ جستجو باید صحیح باشد", "warn");
                return;
            }

            if (FarsiDateDiff(d1, d2) < 0) {
                $("#rdb3").notify(" تاریخ دوم نباید کمتر از تاریخ اول باشد", "warn");
                return;
            }
            condition = true;
            newVal = d1.split('/');
            d1 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
            newVal = d2.split('/');
            d2 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
            d1 = d1[0] + "-" + d1[1] + "-" + d1[2];
            d2 = d2[0] + "-" + d2[1] + "-" + d2[2];

            strSql += " outFactorDate BETWEEN '" + d1 + "' AND '" + d2 + "' AND";
        }
        if (condition) {
            strSql = strSql.substring(strSql.length - 4, 0);
            strSql += " ORDER BY outFactorId";
            ReportMasrafiProductCusDate(strSql);
        }
    }
    if ($('#rdb4').is(':checked')) {
        if ($("#chkRepMasrafiTajmiDate").is(':checked')) {
            d1 = $('#txtRepDate5').val();
            d2 = $('#txtRepDate6').val();
            if (d1 + d2 !== "") {
                if (d2 === "" && d1 !== "") {
                    $("#txtRepDate6").val(d1);
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
                newVal = d1.split('/');
                d1 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                newVal = d2.split('/');
                d2 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                d1 = d1[0] + "-" + d1[1] + "-" + d1[2];
                d2 = d2[0] + "-" + d2[1] + "-" + d2[2];
            }
        } else {
            d1 = "NULL";
            d2 = "";
        }
        
        d[0] = 1; //useless
        d[1] = d1;
        d[2] = d2;

        if ($("#selRepMasrafiTajmi").val() === "1") { // By Product
            RepTajmiProduct(d);
        } else {
            RepTajmiCustomer(d);
        }
    }
    if ($('#rdb5').is(':checked')) {
        if ($("#chkRepMasrafiTafsilDate").is(':checked')) {
            d1 = $('#txtRepDate7').val();
            d2 = $('#txtRepDate8').val();
            if (d1 + d2 !== "") {
                if (d2 === "" && d1 !== "") {
                    $("#txtRepDate8").val(d1);
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
                newVal = d1.split('/');
                d1 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                newVal = d2.split('/');
                d2 = Farsi2Miladi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                d1 = d1[0] + "-" + d1[1] + "-" + d1[2];
                d2 = d2[0] + "-" + d2[1] + "-" + d2[2];
            }
        } else {
            d1 = "1900-01-01";
            d2 = "2050-01-01";
        }
        
        d[0] = "1"; //1 means sort by user and 2 sort by date
        d[1] = d1;
        d[2] = d2;

        if ($("#selRepMasrafiTafsil").val() === "1") { // By User
            d[0] = "1";
            RepTafsilByUser(d);
        } else {//By Date
            d[0] = "2";
            RepTafsilByDate(d);
        }
    }
});

function RepTajmiProduct(d) {
    var header = "";
    header="<tr><th>ردیف</th>";
    header += "<th>نام و مشخصات کالا</th>";
    header += "<th>تعداد کالای تحویلی</th>"+"</tr>";
    
    
    $.ajax({
        type: "Post",
        url: "/rep/ReportMasrafiTajmiProduct",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);
            var l = data.length;
            $('#SetListMasrafi').html("");
            if (l > 0) {
                $("#divUpMasrafi").css("height", "20%");
                $("#divDnMasrafi").css("height", "80%");
                var rdata = "";
                $("#SetListMasrafi").html("");
                for (var i = 0; i < l; i++) {
                    rdata = "<tr><td style='width:5%'>" +
                        Number(i + 1) +
                        "</td><td style='width:55%'>" +
                        data[i].CNAME +
                        "</td><td style='width:15%'>" +
                        data[i].QUANTITY +
                        "</td></tr>";
                    $("#SetListMasrafi").append(rdata);
                }
            }
        }
    });
}

function RepTajmiCustomer(d) {
    var header = "";
    header="<tr><th>ردیف</th>";
    header += "<th>نام کاربر تحویل گیرنده</th>";
    header += "<th>تعداد کالای تحویلی</th>" + "</tr>";
    
    
    $.ajax({
        type: "Post",
        url: "/rep/ReportMasrafiTajmiCustomer",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);

            var l = data.length;
            $('#SetListMasrafi').html("");
            if (l > 0) {
                $("#divUpMasrafi").css("height", "20%");
                $("#divDnMasrafi").css("height", "80%");
                var rdata = "";
                $("#SetListMasrafi").html("");
                for (var i = 0; i < l; i++) {
                    rdata = "<tr><td style='width:5%'>" +
                        Number(i + 1) +
                        "</td><td style='width:55%'>" +
                        data[i].CNAME +
                        "</td><td style='width:15%'>" +
                        data[i].QUANTITY +
                        "</td></tr>";
                    $("#SetListMasrafi").append(rdata);
                }
            }
        }
    });
}

function ReportMasrafiVoroodKhorooj(d1,d2,io) {
    var d = [];
    d[0] = d1;
    d[1] = d2;
    d[2] = io;
    var header = "";
    if (io === "vOutputFactorFull") {
        header = "<tr><th colspan='4'>گزارش خروج کالاهای مصرفی تحویل کاربر</th></tr>";
    } else {
        header = "<tr><th colspan='4'>گزارش ورود کالاهای مصرفی از انبار</th></tr>";
    }

    $.ajax({
        type: "Post",
        url: "/rep/ReportMasrafiVoroodKhorooj",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);

            var l = data.length;
            if (l === 0) {
                $("#SetListMasrafi").html("");
                return;
            }
            $("#divUpMasrafi").css("height", "20%");
            $("#divDnMasrafi").css("height", "80%");
            
            var  r = 1;
            var factId = data[0].outFactorId;
            var newVal = data[0].myDate.split('-');
            var d = Miladi2Farsi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
            d = d[0] + "/" + d[1] + "/" + d[2];
            var tdata = "";
            $("#SetListMasrafi").html("");
            var i = 0;
            while (i < l) {
                
                 if (data[i].FactorId === factId) {
                     tdata = "<tr style='background-color:white'><td style='width:5%'>" +
                         r +
                         "</td><td colspan='2' style='width:30%'>" +
                         data[i].productName +
                         " " +
                         Null2Empty(data[i].brandName) +
                         " " +
                         Null2Empty(data[i].materialName) +
                         " " +
                         Null2Empty(data[i].sizeName) +
                         " " +
                         Null2Empty(data[i].colorName) +
                         " " +
                         Null2Empty(data[i].genderName) +
                         " " +
                         Null2Empty(data[i].countryName) +
                         " " +
                         Null2Empty(data[i].pDescription)+
                         "</td><td style='width:5%'>" +
                         data[i].quantity +
                         "</td>";
                     r += 1;
                     i += 1;
                 } else {
                     newVal = data[i].myDate.split('-');
                     d = Miladi2Farsi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                     d = d[0] + "/" + d[1] + "/" + d[2];
                     
                     tdata = "<tr style='background-color:gray'><td colspan='4'>" + data[i].CustomerName + ' ' + d + ' ' + data[i].FactorDesc + "</td></tr>";
                     factId = data[i].FactorId;
                     r = 1;
                 }
                 
                 $("#SetListMasrafi").append(tdata);

            }
        }
    });
}

function ReportMasrafiMojoodi(nu, op) {
    var d = [];
    d[0] = nu;
    d[1] = op;
    var header = "";
    header = "<tr><th>ردیف</th>";
    header += "<th>نام کالا</th><th>موجودی</th></tr>";
    
    $.ajax({
        type: "Post",
        url: "/rep/ReportMasrafiMojoodi",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);
            var l = data.length;
            if (l > 0) {
                $("#divUpMasrafi").css("height", "20%");
                $("#divDnMasrafi").css("height", "80%");
                var rdata = "";
                $("#SetListMasrafi").html("");
                for (var i = 0; i < l; i++) {
                    rdata = "<tr><td style='width:5%'>" +
                        Number(i + 1) +
                        "</td><td style='width:50%'>" +
                        data[i].productNameX +
                        "</td><td style='width:10%'>" +
                        data[i].number +
                        "</td></tr>";
                    $("#SetListMasrafi").append(rdata);
                }
            }
        }
    });
}

function ReportMasrafiProductCusDate(strSql) {
    var header = "";
    header = "<tr><th>ردیف</th>";
    header += "<th>نام کالا</th><th>نام کاربر/تحویل گیرنده</th>";
    header += "<th>تاریخ تحویل</th><th>تعداد</th>";
    header += "<th>شرح تحویل کالا</th>" + "</tr>";

    
    
    $.ajax({
        type: "Post",
        url: "/rep/ReportMasrafiProductCusDate",
        data: { 'strSql': strSql },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);
            var l = data.length;
            $('#SetListMasrafi').html("");
            if (l > 0) {
                $("#divUpMasrafi").css("height", "20%");
                $("#divDnMasrafi").css("height", "80%");
                var rdata = "", productNameX = "",dt="";
                $("#SetListMasrafi").html("");
                for (var i = 0; i < l; i++) {
                    productNameX = data[i].productName +
                        " " +
                        Null2Empty(data[i].brandName) +
                        " " +
                        Null2Empty(data[i].colorName) +
                        " " +
                        Null2Empty(data[i].sizeName) +
                        " " +
                        Null2Empty(data[i].materialName) +
                        " " +
                        Null2Empty(data[i].counrtyName) +
                        " " +
                        Null2Empty(data[i].genderName) +
                        " " +
                        Null2Empty(data[i].pDescription);
                    dt = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
                    rdata = "<tr><td style='width:5%'>" +
                        Number(i + 1) +
                        "</td><td style='width:40%'>" +
                        productNameX +
                        "</td><td style='width:20%'>" +
                        data[i].CustomerName +
                        "</td><td style='width:10%'>"+
                        dt +
                        "</td><td style='width:5%'>" +
                        data[i].quantity +
                        "</td><td style='width:20%'>" +
                        data[i].detailDesc + "</td></tr>";

                    $("#SetListMasrafi").append(rdata);
                }
            }
        }
    });
}

function RepTafsilByUser(d) {
    var header = "";
    if (d[0] === "1") {
        header = "<tr><th colspan='5'>گزارش تفصیلی کالاهای تحویل شده به تفکیک کاربر</th></tr>";
    } else {
        header = "<tr><th colspan='5'>گزارش تفصیلی کالاهای تحویل شده به تفکیک تاریخ</th></tr>";
    }

    $.ajax({
        type: "Post",
        url: "/rep/RepMasrafiTafsil",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);
            $("#SetListMasrafi").html("");
            var l = data.length;
            if (l === 0) { return }
            $("#divUpMasrafi").css("height", "20%");
            $("#divDnMasrafi").css("height", "80%");
            var strMergeRow = "", strData = "", r = 0, dt = "";
            var cid = data[0].CustomerId;
            for (var i = 0; i < l; i++) {
                if (data[i].CustomerId === cid) {
                    r += 1;
                    dt = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];

                    strMergeRow = "<tr style='background-color:cyan'><td colspan='5'>" + data[i].CustomerName + "</td></tr>";
                    strMergeRow += "<tr style='background-color:grey'><td>ردیف</td><td>تاریخ</td><td>کالا</td><td>تعداد</td><td>شرح</td>";

                    strData += "<tr style='background-color:white'><td>" + r + "</td>";
                    strData += "<td>" + dt + "</td>";
                    strData += "<td>" + data[i].productNameX + "</td>";
                    strData += "<td>" + data[i].quantity + "</td>";
                    strData += "<td>" + data[i].myDesc + "</td>";
                } else {
                    $("#SetListMasrafi").append(strMergeRow + strData);
                    strMergeRow = "", strData = "", r = 0;
                    cid = data[i].CustomerId;
                    i = i - 1;
                }
            }
            $("#SetListMasrafi").append(strMergeRow + strData);
        }
    });
}

function RepTafsilByDate(d) {
    var header = "";
    if (d[0] === "1") {
        header = "<tr><th colspan='5'>گزارش تفصیلی کالاهای تحویل شده به تفکیک کاربر</th></tr>";
    } else {
        header = "<tr><th colspan='5'>گزارش تفصیلی کالاهای تحویل شده به تفکیک تاریخ</th></tr>";
    }

    $.ajax({
        type: "Post",
        url: "/rep/RepMasrafiTafsil",
        data: { 'd': d },
        dataType: "json",
        success: function (data) {
            $("#thListMasrafi").html(header);
            $("#SetListMasrafi").html("");
            var l = data.length;
            if (l === 0) { return }
            $("#divUpMasrafi").css("height", "20%");
            $("#divDnMasrafi").css("height", "80%");
            var strMergeRow = "", strData = "", r = 0, dt = "";
            var md = data[0].myDate;
            for (var i = 0; i < l; i++) {
                if (data[i].myDate === md) {
                    r += 1;
                    dt = data[i].myDate.split('-');
                    dt = Miladi2Farsi(Number(dt[0]), Number(dt[1]), Number(dt[2]));
                    dt = dt[0] + "/" + dt[1] + "/" + dt[2];

                    strMergeRow = "<tr style='background-color:cyan'><td colspan='5'>" + dt + "</td></tr>";
                    strMergeRow += "<tr style='background-color:grey'><td>ردیف</td><td>کاربر</td><td>کالا</td><td>تعداد</td><td>شرح</td>";

                    strData += "<tr style='background-color:white'><td>" + r + "</td>";
                    strData += "<td>" + data[i].CustomerName + "</td>";
                    strData += "<td>" + data[i].productNameX + "</td>";
                    strData += "<td>" + data[i].quantity + "</td>";
                    strData += "<td>" + data[i].myDesc + "</td>";
                } else {
                    $("#SetListMasrafi").append(strMergeRow + strData);
                    strMergeRow = "", strData = "", r = 0;
                    md = data[i].myDate;
                    i = i - 1;
                }
            }
            $("#SetListMasrafi").append(strMergeRow + strData);
        }
    });
}

$(document).delegate("#cmdClearRepMasrafi", "click", function() {
    $("#divUpMasrafi").css("height", "50%");
    $("#divDnMasrafi").css("height", "50%");
    $("#thListMasrafi").html("");
    $("#SetListMasrafi").html("");
    $("#chkRepMasrafiTajmiDate").prop('checked', false);
    $("#chkRepMasrafiTafsilDate").prop('checked', false);
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

$(document).on("dblclick", "#tCustomerFilter tbody", function () {
        var fname = $('.rowSelected').find('td').eq(1).text();
        var lname = $('.rowSelected').find('td').eq(2).text();
        var cusId = $('.rowSelected').data('id');

        $("#txtRepMasrafiCustomerName").val(fname + " " + lname);
        $("#lblCustomerId").text(cusId);
        $("#tCustomerFilter").css("visibility", "collapse");
        $("#txtRepMasrafiCustomerName").select();
    });

$(document).ready(function () {
    CheckUserSession();
    $("#rdb1").prop('checked', true);
    //
    var today = GetCurrentShamsiDate();
    $('.Date').val(today);
    $("#txtRepDate3").val("");
    $("#txtRepDate4").val("");

    var count = $("#divUpMasrafi input:radio").length;
    for (var i = 2; i<=count; i++) {
       $(".RepMas"+i.toString()).prop('disabled', 'disabled');
    }
    
});
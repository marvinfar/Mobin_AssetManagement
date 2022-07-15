$(document).ready(function () {
    CheckUserSession();
    var m = "";
    var d = [];
    var curShamsiYear = GetCurrentShamsiDate().split('/');
    var dt = "";
    dt = (Farsi2Miladi(Number(curShamsiYear[0]), 1, 1));
    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
    d[0]=dt;
    dt = (Farsi2Miladi(Number(curShamsiYear[0]), 12, 29));
    dt = dt[0] + "/" + dt[1] + "/" + dt[2];
    d[1] = dt;

    $.ajax({
        type: "Get",
        url: '/dashboard/TheLastFivePersonWhoTake',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            
            if (data.length > 0) {
                m = "<h3 style='color:orange'>آخرین افرادی که از هلپ دسک کالا دربافت کرده اند</h3>";
                var newVal = "", da = "";
                for (var i = 0; i < data.length; i++) {
                    
                    newVal = data[i].myDate.split('-');
                    da = Miladi2Farsi(Number(newVal[0]), Number(newVal[1]), Number(newVal[2]));
                    da = da[0] + "/" + da[1] + "/" + da[2];
                    m += "<p style='color:white'><span style='color:cyan'>" + data[i].CustomerName + "<span style = 'color:white'> در تاریخ ";
                    m += da + " کالای " + "<span style='color:cyan'>" + data[i].productName;
                    m += "<span style = 'color:white'>"+ " را تحویل گرفته است";
                    m += "</p>";

                }
                $("#h1").append(m);
            }
        }
    });

    $.ajax({
        type: "POST",
        url: '/dashboard/FiveMostCustomerOut',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        data: { 'd': d },
        dataType: "json",
        success: function (data) {

            if (data.length > 0) {
                m = "<h3 style='color:orange'> افرادی که در سال جاری بیشترین کالا را دریافت کرده اند</h3>";
                for (var i = 0; i < data.length; i++) {
                    m += "<p style='color:white'><span style='color:cyan'>" + data[i].CustomerName + "<span style = 'color:white'> تعداد ";
                    m += "<span style='color:cyan'>" + data[i].Expr1;
                    m += "<span style = 'color:white'>" + " کالا تحویل گرفته است";
                    m += "</p>";

                }
                $("#h2").append(m);
            }
        }
    });

    $.ajax({
        type: "POST",
        url: '/dashboard/FiveMostProductOut',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        dataType: "json",
        data: { 'd': d },
        success: function (data) {
            if (data.length > 0) {
                m = "<h4 style='color:orange'>لیست بیشترین کالای خروجی از انبار در سال جاری</h4>";
                for (var i = 0; i < data.length; i++) {
                    m += "<p>" + data[i].productNameX + " به تعداد " + "<span style='color:red ;font-weight:bold'>" + data[i].Expr1 + "<span style='color:white;font-weight:normal'>" +" عدد خارج شده است" + "</p>";
                }
                $("#sec1").append(m);
            }
        }
    });

    $.ajax({
        type: "POST",
        url: '/dashboard/FiveLessProductOut',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        dataType: "json",
        data: { 'd': d },
        success: function (data) {
            if (data.length > 0) {
                m = "<h4 style='color:orange'>لیست کمترین کالای خروجی از انبار  در سال جاری</h4>";
                for (var i = 0; i < data.length; i++) {
                    m += "<p>" + data[i].productNameX + " به تعداد " + "<span style='color:red ;font-weight:bold'>" + data[i].Expr1 + "<span style='color:white;font-weight:normal'>" + " عدد خارج شده است" + "</p>";
                }
                $("#sec2").append(m);
            }
        }
    });

    $.ajax({
        type: "Get",
        url: '/dashboard/MojoodiBetween',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { 'n1': 1,'n2':5 },
        success: function (data) {
            if (data.length > 0) {
                m = "<h4 style='color:orange'>کالا با موجودی 5 عدد و کمتر</h4>";
                for (var i = 0; i < data.length; i++) {
                    m += "<p>" + data[i].productNameX + " به تعداد " + "<span style='color:red ;font-weight:bold'>" + data[i].number + "<span style='color:white;font-weight:normal'>" + " عدد موجود می باشد" + "</p>";
                }
                $("#sec3").append(m);
            }
        }
    });

    $.ajax({
        type: "Get",
        url: '/dashboard/MojoodiBetween',
        //data: '{userRef:' + 1 + ', moduleRef:' + JSON.stringify('sdfsfs') + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: { 'n1': 0, 'n2': 0 },
        success: function (data) {
            if (data.length > 0) {
                m = "<h4 style='color:orange'>لیست کالا با موجودی صفر</h4>";
                for (var i = 0; i < data.length; i++) {
                    m += "<p>" + data[i].productNameX + "</p>";
                }
                $("#sec4").append(m);
            }
        }
    });

});

function name(parameters) {
    
}
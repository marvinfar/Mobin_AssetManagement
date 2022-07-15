using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;


namespace KOP_Store.Controllers
{
    public class serviceController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        public object CommandType { get; private set; }


        // GET: productGroup
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public ActionResult serviceView()
        {
            return View("serviceView");
        }
        public JsonResult SaveServiceDetail(string serviceId,string[] d,string  option="0")
        {
            /* option= 0 : نه از حساب خارج شود نه اسقاط می شود
               option=1 : از حساب خارج شود و در کد 1943 یعنی انبار قرار گیرد
               option=2 یعنی اسقاط شود و در جدول اسقاط ثبت گردد
            */
            var result = false;
            try
            {
                int radif = Convert.ToInt32(d[0]);//ردیف تخصیصی که اموال در اختیار آن شخص بود(active=true)
                if (option != "0")
                {
                    tblTakhsisAmval takhsis =
                        db.tblTakhsisAmvals.SingleOrDefault(x => x.radif == radif);
                    takhsis.active = false;
                    db.SaveChanges();
                    tblTakhsisAmval takhsisAmval = new tblTakhsisAmval();

                    takhsisAmval.pdId = takhsis.pdId;
                    takhsisAmval.amval = takhsis.amval;
                    takhsisAmval.deliverDate = DateTime.Parse(d[7]); // Date Main
                    if (option == "1")
                    {
                        //خروج از حساب
                        takhsisAmval.customerId = 1937; //Anbar
                        takhsisAmval.active = true;
                        takhsisAmval.esghat = false;
                        tblAmvalAction amvalActionT = new tblAmvalAction();
                        amvalActionT.amval = d[3];
                        amvalActionT.actionId = 3; //Tasvie Bargasht Amval
                        amvalActionT.actionDate = DateTime.Parse(d[7]);
                        db.tblAmvalActions.Add(amvalActionT);
                        db.SaveChanges();
                    }

                    if (option == "2")
                    {
                        //اسقاط
                        takhsisAmval.customerId = takhsis.customerId;
                        takhsisAmval.active = false;
                        takhsisAmval.esghat = true;
                    }

                    takhsisAmval.description = d[6];
                    takhsisAmval.userId = d[8] == "" ? 2 : Convert.ToInt32(d[8]);
                    db.tblTakhsisAmvals.Add(takhsisAmval);
                    db.SaveChanges();

                    if (option == "2")
                    {
                        // Save in Esghat Table
                        tblEsghatAmval esghat = new tblEsghatAmval();
                        esghat.amval = takhsisAmval.amval;
                        esghat.customerId = takhsisAmval.customerId;
                        esghat.pdId = takhsisAmval.pdId;
                        esghat.esghatDate = takhsisAmval.deliverDate;
                        esghat.esghatDescription = takhsisAmval.description;
                        db.tblEsghatAmvals.Add(esghat);
                        db.SaveChanges();
                        tblAmvalAction amvalActionE = new tblAmvalAction();
                        amvalActionE.amval = d[3];
                        amvalActionE.actionId = 4; //Abortion Amval
                        amvalActionE.actionDate = DateTime.Parse(d[7]);
                        db.tblAmvalActions.Add(amvalActionE);
                        db.SaveChanges();
                    }
                }

                //Finally Seve in Service Detail Info
                tblServiceDetail serviceDetail = new tblServiceDetail();
                serviceDetail.serviceId =Convert.ToInt32(serviceId);
                serviceDetail.serviceDetailId = Convert.ToInt32((d[1]));
                serviceDetail.pdid = Convert.ToInt32(d[2]);
                serviceDetail.amval = d[3];
                serviceDetail.customerId = Convert.ToInt16(d[4]);
                serviceDetail.servicePrice =d[5]==""?0: Convert.ToDecimal(d[5]);
                serviceDetail.serviceDetailDesc = d[6];
                db.tblServiceDetails.Add(serviceDetail);
                db.SaveChanges();
                tblAmvalAction amvalAction = new tblAmvalAction();
                amvalAction.amval = d[3];
                amvalAction.actionId = 5; //Service Amval
                amvalAction.actionDate = DateTime.Parse(d[7]);
                db.tblAmvalActions.Add(amvalAction);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult SaveServiceMain(string[] d)
        {
            var result = 0;
            // d[] Contains ServiceMain Info as Array
            try
            {
                var serviceId = Convert.ToInt32(d[0]);
                
                tblServiceMain serviceMain = new tblServiceMain();
                serviceMain.serviceId = serviceId;
                serviceMain.serviceDate = DateTime.Parse(d[1]);
                serviceMain.vendorId = Convert.ToInt16(d[2]);
                serviceMain.serviceDescription = d[3];
                serviceMain.serviceTotalPrice = Convert.ToDecimal(d[4]);
                serviceMain.userid = d[5]==""? 2:Convert.ToInt32(d[5]);
                db.tblServiceMains.Add(serviceMain);
                db.SaveChanges();
                result = serviceMain.serviceId;
                
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }


        

    }

}

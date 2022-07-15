using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KOP_Store.Models.DataBaseModels;

namespace KOP_Store.Controllers
{
    public class loginController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();
        // GET: Login
        public ActionResult loginView()
        {
            return View("LoginView");
        }

        public JsonResult CheckLoginUserPass(string un,string pw)
        {
            

             pw = MyEncryptDecrypt.EncryptString(pw);
            vUsers model = db.vUsers1.Where(x => x.username== un && x.password==pw ).SingleOrDefault();

            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public JsonResult IsUserActive(string un, string pw)
        {
            vUsers model = db.vUsers1.SingleOrDefault(x => ( x.username == un && x.password == pw && (bool)x.active));

            return Json(model);
        }

        public JsonResult SaveLoginLog(string[] d)
        {
            var result = false;
            // d[] Contains user Info as Array
            try
            {
                
                tblLoginLog loginLog = new tblLoginLog();
                    loginLog.username = d[0];
                    loginLog.xTime = d[1];
                    loginLog.xDate = d[2];
                    loginLog.ipAddress = d[3];
                    db.tblLoginLogs.Add(loginLog);
                    db.SaveChanges();
                    result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }

}

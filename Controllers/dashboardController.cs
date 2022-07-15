using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class dashboardController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

         public ActionResult dashboardView()
        {
            return View();
        }

         public JsonResult FiveMostProductOut(string[] d)
         {
             DateTime d1, d2;
             d1 = Convert.ToDateTime(d[0]);
             d2 = Convert.ToDateTime(d[1]);
            List<sp_FiveMostProductOut_Result> sp = db.sp_FiveMostProductOut(d1, d2).OrderByDescending(x => x.Expr1).Take(5)
                 .ToList();

             return Json(sp, JsonRequestBehavior.AllowGet);
         }

         public JsonResult FiveMostCustomerOut(string[] d)
         {
             DateTime d1, d2;
             d1 = Convert.ToDateTime(d[0]);
             d2 = Convert.ToDateTime(d[1]);
            List<sp_FiveMostCustomerOut_Result> sp = db.sp_FiveMostCustomerOut(d1,d2).OrderByDescending(x => x.Expr1).Take(5)
                 .ToList();

             return Json(sp, JsonRequestBehavior.AllowGet);
         }
        public JsonResult FiveLessProductOut(string[] d)
         {
             DateTime d1, d2;
             d1 = Convert.ToDateTime(d[0]);
             d2 = Convert.ToDateTime(d[1]);
            List<sp_FiveMostProductOut_Result> sp = db.sp_FiveMostProductOut(d1,d2).OrderBy(x => x.Expr1).Take(5)
                 .ToList();

             return Json(sp, JsonRequestBehavior.AllowGet);
         }

         public JsonResult MojoodiBetween(int n1, int n2)
         {
             List<sp_MojoodiLessThan5_Result> sp = db.sp_MojoodiLessThan5(n1,n2).OrderByDescending(x => x.number).ToList();

             return Json(sp, JsonRequestBehavior.AllowGet);
         }
         public JsonResult TheLastFivePersonWhoTake()
         {
             List<sp_TheLastFivePersonWhoTake_Result> sp = db.sp_TheLastFivePersonWhoTake().ToList();
             
             return Json(sp, JsonRequestBehavior.AllowGet);
         }
    }


}

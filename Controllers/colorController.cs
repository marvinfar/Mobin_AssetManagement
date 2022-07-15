using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class colorController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

         public ActionResult colorView()
        {

            return View("colorView");
        }
        
        public JsonResult GetColorList()
        {
            
            List<mdlColor> colors= db.tblColors.Select(x => new mdlColor()

            {
                colorId = x.colorId,
                colorName = x.colorName
            }).ToList();

            return Json(colors, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetColorById(int colorId)
        {
            tblColor model = (tblColor) db.tblColors.Where(x => x.colorId == colorId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveColor(string[] d)
        {
            var result = false;
           // d[] Contains ID,Name as Array
           try
           {
               var s = d;
               var colorId = Convert.ToInt16(d[0]);
                if (colorId != 0) //in Edit mode
                {
                    tblColor color= db.tblColors.SingleOrDefault(x => x.colorId == colorId);
                    color.colorName= d[1];
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblColor color= new tblColor();
                    color.colorId = colorId;
                    color.colorName= d[1];
                    db.tblColors.Add(color);
                    db.SaveChanges();
                    result = true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteColor(int ColorId)
        {
            var result = false;
            try
            {
                tblColor color= db.tblColors.Where(x => x.colorId == ColorId).SingleOrDefault();
                if (color != null)
                {
                    db.tblColors.Remove(color);
                    db.SaveChanges();
                    result = true;
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }

  
}

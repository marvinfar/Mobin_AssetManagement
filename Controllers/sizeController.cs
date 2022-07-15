using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class sizeController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

         public ActionResult sizeView()
        {

            return View("sizeView");
        }
        
        public JsonResult GetSizeList()
        {
            
            List<mdlSize> sizes= db.tblSizes.Select(x => new mdlSize()

            {
                sizeId = x.sizeId,
                sizeName = x.sizeName
            }).ToList();

            return Json(sizes, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSizeById(int sizeId)
        {
            tblSize model = (tblSize) db.tblSizes.Where(x => x.sizeId == sizeId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveSize(string[] d)
        {
            var result = false;
           // d[] Contains ID,Name as Array
           try
           {
               var s = d;
               var sizeId = Convert.ToInt16(d[0]);
                if (sizeId != 0) //in Edit mode
                {
                    tblSize size= db.tblSizes.SingleOrDefault(x => x.sizeId == sizeId);
                    size.sizeName= d[1];
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblSize size= new tblSize();
                    size.sizeId = sizeId;
                    size.sizeName= d[1];
                    db.tblSizes.Add(size);
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

        public JsonResult DeleteSize(int SizeId)
        {
            var result = false;
            try
            {
                tblSize size= db.tblSizes.Where(x => x.sizeId == SizeId).SingleOrDefault();
                if (size != null)
                {
                    db.tblSizes.Remove(size);
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

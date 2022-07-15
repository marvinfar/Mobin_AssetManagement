using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class productGroupController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        // GET: productGroup
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public ActionResult productGroupView()
        {

            return View("productGroupView");
        }
        

        public JsonResult GetProductGroupList()
        {
            
            List<mdlProductGroup> productGroups = db.tblProductGroups.Select(x => new mdlProductGroup

            {
                productGroupId = x.productGroupId,
                productGroupName = x.productGroupName
            }).ToList();

            return Json(productGroups, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductGroupById(int productGroupId)
        {
            tblProductGroup model = (tblProductGroup) db.tblProductGroups.Where(x => x.productGroupId == productGroupId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveProductGroup(string[] d)
        {
            var result = false;
           // d[] Contains productGroup ID,Name as Array
           try
           {
               var s = d;
               var pGroupId = Convert.ToInt32(d[0]);
                if (pGroupId!= 0) //in Edit mode
                {
                    tblProductGroup productGroups =
                        db.tblProductGroups.SingleOrDefault(x => x.productGroupId == pGroupId);
                    productGroups.productGroupName = d[1];
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblProductGroup productGroups = new tblProductGroup();
                    productGroups.productGroupId = pGroupId;
                   productGroups.productGroupName = d[1];
                    db.tblProductGroups.Add(productGroups);
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

        public JsonResult DeleteProductGroup(int pGId)
        {
            var result = false;
            try
            {
                tblProductGroup productGroups = db.tblProductGroups.Where(x => x.productGroupId == pGId).SingleOrDefault();
                if (productGroups != null)
                {
                    db.tblProductGroups.Remove(productGroups);
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

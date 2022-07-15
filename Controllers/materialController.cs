using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class materialController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

         public ActionResult materialView()
        {

            return View("materialView");
        }
        
        public JsonResult GetMaterialList()
        {
            
            List<mdlMaterial> materials= db.tblMaterials.Select(x => new mdlMaterial()

            {
                materialId = x.materialId,
                materialName= x.materialName
            }).ToList();

            return Json(materials, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMaterialById(int materialId)
        {
            tblMaterial model = (tblMaterial) db.tblMaterials.Where(x => x.materialId== materialId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveMaterial(string[] d)
        {
            var result = false;
           // d[] Contains ID,Name as Array
           try
           {
               var s = d;
               var materialId = Convert.ToInt16(d[0]);
                if (materialId!= 0) //in Edit mode
                {
                    tblMaterial material= db.tblMaterials.SingleOrDefault(x => x.materialId== materialId);
                    material.materialName= d[1];
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblMaterial material= new tblMaterial();
                    material.materialId= materialId;
                    material.materialName = d[1];
                    db.tblMaterials.Add(material);
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

        public JsonResult DeleteMaterial(int MaterialId)
        {
            var result = false;
            try
            {
                tblMaterial material= db.tblMaterials.Where(x => x.materialId== MaterialId).SingleOrDefault();
                if (material!= null)
                {
                    db.tblMaterials.Remove(material);
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

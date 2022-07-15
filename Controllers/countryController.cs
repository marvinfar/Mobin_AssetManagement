using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class countryController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        // GET: productGroup
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public ActionResult countryView()
        {

            return View("countryView");
        }
        
        public JsonResult GetCountryList()
        {
            
            List<mdlCountry> countries= db.tblCountries.Select(x => new mdlCountry()

            {
                countryId = x.countryId,
                countryName = x.countryName
            }).ToList();

            return Json(countries, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCountryById(int countryId)
        {
            tblCountry model = (tblCountry) db.tblCountries.Where(x => x.countryId == countryId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveCountry(string[] d)
        {
            var result = false;
           // d[] Contains productGroup ID,Name as Array
           try
           {
               var s = d;
               var countryId = Convert.ToInt16(d[0]);
                if (countryId!= 0) //in Edit mode
                {
                    tblCountry country =
                        db.tblCountries.SingleOrDefault(x => x.countryId == countryId);
                    country.countryName = d[1];
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblCountry country = new tblCountry();
                    country.countryId = countryId;
                    country.countryName = d[1];
                    db.tblCountries.Add(country);
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

        public JsonResult DeleteCountry(int CountryId)
        {
            var result = false;
            try
            {
                tblCountry country= db.tblCountries.Where(x => x.countryId == CountryId).SingleOrDefault();
                if (country != null)
                {
                    db.tblCountries.Remove(country);
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

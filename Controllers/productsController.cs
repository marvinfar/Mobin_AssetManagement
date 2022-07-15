using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class productsController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        // GET: productGroup
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public ActionResult productsView()
        {

            return View("productsView");
        }

        public JsonResult GetProductGroupList()
        {// for Select Combobox in add or edit modal form

            List<mdlProductGroup> productGroups = db.tblProductGroups.Select(x => new mdlProductGroup

            {
                productGroupId = x.productGroupId,
                productGroupName = x.productGroupName
            }).ToList();

            return Json(productGroups, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetProductList()
        {
            List<mdlProducts> products = db.vProducts.Select(x => new mdlProducts()
            {
                productId = x.productId,
                productName  = x.productName,
                productGroupId=x.productGroupId,
                productGroupNameX = x.productGroupName
            }).ToList();

            return Json(products, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductsById(int productsId)
        {
            tblProduct model = db.tblProducts.Where(x => x.productId == productsId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductFilter(string[] d)
        {
            var str = d[0];
            var pgId = Convert.ToInt32(d[1]); //selected product group

            List<mdlProducts> products = null;
            if (str.Length > 0 && pgId > 0)
            {
                 products = db.vProducts
                                    .Where(c => c.productGroupId == pgId && c.productName.Contains(str)).Select(c=>new mdlProducts()
                                    {
                                        productId = c.productId,
                                        productName = c.productName,
                                        productGroupId = c.productGroupId,
                                        productGroupNameX = c.productGroupName
                                    }).ToList();

            }
            if (str.Length > 0 && pgId ==-1)
            {
                products = db.vProducts
                    .Where(c => c.productName.Contains(str)).Select(c => new mdlProducts()
                    {
                        productId = c.productId,
                        productName = c.productName,
                        productGroupId = c.productGroupId,
                        productGroupNameX = c.productGroupName
                    }).ToList();
            }
            if (str.Length == 0 && pgId > 0)
            {
                products = db.vProducts
                    .Where(c => c.productGroupId == pgId ).Select(c => new mdlProducts()
                    {
                        productId = c.productId,
                        productName = c.productName,
                        productGroupId = c.productGroupId,
                        productGroupNameX = c.productGroupName
                    }).ToList();
            }

            return Json(products, JsonRequestBehavior.AllowGet);

        }


        public JsonResult SaveProducts(string[] d)
        {
            var result = false;
           // d[] Contains product Info as Array
           try
           {
               var s = d;
               var pId = Convert.ToInt32(d[0]);
                if (pId!= 0) //in Edit mode
                {
                    tblProduct products =
                        db.tblProducts.SingleOrDefault(x => x.productId == pId);
                    products.productName = d[1];
                    products.productGroupId = Convert.ToInt32(d[2]);
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblProduct products = new tblProduct();
                    products.productId = pId;
                    products.productName = d[1];
                    products.productGroupId = Convert.ToInt32(d[2]);
                    db.tblProducts.Add(products);
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

        public JsonResult DeleteProduct(int pId)
        {
            var result = false;
            try
            {
                tblProduct products = db.tblProducts.Where(x => x.productId == pId).SingleOrDefault();
                if (products != null)
                {
                    db.tblProducts.Remove(products);
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

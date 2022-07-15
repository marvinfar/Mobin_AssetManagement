using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class outputFactorController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();


     public ActionResult outputFactorView()
        {
            return View("outputFactorView");
        }
        public JsonResult GetProductDetailsList()
        {// for Select Combobox in add or edit modal form
            
            List<mdlProductDetails> productDetailses = db.vProductDetails.Select(x => new mdlProductDetails()

            {
                pdId = x.pdId,
                productId = x.productId,
                productName = x.productName,
                productGroupName = x.productGroupName,
                pBrand = x.pBrand,
                brandName = x.brandName,
                pMaterial = x.pMaterial,
                materialName = x.materialName,
                pColor = x.pColor,
                colorName = x.colorName,
                pSize = x.pSize,
                sizeName = x.sizeName,
                pGender = x.pGender,
                genderName = x.genderName,
                pCountry = x.pCountry,
                countryName = x.countryName,
                pDescription = x.pDescription,
                pImage = x.pImage

            }).ToList();

            return Json(productDetailses, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetProductsById(int productsId)
        {
            tblProduct model = db.tblProducts.Where(x => x.productId == productsId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(model, Formatting.Indented,
                new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });

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
                                   .Where(c => c.productGroupId == pgId && c.productName.Contains(str)).Select(c => new mdlProducts()
                                   {
                                       productId = c.productId,
                                       productName = c.productName,
                                       productGroupId = c.productGroupId,
                                       productGroupNameX = c.productGroupName
                                   }).ToList();

            }
            if (str.Length > 0 && pgId == -1)
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
                    .Where(c => c.productGroupId == pgId).Select(c => new mdlProducts()
                    {
                        productId = c.productId,
                        productName = c.productName,
                        productGroupId = c.productGroupId,
                        productGroupNameX = c.productGroupName
                    }).ToList();
            }

            return Json(products, JsonRequestBehavior.AllowGet);

        }

        public JsonResult GetMaxOfField(string tblName,string fieldName)
        {
            int max = 0;

            using (SqlConnection connection = new SqlConnection(publicClassController.connectionString))
            {
                var strSql = "SELECT MAX("+ fieldName + ") AS MaxFeild FROM "+ tblName;
                SqlCommand command = new SqlCommand(strSql, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    max =Convert.ToInt32(reader["MaxFeild"]);
                }
            }

            max = max + 1;
            return Json(max, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveFactorMainInfo(string[] d)
        {
            var result = 0;
            // d[] Contains FactorMain Info as Array
            try
            {
                var inpFactorId = Convert.ToInt32(d[0]);
                
                tblOutputFactorMain factorMain = new tblOutputFactorMain();
                factorMain.outFactorId = Convert.ToInt32(d[0]);
                factorMain.CustomerId = Convert.ToInt16(d[1]);
                factorMain.outFactorDate = DateTime.Parse(d[2]);
                factorMain.outFactorTime = d[3];
                factorMain.userId = d[4]==""? 1:Convert.ToInt32(d[4]);
                factorMain.outFactorDesc = d[5];
                factorMain.outFactorTotalPrice = Convert.ToDecimal(d[6]);
                factorMain.payType = Convert.ToInt16(d[7]);
                db.tblOutputFactorMains.Add(factorMain);
                db.SaveChanges();
                result = factorMain.outFactorId;
                
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveFactorDetailInfo(string[] d)
        {
            var result = false;
            // d[] Contains FactorDetail Info as Array
            try
            {
               tblOutputFactorDetail factorDetail = new tblOutputFactorDetail();
                    factorDetail.outFactorId = Convert.ToInt32(d[0]);
                    factorDetail.outFactorDetailId = Convert.ToInt32(d[1]);
                    factorDetail.pdId = Convert.ToInt32(d[2]);
                    factorDetail.quantity = Convert.ToInt16(d[3]);
                    factorDetail.unitPrice =  Convert.ToDecimal(d[4]);
                    factorDetail.discount =  Convert.ToDouble(d[5]);
                    factorDetail.totalPrice = Convert.ToDecimal(d[6]);
                    factorDetail.outDetailDesc = d[7];
                    db.tblOutputFactorDetails.Add(factorDetail);
                    db.SaveChanges();

                publicClassController.UpdateMojoodi(Convert.ToInt32(d[2]), -Convert.ToInt32(d[3]));

                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveFactorPayList(string[] d)
        {
            var result = false;
            // d[] Contains FactorPayList Info as Array
            try
            {
                tbloutPayment factOutPayment = new tbloutPayment();
                factOutPayment.outFactorId = Convert.ToInt32(d[0]);
                factOutPayment.radif = Convert.ToInt16(d[1]);
                factOutPayment.checkDate = DateTime.Parse(d[2]);
                factOutPayment.giveMoney = Convert.ToDecimal(d[3]);
                factOutPayment.paid= Convert.ToInt16(d[4]);
                factOutPayment.paidDate =d[5]=="" ?DateTime.Parse("1900/01/01"): DateTime.Parse(d[5]);
                db.tbloutPayments.Add(factOutPayment);
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

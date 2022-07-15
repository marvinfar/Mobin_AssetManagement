using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;


namespace KOP_Store.Controllers
{
    public class takhsisAmvalController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();
        
        public ActionResult takhsisAmvalView()
        {
            return View("takhsisAmvalView");
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

        public JsonResult GetAmvalProduct(string n)
        {//determine which amval assigned to which product
            vAmval vr = db.vAmvals.Where(x => x.amval == n).SingleOrDefault();

            return Json(vr, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetAmvalCustomer(string n)
        {
            List<vAmvalCustomer> vr = db.vAmvalCustomers.Where(x => x.amval == n).ToList();
            
            return Json(vr, JsonRequestBehavior.AllowGet);
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
        public JsonResult SaveAmval(string[] d)
        {
            var result = false;
            try
            {
                string n = d[2];

                List<tblTakhsisAmval> takhsisCheck = null;
                takhsisCheck=db.tblTakhsisAmvals.Where(x => x.amval == n).ToList();

                if (takhsisCheck.Count>0 && takhsisCheck[0].pdId != Convert.ToInt32((d[1])))
                {
                    //این شماره اموال قبلا به کالای دیگری اختصاص یافته است
                    return Json(false, JsonRequestBehavior.AllowGet);
                }
                tblEsghatAmval esghatCheck = db.tblEsghatAmvals.SingleOrDefault(x => x.amval == n);
                if (esghatCheck != null)
                {
                    //این شماره اموال قبلا اسقاط شده است
                    return Json(false, JsonRequestBehavior.AllowGet);
                }

                tblTakhsisAmval takhsis =
                    db.tblTakhsisAmvals.SingleOrDefault(x => x.amval == n && x.active == true);
                if (takhsis != null)
                {
                    takhsis.active = false;
                    db.SaveChanges();
                }

                tblTakhsisAmval takhsisAmval= new tblTakhsisAmval();
                takhsisAmval.customerId= Convert.ToInt16(d[0]);
                takhsisAmval.pdId = Convert.ToInt32((d[1]));
                takhsisAmval.amval = d[2];
                takhsisAmval.deliverDate= DateTime.Parse(d[3]);
                takhsisAmval.active = Convert.ToBoolean(d[4]);
                takhsisAmval.esghat = Convert.ToBoolean(d[5]);
                takhsisAmval.description = d[6];
                takhsisAmval.userId = Convert.ToInt32(d[7]);
                db.tblTakhsisAmvals.Add(takhsisAmval);
                db.SaveChanges();
                tblAmvalAction amvalAction = new tblAmvalAction();
                amvalAction.amval = takhsisAmval.amval;
                amvalAction.actionId = Convert.ToInt16(d[8]); //Assign Or Checkout Amval
                amvalAction.actionDate = takhsisAmval.deliverDate;
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

        public JsonResult GetGardeshAmvalCustomer(string para, short searchType)
        {
            //searchType=1 گردش اموال  //searchType=2   اموال به نام کاربر
            //para used for amval number OR Cus ID just one
            List<vGardeshAmval> vr = null;
            if (searchType == 1)
            {
                 vr = db.vGardeshAmvals.Where(x => x.amval == para).OrderBy(x=>x.active)
                    .ToList();
            }
            else if(searchType==2)
            {
                int cusId = Convert.ToInt32(para);
                vr = db.vGardeshAmvals.Where(x => x.customerId == cusId && x.active==true).OrderBy(x => x.deliverDate).ToList();
              
            }

            return Json(vr, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteProductDetails(int pdId)
        {
            var result = false;
            try
            {
                tblProductsDetail productsDetail = db.tblProductsDetails.Where(x => x.pdId == pdId).SingleOrDefault();
                if (productsDetail != null)
                {
                    db.tblProductsDetails.Remove(productsDetail);
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

        public JsonResult ApplyFilter(string strSql)
        {
            
            List<mdlProductDetails> returnList = new List<mdlProductDetails>();
         
           

            using (SqlConnection connection = new SqlConnection(publicClassController.connectionString))
            {
                SqlCommand command = new SqlCommand(strSql, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();
                
                if (reader.HasRows)
                {
                    short?[] m = { null, null, null, null, null, null };
                    string[] n = {"pBrand", "pMaterial", "pColor", "pSize", "pGender", "pCountry"};
                    while (reader.Read())
                    {
                         // Null(-1) Value convert to empty value
                         for (int i = 0; i <= 5; i++)
                         {
                             if (reader[n[i]].ToString() == "")
                             {
                                 m[i] = null;
                             }
                             else
                             {
                                 m[i] =(short) reader[n[i]];
                             }
                         }
                         mdlProductDetails products = new mdlProductDetails();
                         products.pdId = (int) reader["pdId"];
                         products.productId = (int) reader["productId"];
                         products.productName = reader["productName"].ToString();
                         products.productGroupName = reader["productGroupName"].ToString();
                         
                         products.pBrand =  m[0];
                         products.brandName = reader["brandName"].ToString();
                         products.pBrand = m[1];
                         products.materialName = reader["materialName"].ToString();
                         products.pBrand = m[2];
                         products.colorName = reader["colorName"].ToString();
                         products.pBrand = m[3];
                         products.sizeName = reader["sizeName"].ToString();
                         products.pBrand = m[4];
                         products.genderName = reader["genderName"].ToString();
                         products.pBrand = m[5];
                         products.countryName = reader["countryName"].ToString();
                         products.pDescription = reader["pDescription"].ToString();
                         products.pImage = reader["pImage"].ToString();
                         returnList.Add(products);
                    }
                }   
                connection.Close();
            }
            return Json(returnList, JsonRequestBehavior.AllowGet);
        }
    }

}

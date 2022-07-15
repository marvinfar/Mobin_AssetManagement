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
using WebGrease.Css.Ast.Selectors;
using WebGrease.Css.Extensions;


namespace KOP_Store.Controllers
{
    public class esghatAmvalController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();
        
        public ActionResult esghatAmvalView()
        {
            return View("esghatAmvalView");
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
        public JsonResult CheckAmvalInEsghat(string n)
        {
            bool inEsghat = false;
            try
            {

                tblEsghatAmval esghat = db.tblEsghatAmvals.SingleOrDefault(x => x.amval == n);
                if (esghat != null)
                {
                    // اگر قبلا اسقاط شده بود
                    inEsghat = true;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(inEsghat, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CheckAmvalInTakhsis(string n)
        {
          vAmvalCustomer takhsis = db.vAmvalCustomers.SingleOrDefault(x => x.amval == n);
                //جستجو در این ویوو یعنی اموال ممکن است تحویل شخصی شده باشد اگر نه که 
                //Takhsis = null است
               
            return Json(takhsis, JsonRequestBehavior.AllowGet);
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


        public JsonResult SaveEsghatAmval(string[] d)
        {
            var result = false;
            try
            {
                int radif = Convert.ToInt32(d[0]);//ردیف تخصیصی که اموال در اختیار آن شخص بود(active=true)

                tblTakhsisAmval takhsis =
                    db.tblTakhsisAmvals.SingleOrDefault(x => x.radif == radif);
                
                    takhsis.active = false;
                    db.SaveChanges();
                
                tblTakhsisAmval takhsisAmval= new tblTakhsisAmval();
                takhsisAmval.customerId = takhsis.customerId;
                takhsisAmval.pdId = takhsis.pdId;
                takhsisAmval.amval = takhsis.amval;
                takhsisAmval.deliverDate= DateTime.Parse(d[4]);
                takhsisAmval.active = false;
                takhsisAmval.esghat = true;
                takhsisAmval.description = d[5];
                takhsisAmval.userId = Convert.ToInt32(d[6]);
                db.tblTakhsisAmvals.Add(takhsisAmval);
                db.SaveChanges();
                // Save in Esghat Table
                tblEsghatAmval esghat = new tblEsghatAmval();
                esghat.amval = takhsisAmval.amval;
                esghat.customerId= takhsisAmval.customerId;
                esghat.pdId= takhsisAmval.pdId;
                esghat.esghatDate = takhsisAmval.deliverDate;
                esghat.esghatDescription= takhsisAmval.description;
                db.tblEsghatAmvals.Add(esghat);
                db.SaveChanges();
                tblAmvalAction amvalAction = new tblAmvalAction();
                amvalAction.amval = esghat.amval;
                amvalAction.actionId = 4; //Abortion Amval
                amvalAction.actionDate = esghat.esghatDate;
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

        public JsonResult GetEsghatAmvalList(string[] para)
        {
            //para[0]=amval para[1,2]=date1,2
            List<vEshghatAmval> vr = null;
            string n;
            n = para[0];

            DateTime d1 = Convert.ToDateTime(para[1]==""? "1900/01/01" : para[1]);
            DateTime d2 = Convert.ToDateTime(para[2] == "" ? "1900/01/01" : para[2]);
            

            if (n != "" && para[1] == "")
            {
                // search just by amval
                vr = db.vEshghatAmvals.Where(x => x.amval == n).OrderBy(x => x.myDate)
                    .ToList();
            }
            else if(n=="" && para[1]!="")
            {
                vr = db.vEshghatAmvals.Where(x => x.esghatDate >= d1 && x.esghatDate <= d2).OrderBy(x => x.myDate)
                    .ToList();
            }
            else if (n!= "" && para[1] != "")
            {
                vr = db.vEshghatAmvals.Where(x => (x.esghatDate >=d1 && x.esghatDate <=d2) && x.amval==n).OrderBy(x => x.myDate)
                    .ToList();
            }else if ( string.Concat(para)=="") {
                vr = db.vEshghatAmvals.Where(x => (x.amval!="")).OrderBy(x => x.myDate)
                    .ToList();
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

using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using System.Web.Util;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;


namespace KOP_Store.Controllers
{
    public class defAmvalProductController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();
        
        public ActionResult defAmvalProductView()
        {
            return View("defAmvalProductView");
        }
        
        public JsonResult GetAmvalList(string[] d)
        {
            List<vAmval> amvals = new List<vAmval>();
            if (d == null)
            {//All Amval List No Condition
                amvals = db.vAmvals.Where(x => x.amval!="").ToList();
            }
            else
            {
                short op = Convert.ToInt16(d[0]);
                string val = d[1];
                switch (op)
                {
                    case 1: //Search by amval
                        amvals = db.vAmvals.Where(x => x.amval.Contains(val)).ToList();
                        break;
                    case 2: //Search by SAP
                        amvals = db.vAmvals.Where(x => x.sapPR.Contains(val)).ToList();
                        break;
                    case 3: //Search by productname 
                        amvals = db.vAmvals.Where(x => x.productNameX.Contains(val)).ToList();
                        break;
                    case 4: //Search by serial
                        amvals = db.vAmvals.Where(x => x.serialNumber.Contains(val)).ToList();
                        break;
                    case 5: //Search by date
                        DateTime d1 = Convert.ToDateTime(d[1] == "" ? "1900/01/01" : d[1]);
                        DateTime d2 = Convert.ToDateTime(d[2] == "" ? "1900/01/01" : d[2]);
                        amvals = db.vAmvals.Where(x => (x.buyDate >= d1 && x.buyDate <= d2)).ToList();
                        break;
                }
            }

            vAmvalCustomer temp = new vAmvalCustomer();
            string an = "";
            for (int i = 0; i < amvals.Count; i++)
            {
                an = amvals[i].amval;
                temp=db.vAmvalCustomers.Where(x => x.amval == an).SingleOrDefault();
                if (temp != null)
                {
                    amvals[i].description = amvals[i].description + " هم اکنون تحویل-" + temp.customerFName + " " +
                                            temp.customerLName;
                }
            }
            return Json(amvals, JsonRequestBehavior.AllowGet);
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
                string n = d[0];

                tblAmval amvalCheck = db.tblAmvals.SingleOrDefault(x => x.amval == n);

                if (amvalCheck != null)
                {
                    //این شماره اموال قبلا ثبت شده است
                    return Json(false, JsonRequestBehavior.AllowGet);
                }

                tblEsghatAmval esghatCheck = db.tblEsghatAmvals.SingleOrDefault(x => x.amval == n);
                if (esghatCheck != null)
                {
                    //این شماره اموال قبلا اسقاط شده است
                    return Json(false, JsonRequestBehavior.AllowGet);
                }

                tblAmval amval = new tblAmval();
                amval.amval = d[0];
                amval.pdId = Convert.ToInt32((d[1]));
                amval.buyDate = DateTime.Parse(d[2]);
                amval.buyPrice = Convert.ToDecimal(d[3]);
                amval.sapPR = d[4];
                amval.serialNumber = d[5];
                amval.barcodeNumber = d[6];
                amval.description = d[7];
                amval.userId = Convert.ToInt32(d[8]);
                db.tblAmvals.Add(amval);
                db.SaveChanges();
                tblAmvalAction amvalAction = new tblAmvalAction();
                amvalAction.amval = d[0];
                amvalAction.actionId = 1; //Define Amval
                amvalAction.actionDate= DateTime.Parse(d[2]);
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

        public JsonResult UpdateAmval(string[] d)
        {

            var result = false;
            try
            {
                string n = d[0];
                
                tblAmval amval = db.tblAmvals.SingleOrDefault(x => x.amval == n);

                amval.amval = n;
                amval.pdId = Convert.ToInt32((d[1]));
                amval.buyDate = Convert.ToDateTime(d[2]);
                amval.buyPrice = Convert.ToDecimal(d[3]);
                amval.sapPR = d[4];
                amval.serialNumber = d[5];
                amval.barcodeNumber = d[6];
                amval.description = d[7];
                amval.userId = Convert.ToInt32(d[8]);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
   
        public JsonResult DeleteAmval(string n)
        {
            var result = false;
            try
            {
                tblAmval amval= db.tblAmvals.Where(x => x.amval== n).SingleOrDefault();
                if (amval!= null)
                {
                    db.tblAmvals.Remove(amval);
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

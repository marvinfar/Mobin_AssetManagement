using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;


namespace KOP_Store.Controllers
{
    public class inputFactorController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        public object CommandType { get; private set; }


        // GET: productGroup
        //public ActionResult Index()
        //{
        //    return View();
        //}
        public ActionResult inputFactorView()
        {
            return View("inputFactorView");
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
                
                tblInputFactorMain factorMain = new tblInputFactorMain();
                factorMain.inpFactorId = Convert.ToInt32(d[0]);
                factorMain.CustomerId = Convert.ToInt16(d[1]);
                factorMain.inpFactorDate = DateTime.Parse(d[2]);
                factorMain.inpFactorTime = d[3];
                factorMain.userId = d[4]==""? 1:Convert.ToInt32(d[4]);
                factorMain.inpFactorDesc = d[5];
                factorMain.inpFactorTotalPrice = Convert.ToDecimal(d[6]);
                factorMain.payType = Convert.ToInt16(d[7]);
                db.tblInputFactorMains.Add(factorMain);
                db.SaveChanges();
                result = factorMain.inpFactorId;
                
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
               tblInputFactorDetail factorDetail = new tblInputFactorDetail();
                    factorDetail.inpFactorId = Convert.ToInt32(d[0]);
                    factorDetail.inpFactorDetailId = Convert.ToInt32(d[1]);
                    factorDetail.pdId = Convert.ToInt32(d[2]);
                    factorDetail.quantity = Convert.ToInt16(d[3]);
                    factorDetail.unitPrice =  Convert.ToDecimal(d[4]);
                    factorDetail.discount =  Convert.ToDouble(d[5]);
                    factorDetail.totalPrice = Convert.ToDecimal(d[6]);
                    factorDetail.inpDetailDesc = d[7];
                    db.tblInputFactorDetails.Add(factorDetail);
                    db.SaveChanges();
                    
                    publicClassController.UpdateMojoodi(Convert.ToInt32(d[2]), Convert.ToInt32(d[3]));
                    
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
                tblInpPayment factInpPayment = new tblInpPayment();
                factInpPayment.inpFactorId = Convert.ToInt32(d[0]);
                factInpPayment.radif = Convert.ToInt16(d[1]);
                factInpPayment.checkDate = DateTime.Parse(d[2]);
                factInpPayment.giveMoney = Convert.ToDecimal(d[3]);
                factInpPayment.paid= Convert.ToInt16(d[4]);
                factInpPayment.paidDate =d[5]=="" ?DateTime.Parse("1900/01/01") : DateTime.Parse(d[5]);
                db.tblInpPayments.Add(factInpPayment);
                db.SaveChanges();
                result = true;
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
            // var connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog='E:\MY VS CODE\KOP STORE\APP_DATA\KOPSTORE.MDF';Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
           
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
                         products.pMaterial = m[1];
                         products.materialName = reader["materialName"].ToString();
                         products.pColor = m[2];
                         products.colorName = reader["colorName"].ToString();
                         products.pSize = m[3];
                         products.sizeName = reader["sizeName"].ToString();
                         products.pGender = m[4];
                         products.genderName = reader["genderName"].ToString();
                         products.pCountry= m[5];
                         products.countryName = reader["countryName"].ToString();
                         products.pDescription = reader["pDescription"].ToString();
                         products.pImage = reader["pImage"].ToString();
                         returnList.Add(products);
                    }
                }   

            }
            return Json(returnList, JsonRequestBehavior.AllowGet);
        }

        

    }

}

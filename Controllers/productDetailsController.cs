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
    public class productDetailsController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();
        
        public ActionResult productDetailsView()
        {
            return View("productDetailsView");
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

        public JsonResult GetProductList()
        {// for Select Combobox in add or edit modal form

            List<mdlProducts> products = db.tblProducts.Select(x => new mdlProducts()

            {
                productId = x.productId,
                productName = x.productName
            }).ToList();

            return Json(products, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBrandList()
        {// for Select Combobox in add or edit modal form

            List<mdlBrand> brands = db.tblBrands.Select(x => new mdlBrand()

            {
                brandId = x.brandID,
                brandName = x.brandName
            }).ToList();

            return Json(brands, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMaterialList()
        {// for Select Combobox in add or edit modal form

            List<mdlMaterial> brands = db.tblMaterials.Select(x => new mdlMaterial()

            {
                materialId = x.materialId,
                materialName = x.materialName
            }).ToList();

            return Json(brands, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetColorList()
        {// for Select Combobox in add or edit modal form

            List<mdlColor> colors = db.tblColors.Select(x => new mdlColor()

            {
                colorId = x.colorId,
                colorName = x.colorName
            }).ToList();

            return Json(colors, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetSizeList()
        {// for Select Combobox in add or edit modal form

            List<mdlSize> sizes = db.tblSizes.Select(x => new mdlSize()

            {
                sizeId = x.sizeId,
                sizeName = x.sizeName
            }).ToList();

            return Json(sizes, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCountryList()
        {// for Select Combobox in add or edit modal form

            List<mdlCountry> countries= db.tblCountries.Select(x => new mdlCountry()

            {
                countryId= x.countryId,
                countryName= x.countryName
            }).ToList();

            return Json(countries, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetGenderList()
        {// for Select Combobox in add or edit modal form

            List<mdlGender> genders = db.tblGenders.Select(x => new mdlGender()

            {
                genderId = x.genderId,
                genderName = x.genderName
            }).ToList();

            return Json(genders, JsonRequestBehavior.AllowGet);
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


        public JsonResult SaveProductDetails(string[] d)
        {
            var result = false;
            // d[] Contains productDetails Info as Array
            try
            {
                var s = d;
                var pdId = Convert.ToInt32(d[0]);
                short?[] arr={ null, null ,null, null, null, null };
                for (int i = 2; i <= 7; i++)
                {
                    if (d[i]=="-1")
                    {
                        arr[i-2] = null;
                    }
                    else
                    {
                        arr[i - 2] = Convert.ToInt16(d[i]);
                    }
                }

                if (pdId != 0) //in Edit mode
                {
                    tblProductsDetail productsDetail =
                        db.tblProductsDetails.SingleOrDefault(x => x.pdId == pdId);
                    
                    productsDetail.productId= Convert.ToInt32(d[1]);
                    productsDetail.pBrand = arr[0];
                    productsDetail.pMaterial = arr[1];
                    productsDetail.pColor = arr[2];
                    productsDetail.pSize = arr[3];
                    productsDetail.pGender = arr[4];
                    productsDetail.pCountry = arr[5];
                    productsDetail.pDescription = d[8];
                    productsDetail.pImage= d[9];
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblProductsDetail productsDetail = new tblProductsDetail();
                    productsDetail.pdId = pdId;
                    productsDetail.productId = Convert.ToInt32(d[1]);
                    productsDetail.pBrand = arr[0];
                    productsDetail.pMaterial = arr[1];
                    productsDetail.pColor = arr[2];
                    productsDetail.pSize = arr[3];
                    productsDetail.pGender = arr[4]; 
                    productsDetail.pCountry = arr[5];
                    productsDetail.pDescription = d[8];
                    productsDetail.pImage = d[9];
                    db.tblProductsDetails.Add(productsDetail);
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

        public JsonResult GetGroupOfProduct(int productId)
        {
            List<mdlProducts> products = null;
            
            
                products = db.vProducts
                    .Where(c => c.productId == productId).Select(c => new mdlProducts()
                    {
                        productGroupNameX = c.productGroupName
                    }).ToList();

                return Json(products, JsonRequestBehavior.AllowGet);
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

        public JsonResult ProductSearchFilter(string str)
        {

            List<vProductDetailFilter> returnList = db.vProductDetailFilters.Where(x=>x.productNameX.Contains(str)).ToList();

            return Json(returnList, JsonRequestBehavior.AllowGet);
        }
    }

}

using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class repController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        public ActionResult repMasrafiView()
        {
            return View("repMasrafiView");
        }
        public ActionResult repAmvalView()
        {
            return View("repAmvalView");
        }

        public JsonResult ReportMasrafiVoroodKhorooj(string[] d)
        {
            DateTime d1 = Convert.ToDateTime(d[0] == "" ? "1900/01/01" : d[0]);
            DateTime d2 = Convert.ToDateTime(d[1] == "" ? "2050/01/01" : d[1]);

            if (d[2] == "vOutputFactorFull")
            {
                List<mdlvIOFactor> vo = null;
                vo = db.vOutputFactorFulls.Where(x => x.outFactorDate >= d1 && x.outFactorDate <= d2)
                    .OrderBy(x => x.outFactorDate).ThenBy(x => x.outFactorId).Select(x => new mdlvIOFactor()
                        {
                            FactorId = x.outFactorId,
                            CustomerId = x.CustomerId,
                            CustomerName = x.CustomerName,
                            productName = x.productName,
                            brandName = x.brandName,
                            colorName = x.colorName,
                            materialName = x.materialName,
                            sizeName = x.sizeName,
                            countryName = x.countryName,
                            genderName = x.genderName,
                            pDescription = x.pDescription,
                            myDate = x.myDate,
                            quantity = x.quantity,
                            FactorDesc = x.outFactorDesc
                        }
                    ).ToList();
                return Json(vo, JsonRequestBehavior.AllowGet);
            }
            else
            {
                List<mdlvIOFactor> vi = null;
                vi = db.vInputFactorFulls.Where(x => x.inpFactorDate >= d1 && x.inpFactorDate <= d2)
                    .OrderBy(x => x.inpFactorDate).ThenBy(x => x.inpFactorId).Select(x => new mdlvIOFactor()
                        {
                            FactorId = x.inpFactorId,
                            CustomerId = x.CustomerId,
                            CustomerName = x.CustomerName,
                            productName = x.productName,
                            brandName = x.brandName,
                            colorName = x.colorName,
                            materialName = x.materialName,
                            sizeName = x.sizeName,
                            countryName = x.countryName,
                            genderName = x.genderName,
                            pDescription = x.pDescription,
                            myDate = x.myDate,
                            quantity = x.quantity,
                            FactorDesc = x.inpFactorDesc
                        }
                    ).ToList();
                return Json(vi, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ReportMasrafiMojoodi(string[] d)
        {
            int nu = Convert.ToInt32(d[0]);
            List<vProductDetailFilter> vp = null;
            if (d[1] == "<")
            {
                vp = db.vProductDetailFilters.Where(x => x.number < nu)
                    .OrderBy(x => x.number).ThenBy(x => x.productNameX)
                    .ToList();
            }
            else
            {
                vp = db.vProductDetailFilters.Where(x => x.number > nu)
                    .OrderBy(x => x.number).ThenBy(x => x.productNameX)
                    .ToList();
            }

            return Json(vp, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReportMasrafiProductCusDate(string strSql)
        {
            List<mdlvIOFactor> returnList = new List<mdlvIOFactor>();
            try
            {

                using (SqlConnection connection = new SqlConnection(publicClassController.connectionString))
                {
                    SqlCommand command = new SqlCommand(strSql, connection);
                    connection.Open();
                    SqlDataReader reader = command.ExecuteReader();
                    
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            mdlvIOFactor products = new mdlvIOFactor();
                            products.productName = reader["productName"].ToString();
                            products.brandName = reader["brandName"] == null ? "" : reader["brandName"].ToString();
                            products.colorName = reader["colorName"] == null ? "" : reader["colorName"].ToString();
                            products.materialName =
                                reader["materialName"] == null ? "" : reader["materialName"].ToString();
                            products.sizeName = reader["sizeName"] == null ? "" : reader["sizeName"].ToString();
                            products.genderName = reader["genderName"] == null ? "" : reader["genderName"].ToString();
                            products.countryName =
                                reader["countryName"] == null ? "" : reader["countryName"].ToString();
                            products.pDescription =
                                reader["pDescription"] == null ? "" : reader["pDescription"].ToString();
                            products.quantity = Convert.ToInt16(reader["quantity"].ToString());
                            products.CustomerName = reader["CustomerName"].ToString();
                            products.myDate = reader["myDate"].ToString();
                            products.detailDesc = reader["outDetailDesc"].ToString()==""? reader["outFactorDesc"].ToString(): reader["outDetailDesc"].ToString();
                            returnList.Add(products);
                        }
                    }
                    connection.Close();
                }
            }

            catch (Exception ex)
            {
                throw ex;
            }

            return Json(returnList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReportMasrafiTajmiCustomer(string[] d)
        {
            DateTime d1, d2; //if null means all data must be fetch
            short op; //useLess
            d1 = Convert.ToDateTime(d[1] == "NULL" ? "1900-01-01" : d[1]);
            d2 = Convert.ToDateTime(d[2] == "" ? "2050-01-01" : d[2]);
            op = Convert.ToInt16(d[0]);

            List<mdlvIOFactor> returnList = null;
            
            returnList = db.vOutputFactorFulls.Where(x => x.outFactorDate >= d1 && x.outFactorDate <= d2)
                .OrderBy(x => x.CustomerId).Select(x => new mdlvIOFactor()
                {
                    CustomerId = x.CustomerId,
                    CustomerName = x.CustomerName,
                    quantity = x.quantity
                }).ToList();

            short? ci = returnList[0].CustomerId;
            int sum = 0;
            
            List<myclass> tempList = new List<myclass>();
            for (int i = 0; i < returnList.Count; i++)
            {
                if (returnList[i].CustomerId == ci)
                {
                    sum = sum + returnList[i].quantity;
                }
                else
                {
                    myclass temp = new myclass();
                    temp.CNAME= returnList[i - 1].CustomerName;
                    temp.QUANTITY= sum;
                    tempList.Add(temp);
                    sum = returnList[i].quantity;
                    ci = returnList[i].CustomerId;
                }
            }
            myclass temp1 = new myclass();
            temp1.CNAME = returnList[returnList.Count-1].CustomerName;
            temp1.QUANTITY = sum;
            tempList.Add(temp1);

            return Json(tempList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ReportMasrafiTajmiProduct(string[] d)
        {
            short op; //useLess
            op = Convert.ToInt16(d[0]);

            List<sp_TajmiMasrafiProduct_Result> returnList = db.sp_TajmiMasrafiProduct( d[1], d[2]).ToList();

            int? pi = returnList[0].pdId;
            int sum = 0;

            List<myclass> tempList = new List<myclass>();
            for (int i = 0; i < returnList.Count; i++)
            {
                if (returnList[i].pdId == pi)
                {
                    sum = sum + returnList[i].quantity;
                }
                else
                {
                    myclass temp = new myclass();
                    temp.CNAME = returnList[i - 1].productNameX;
                    temp.QUANTITY = sum;
                    tempList.Add(temp);
                    sum = returnList[i].quantity;
                    pi = returnList[i].pdId;
                }
            }
            myclass temp1 = new myclass();
            temp1.CNAME = returnList[returnList.Count - 1].productNameX;
            temp1.QUANTITY = sum;
            tempList.Add(temp1);

            return Json(tempList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult RepMasrafiTafsil(string[] d)
        {
            short op = Convert.ToInt16(d[0]); //sort type 1 user2 date
           
            List<sp_TafsilUsersDate_Result> returnList = null;
            if (op != 1)
            {
                returnList = db.sp_TafsilUsersDate(d[1], d[2]).OrderBy(x => x.outFactorDate).ToList();
            }
            else
            {
                returnList = db.sp_TafsilUsersDate(d[1], d[2]).OrderBy(x => x.CustomerId).ToList();
            }

            return Json(returnList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadFromActionTable()
        {
            List<Actions> vo = null;
            vo = db.tblActions.Where(x=>x.actionId>0).Select(x=> new Actions()
            {
                acFaName= x.actionFarsiName,
                acId = x.actionId
            }).ToList();
            return Json(vo, JsonRequestBehavior.AllowGet);

        }

        public JsonResult RepServices(string[] para)
        {
            DateTime d1, d2; //if null means all data must be fetch
            short vId = Convert.ToInt16(para[0]);
            d1 = Convert.ToDateTime(para[1] == "" ? "1900-01-01" : para[1]);
            d2 = Convert.ToDateTime(para[2] == "" ? "2050-01-01" : para[2]);

            List<viewService> vs = new List<viewService>();
            try
            {
                if (vId != 0)
                {
                    vs = db.vServiceFulls.Where(x =>x.vendorId==vId &&  x.serviceDate >= d1 && x.serviceDate <= d2).OrderBy(x => x.serviceDate).Select(x => new viewService()
                    {
                        serviceId = x.serviceId,
                        productNameX = x.productNameX,
                        amval = x.amval,
                        customerFName = x.customerFName,
                        customerLName = x.customerLName,
                        vendorId = x.vendorId,
                        companyName = x.companyName,
                        vendorName = x.vendorName,
                        serviceDate = x.serviceDate,
                        myDate = x.myDate,
                        servicePrice = x.servicePrice,
                        serviceTotalPrice = x.serviceTotalPrice,
                        serviceDescription = x.serviceDescription,
                        serviceDetailDesc = x.serviceDetailDesc
                    }).ToList();
                }
                else
                {
                    vs = db.vServiceFulls.Where(x => x.serviceDate >= d1 && x.serviceDate <= d2).OrderBy(x => x.serviceDate).Select(x => new viewService()
                    {
                        serviceId = x.serviceId,
                        productNameX = x.productNameX,
                        amval = x.amval,
                        customerFName = x.customerFName,
                        customerLName = x.customerLName,
                        vendorId = x.vendorId,
                        companyName = x.companyName,
                        vendorName = x.vendorName,
                        serviceDate = x.serviceDate,
                        myDate = x.myDate,
                        servicePrice = x.servicePrice,
                        serviceTotalPrice = x.serviceTotalPrice,
                        serviceDescription = x.serviceDescription,
                        serviceDetailDesc = x.serviceDetailDesc
                    }).ToList();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
            return Json(vs, JsonRequestBehavior.AllowGet);
        }

        public JsonResult RepAmvalAssignToUser(string[] para)
        {
            int cid = Convert.ToInt32(para[0]);
            int all = Convert.ToInt32(para[1]);//all amval contains previously assigned
            List<sp_RepAmvalAssignToCustomer_Result> returnList = null;
            returnList = db.sp_RepAmvalAssignToCustomer(cid, all).ToList();
            return Json(returnList, JsonRequestBehavior.AllowGet);

        }

        public JsonResult RepGardeshAmvalHistory(string[] para)
        {
            string amn = para[0];
            DateTime d1 = Convert.ToDateTime(para[1] == "" ? "1900-01-01" : para[1]);
            DateTime d2 = Convert.ToDateTime(para[2] == "" ? "2050-01-01" : para[2]);
            List<vGardeshAmval> vr = null;
            if (para[0]!="" && para[1] == "")
            {
                vr = db.vGardeshAmvals.Where(x => x.amval == amn).OrderBy(x => x.deliverDate).ThenBy(x => x.active)
                    .ToList();
            }
            else if(para[0]!="" && para[1]!="")
            {
                vr = db.vGardeshAmvals.Where(x => x.amval == amn && x.deliverDate>=d1 && x.deliverDate<=d2).OrderBy(x => x.deliverDate).ThenBy(x => x.active)
                    .ToList();
            }
            else if (para[0] == "" && para[1] == "") //Tafkiki Kol amval bedoone Tarikh
            {
                vr = db.vGardeshAmvals.Where(x => x.amval != "" ).OrderBy(x => x.amval).ThenBy(x => x.deliverDate)
                    .ToList();
            }
            else if (para[0] == "" && para[1] != "")//Tafkiki Kol amval ba Tarikh
            {
                vr = db.vGardeshAmvals.Where(x => x.amval != "" && x.deliverDate>=d1 && x.deliverDate<=d2).OrderBy(x => x.amval).ThenBy(x => x.deliverDate)
                    .ToList();
            }
            return Json(vr, JsonRequestBehavior.AllowGet);
        }

        public JsonResult RepActionAmval(string[] para)
        {
            List<actionModelItem> vr = null;
            short act = Convert.ToInt16(para[0]);
            DateTime d1 = Convert.ToDateTime(para[1] == "" ? "1900-01-01" : para[1]);
            DateTime d2 = Convert.ToDateTime(para[2] == "" ? "2050-01-01" : para[2]);

            vr = db.vActionAmvals.Where(x => x.actionId == act && x.actionDate>=d1 && x.actionDate<=d2).OrderBy(x => x.actionDate).ThenBy(x => x.customerId)
                .Select(x => new actionModelItem()
                {
                    actionFarsiName = x.actionFarsiName,
                    amval = x.amval,
                    actionId = x.actionId,
                    productNameX = x.productNameX,
                    customerFName = x.customerFName,
                    customerLName = x.customerLName,
                    myDate=x.myDate
                }).ToList();
            return Json(vr, JsonRequestBehavior.AllowGet);
        }
    }

    public class viewService
    {
        public int serviceId { get; set; }
        public Nullable<System.DateTime> serviceDate { get; set; }
        public string myDate { get; set; }
        public Nullable<short> vendorId { get; set; }
        public string companyName { get; set; }
        public string vendorName { get; set; }
        public string serviceDescription { get; set; }
        public Nullable<decimal> serviceTotalPrice { get; set; }
        public string productNameX { get; set; }
        public string customerLName { get; set; }
        public string customerFName { get; set; }
        public Nullable<decimal> servicePrice { get; set; }
        public string serviceDetailDesc { get; set; }
        public string amval { get; set; }
    }
    public class myclass
    {
        public string CNAME { get; set; }
        public int QUANTITY { get; set; }
    }
    public class Actions
    {
        public string acFaName { get; set; }
        public int acId { get; set; }
    }
    public class actionModelItem
    {
        public string amval { get; set; }
        public short? actionId { get; set; }
        public string actionFarsiName { get; set; }
        public string productNameX { get; set; }
        public string customerFName { get; set; }
        public string customerLName { get; set; }
        public string myDate { get; set; }
    }
}


              
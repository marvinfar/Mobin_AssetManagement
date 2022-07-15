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
    public class vendorController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

         public ActionResult vendorView()
        {

            return View("vendorView");
        }
        
        public JsonResult GetVendorList()
        {
            
            List<mdlVendor> vendors= db.tblVendors.Select(x => new mdlVendor()

            {
                vendorId = x.vendorId,
                companyName = x.companyName,
                vendorName = x.vendorName,
                companyPhone = x.companyPhone,
                fax= x.fax,
                mobile= x.mobile,
                email= x.email,
                address = x.address
            }).ToList();

            return Json(vendors, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetVendorsById(int vendorId)
        {
            tblVendor vendor = (tblVendor) db.tblVendors.Where(x => x.vendorId == vendorId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(vendor, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveVendors(string[] d)
        {
            var result = false;
           // d[] Contains ID,Name as Array
           try
           {
               var s = d;
               var vendorId = Convert.ToInt16(d[0]);
                if (vendorId != 0) //in Edit mode
                {
                    tblVendor vendor= db.tblVendors.SingleOrDefault(x => x.vendorId== vendorId);
                    vendor.companyName= d[1];
                    vendor.vendorName= d[2];
                    vendor.companyPhone= d[3];
                    vendor.fax = d[4];
                    vendor.mobile= d[5];
                    vendor.email= d[6];
                    vendor.address= d[7];
                    db.SaveChanges();
                    result = true;
                }
                else
                {  
                    tblVendor vendor= new tblVendor();
                    vendor.vendorId = vendorId;
                    vendor.companyName = d[1];
                    vendor.vendorName = d[2];
                    vendor.companyPhone = d[3];
                    vendor.fax = d[4];
                    vendor.mobile = d[5];
                    vendor.email = d[6];
                    vendor.address = d[7];
                    db.tblVendors.Add(vendor);
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

            List<mdlVendor> returnList = new List<mdlVendor>();
            // var connectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog='E:\MY VS CODE\KOP STORE\APP_DATA\KOPSTORE.MDF';Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
            

            using (SqlConnection connection = new SqlConnection(publicClassController.connectionString))
            {
                SqlCommand command = new SqlCommand(strSql, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        mdlVendor vendor = new mdlVendor();
                        vendor.vendorId = (short)reader["vendorId"];
                        vendor.companyName = reader["companyName"].ToString();
                        vendor.vendorName = reader["vendorName"].ToString();
                        vendor.companyPhone = reader["companyPhone"].ToString();
                        vendor.fax = reader["fax"].ToString();
                        vendor.mobile = reader["mobile"].ToString();
                        vendor.email= reader["email"].ToString();
                        vendor.address = reader["address"].ToString();
                        returnList.Add(vendor);
                    }
                }
                connection.Close();
            }
            return Json(returnList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteVendor(int VendorId)
        {
            var result = false;
            try
            {
                tblVendor vendor= db.tblVendors.Where(x => x.vendorId == VendorId).SingleOrDefault();
                if (vendor != null)
                {
                    db.tblVendors.Remove(vendor);
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

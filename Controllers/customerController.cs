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
    public class customerController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

         public ActionResult customerView()
        {

            return View("customerView");
        }
        
        public JsonResult GetCustomerList()
        {
            
            List<mdlCustomer> customers= db.tblCustomers.Select(x => new mdlCustomer()

            {
                customerId = x.customerId,
                customerFName = x.customerFName,
                customerLName = x.customerLName,
                customerMobile = x.customerMobile,
                customerPhone = x.customerPhone,
                customerAddress = x.customerAddress,
                customerCompany = x.customerCompany
                
            }).ToList();

            return Json(customers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerById(int customerId)
        {
            tblCustomer customer = (tblCustomer) db.tblCustomers.Where(x => x.customerId == customerId)
                .SingleOrDefault();
            string value = string.Empty;
            value = JsonConvert.SerializeObject(customer, Formatting.Indented,
                new JsonSerializerSettings {ReferenceLoopHandling = ReferenceLoopHandling.Ignore});

            return Json(value, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveCustomers(string[] d)
        {
            var result = false;
           // d[] Contains ID,Name as Array
           try
           {
               var s = d;
               var customerId = Convert.ToInt16(d[0]);
                if (customerId != 0) //in Edit mode
                {
                    tblCustomer customer= db.tblCustomers.SingleOrDefault(x => x.customerId == customerId);
                    customer.customerFName= d[1];
                    customer.customerLName = d[2];
                    customer.customerMobile = d[3];
                    customer.customerPhone = d[4];
                    customer.customerAddress = d[5];
                    customer.customerCompany = d[6];
                    db.SaveChanges();
                    result = true;
                }
                else
                {  
                    tblCustomer customer= new tblCustomer();
                    customer.customerId = customerId;
                    customer.customerFName = d[1];
                    customer.customerLName = d[2];
                    customer.customerMobile = d[3];
                    customer.customerPhone = d[4];
                    customer.customerAddress = d[5];
                    customer.customerCompany = d[6];
                    db.tblCustomers.Add(customer);
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

            List<mdlCustomer> returnList = new List<mdlCustomer>();
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
                        mdlCustomer customer = new mdlCustomer();
                        customer.customerId = (short)reader["customerId"];
                        customer.customerFName = reader["customerFName"].ToString();
                        customer.customerLName = reader["customerLName"].ToString();
                        customer.customerMobile = reader["customerMobile"].ToString();
                        customer.customerPhone = reader["customerPhone"].ToString();
                        customer.customerAddress = reader["customerAddress"].ToString();
                        customer.customerCompany = reader["customerCompany"].ToString();

                        returnList.Add(customer);
                    }
                }
                connection.Close();
            }
            return Json(returnList, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteCustomer(int CustomerId)
        {
            var result = false;
            try
            {
                tblCustomer customer= db.tblCustomers.Where(x => x.customerId == CustomerId).SingleOrDefault();
                if (customer != null)
                {
                    db.tblCustomers.Remove(customer);
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

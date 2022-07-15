using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class publicClassController : Controller
    {
        //public static string  connectionString = "Server = .; Database = KOPSTORE.MDF; Trusted_Connection = True;";
        public static string connectionString = @"Server=PDCVW002;Database=KOPSTORE;User Id = sa; Password=Man13622004a;";

        public static void UpdateMojoodi(int pdid, int num)
        {
            using (SqlConnection connection = new SqlConnection(publicClassController.connectionString))
            {
                string strSql = "select pdid  from tblMojoodi where pdid=" + pdid;
                SqlCommand command = new SqlCommand(strSql, connection);
                connection.Open();
                SqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    strSql = "UPDATE tblMojoodi SET number=number+" + num +
                             " where pdid=" + pdid;
                    connection.Close();
                    connection.Open();
                    command = new SqlCommand(strSql,connection);
                    command.ExecuteNonQuery();
                    
                }
                else
                {
                    strSql = "INSERT INTO tblMojoodi (pdid,number) VALUES(" + pdid + "," + num+")";
                    connection.Close();
                    connection.Open();
                    command = new SqlCommand(strSql, connection);
                    command.ExecuteNonQuery();
                }

            }
        }

        public  ActionResult CheckMojoodi(string[] d)
        {
            KOPStoreEntities db = new KOPStoreEntities();
            int pdid = Convert.ToInt32(d[0]);
            int num = Convert.ToInt32(d[1]);
            tblMojoodi model = db.tblMojoodis.Where(x => x.pdid == pdid)
                .SingleOrDefault();
            bool NoExist = false;
            int y=model ==null ? 0:model.number;

            NoExist = y == 0 || (y - num) < 0;

            return Json(NoExist, JsonRequestBehavior.AllowGet);
        }
    }

}
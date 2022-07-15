using KOP_Store.Models.DataBaseModels;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Authentication;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using KOP_Store.Models;

namespace KOP_Store.Controllers
{

    public class defineUsersController : Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        // GET: DefineUsers
        public ActionResult DefineUsersView()
        {
            return View("DefineUsersView");
        }

        public ActionResult ChangePassView()
        {
            return View();
        }

        public JsonResult GetUsersLevelList()
        {
            // for Select Combobox in add or edit modal form

            List<mdluserLevel> useLevels = db.tblUserLevels.Select(x => new mdluserLevel()

            {
                levelCode = x.levelCode,
                levelDescription = x.levelDescription
            }).ToList();

            return Json(useLevels, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ChangePassword(string[] d)
        {
            // for Select Combobox in add or edit modal form
            int uid = Convert.ToInt32(d[0]);
            Boolean result = false;
            try
            {
                tblUsers users = db.tblUsers.Where(x => x.Id == uid).SingleOrDefault();
                users.password = MyEncryptDecrypt.EncryptString(d[1]);
                db.SaveChanges();
                result = true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUsersList()
        {
            List<mdlDefineUsers> mdlDefineUsers = db.vUsers1.Select(x => new mdlDefineUsers()
            {
                Id = x.Id,
                username = x.username,
                //password =x.password,
                password= x.password,
                levelCode = x.levelCode,
                levelDescription = x.levelDescription,
                active = (bool)x.active

            }).ToList();

            for (int i = 0; i < mdlDefineUsers.Count; i++)
            {
                mdlDefineUsers[i].password = MyEncryptDecrypt.DecryptString(mdlDefineUsers[i].password);
            }
            return Json(mdlDefineUsers, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveUsers(string[] d)
        {
            var result = false;
            // d[] Contains user Info as Array
            try
            {
                var s = d;
                var uId = Convert.ToInt32(d[0]);
                if (uId != 0) //in Edit mode
                {
                    tblUsers users= db.tblUsers.SingleOrDefault(x => x.Id == uId);
                    users.username= d[1];
                    users.password =MyEncryptDecrypt.EncryptString(d[2]);
                    users.levelCode = Convert.ToInt16(d[3]);
                    users.active = Convert.ToBoolean(d[4]);
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblUsers users= new tblUsers();
                    users.Id = uId;
                    users.username = d[1];
                    users.password = users.password = MyEncryptDecrypt.EncryptString(d[2]); 
                    users.levelCode= Convert.ToInt16(d[3]);
                    db.tblUsers.Add(users);
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
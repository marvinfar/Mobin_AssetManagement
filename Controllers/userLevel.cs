using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Web;
using System.Web.Mvc;
using KOP_Store.Models;
using KOP_Store.Models.DataBaseModels;
using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;

namespace KOP_Store.Controllers
{
    public class userLevelController:Controller
    {
        KOPStoreEntities db = new KOPStoreEntities();

        public ActionResult userLevelView()
        {
            return View("userLevelView");
        }

        public JsonResult GetUserLevel()
        {// for Select Combobox in add or edit modal form

            List<mdluserLevel> userLevels = db.tblUserLevels.Select(x => new mdluserLevel()
            {
                levelCode = x.levelCode,
                levelDescription = x.levelDescription
            }).ToList();
            
            return Json(userLevels, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetMaxId()
        {
            string max = db.tblUserLevels.Max(x => x.levelCode).ToString();
            max =( Convert.ToInt32(max) + 1).ToString();
            return Json(max, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveUserLevel(string[] d)
        {
            var result = false;
            // d[] Contains User Level Information
            try
            {
                var s = d;
                var lvlCode = Convert.ToInt16(d[0]);
                if (lvlCode != 0) //in Edit mode
                {
                    tblUserLevel userLevel =
                        db.tblUserLevels.SingleOrDefault(x => x.levelCode == lvlCode);
                    userLevel.levelDescription = d[1];
                    userLevel.levelCode = lvlCode;
                    db.SaveChanges();
                    result = true;
                }
                else
                {
                    tblUserLevel userLevel = new tblUserLevel();
                    userLevel.levelCode= lvlCode;
                    userLevel.levelDescription = d[1];
                    db.tblUserLevels.Add(userLevel);
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

        public JsonResult DeleteUserLevel(int userLevelCode)
        {
            var result = false;
            try
            {
                tblUserLevel userLevel = db.tblUserLevels.Where(x => x.levelCode == userLevelCode).SingleOrDefault();
                if (userLevel != null)
                {
                    db.tblUserLevels.Remove(userLevel);
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
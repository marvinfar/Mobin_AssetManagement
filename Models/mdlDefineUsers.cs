using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlDefineUsers
    {
        public int Id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string levelDescription { get; set; }
        public short levelCode { get; set; }
        public bool active { get; set; }
    }
}
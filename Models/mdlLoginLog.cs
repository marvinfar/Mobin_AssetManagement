using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlLoginLog
    {
        public int radif { get; set; }
        public string username { get; set; }
        public string xTime { get; set; }
        public string xDate { get; set; }
        public string ipAddress { get; set; }
    }
}
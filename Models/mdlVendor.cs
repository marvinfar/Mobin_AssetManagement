using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlVendor
    {
        public short vendorId { get; set; }
        public string companyName { get; set; }
        public string vendorName { get; set; }
        public string companyPhone { get; set; }
        public string fax { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string address { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlCustomer
    {

        public short customerId { get; set; }
        public string customerFName { get; set; }
        public string customerLName { get; set; }
        public string customerMobile { get; set; }
        public string customerPhone { get; set; }
        public string customerAddress { get; set; }
        public string customerCompany { get; set; }
    }
}
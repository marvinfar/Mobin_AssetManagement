using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlvIOFactor
    {
        public Nullable<int> FactorId { get; set; }
        public Nullable<short> CustomerId { get; set; }
        public Nullable<int> pdId { get; set; }
        public string CustomerName { get; set; }
        public Nullable<System.DateTime> outFactorDate { get; set; }
        public string myDate { get; set; }
        public string FactorDesc { get; set; }
        public string productName { get; set; }
        public string brandName { get; set; }
        public string colorName { get; set; }
        public string materialName { get; set; }
        public string sizeName { get; set; }
        public string genderName { get; set; }
        public string countryName { get; set; }
        public string pDescription { get; set; }
        public short quantity { get; set; }
        public string detailDesc { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlOutputFactor
    {
        public int outFactorId { get; set; }
        public string outFactorData { get; set; }
        public string outFactorTime { get; set; }
        public int userId { get; set; }
        public string outFactorDesc { get; set; }
        public short payType { get; set; }
        public int outFactorDetailId { get; set; }
        public int pdId { get; set; }
        public short quantity { get; set; }
        public decimal unitPrice { get; set; }
        public double discount { get; set; }
        public decimal totalPrice { get; set; }
        public string outDetailDesc { get; set; }
    }
}
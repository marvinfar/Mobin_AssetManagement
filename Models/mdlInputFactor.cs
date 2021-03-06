using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlInputFactor
    {
        public int inpFactorId { get; set; }
        public string inpFactorData { get; set; }
        public string inpFactorTime { get; set; }
        public int userId { get; set; }
        public string inpFactorDesc { get; set; }
        public short payType { get; set; }
        public int inpFactorDetailId { get; set; }
        public int pdId { get; set; }
        public short quantity { get; set; }
        public decimal unitPrice { get; set; }
        public double discount { get; set; }
        public decimal totalPrice { get; set; }
        public string inpDetailDesc { get; set; }
    }
}
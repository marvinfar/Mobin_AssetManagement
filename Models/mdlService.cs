using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlService
    {
        public int serviceId { get; set; }
        public DateTime serviceDate { get; set; }
        public short vendorId { get; set; }
        public string serviceDescription { get; set; }
        public decimal serviceTotalPrice { get; set; }
        public int serviceDetailId { get; set; }
        public int pdid { get; set; }
        public string amval { get; set; }
        public short customerId { get; set; }
        public decimal servicePrice { get; set; }
        public string serviceDetailDesc { get; set; }
    }
}
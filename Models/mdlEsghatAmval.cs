using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlEsghatAmval
    {
        public int radif { get; set; }
        public string amval { get; set; }
        public int pdId { get; set; }
        public short customerId { get; set; }
        public Nullable<System.DateTime> esghatDate { get; set; }
        public string eshghatDescription { get; set; }
    }
}
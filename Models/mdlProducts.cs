using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlProducts
    {
        public int productId { get; set; }
        public int productGroupId { get; set; }
        public string productName { get; set; }

        public string productGroupNameX { get; set; }
    }
}
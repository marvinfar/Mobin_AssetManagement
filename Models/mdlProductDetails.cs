using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KOP_Store.Models
{
    public class mdlProductDetails
    {
        public int pdId { get; set; }
        public int productId { get; set; }
        public string productName { get; set; }
        public string productGroupName { get; set; }
        public short? pBrand { get; set; }
        public string brandName { get; set; }
        public short? pMaterial { get; set; }
        public string materialName { get; set; }
        public short? pColor { get; set; }
        public string colorName { get; set; }
        public short? pSize { get; set; }
        public string sizeName { get; set; }
        public short? pGender { get; set; }
        public string genderName { get; set; }
        public short? pCountry { get; set; }
        public string countryName { get; set; }
        public string pDescription { get; set; }
        public string pImage { get; set; }


    }
}
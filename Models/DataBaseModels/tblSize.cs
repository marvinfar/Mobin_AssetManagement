//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace KOP_Store.Models.DataBaseModels
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblSize
    {
        public tblSize()
        {
            this.tblProductsDetails = new HashSet<tblProductsDetail>();
        }
    
        public short sizeId { get; set; }
        public string sizeName { get; set; }
    
        public virtual ICollection<tblProductsDetail> tblProductsDetails { get; set; }
    }
}

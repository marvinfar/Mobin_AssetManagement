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
    
    public partial class tblOutputFactorDetail
    {
        public int outFactorId { get; set; }
        public int outFactorDetailId { get; set; }
        public int pdId { get; set; }
        public short quantity { get; set; }
        public Nullable<decimal> unitPrice { get; set; }
        public Nullable<double> discount { get; set; }
        public Nullable<decimal> totalPrice { get; set; }
        public string outDetailDesc { get; set; }
    
        public virtual tblOutputFactorMain tblOutputFactorMain { get; set; }
        public virtual tblProductsDetail tblProductsDetail { get; set; }
    }
}

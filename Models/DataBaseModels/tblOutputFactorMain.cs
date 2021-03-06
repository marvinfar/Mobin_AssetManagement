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
    
    public partial class tblOutputFactorMain
    {
        public tblOutputFactorMain()
        {
            this.tbloutPayments = new HashSet<tbloutPayment>();
            this.tblOutputFactorDetails = new HashSet<tblOutputFactorDetail>();
        }
    
        public int outFactorId { get; set; }
        public Nullable<short> CustomerId { get; set; }
        public Nullable<System.DateTime> outFactorDate { get; set; }
        public string outFactorTime { get; set; }
        public Nullable<int> userId { get; set; }
        public string outFactorDesc { get; set; }
        public Nullable<decimal> outFactorTotalPrice { get; set; }
        public Nullable<short> payType { get; set; }
    
        public virtual tblCustomer tblCustomer { get; set; }
        public virtual ICollection<tbloutPayment> tbloutPayments { get; set; }
        public virtual ICollection<tblOutputFactorDetail> tblOutputFactorDetails { get; set; }
        public virtual tblUsers tblUser { get; set; }
    }
}

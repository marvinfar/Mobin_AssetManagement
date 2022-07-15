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
    
    public partial class tblInputFactorMain
    {
        public tblInputFactorMain()
        {
            this.tblInputFactorDetails = new HashSet<tblInputFactorDetail>();
            this.tblInpPayments = new HashSet<tblInpPayment>();
        }
    
        public int inpFactorId { get; set; }
        public Nullable<short> CustomerId { get; set; }
        public Nullable<System.DateTime> inpFactorDate { get; set; }
        public string inpFactorTime { get; set; }
        public Nullable<int> userId { get; set; }
        public string inpFactorDesc { get; set; }
        public Nullable<decimal> inpFactorTotalPrice { get; set; }
        public Nullable<short> payType { get; set; }
    
        public virtual tblCustomer tblCustomer { get; set; }
        public virtual tblUsers tblUser { get; set; }
        public virtual ICollection<tblInputFactorDetail> tblInputFactorDetails { get; set; }
        public virtual ICollection<tblInpPayment> tblInpPayments { get; set; }
    }
}
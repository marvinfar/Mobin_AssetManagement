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
    
    public partial class tblTakhsisAmval
    {
        public int radif { get; set; }
        public short customerId { get; set; }
        public int pdId { get; set; }
        public string amval { get; set; }
        public Nullable<System.DateTime> deliverDate { get; set; }
        public Nullable<bool> active { get; set; }
        public Nullable<bool> esghat { get; set; }
        public string description { get; set; }
        public Nullable<int> userId { get; set; }
    
        public virtual tblCustomer tblCustomer { get; set; }
        public virtual tblProductsDetail tblProductsDetail { get; set; }
        public virtual tblUsers tblUser { get; set; }
        public virtual tblAmval tblAmval { get; set; }
    }
}

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
    
    public partial class tblVendor
    {
        public tblVendor()
        {
            this.tblServiceMains = new HashSet<tblServiceMain>();
        }
    
        public short vendorId { get; set; }
        public string companyName { get; set; }
        public string vendorName { get; set; }
        public string companyPhone { get; set; }
        public string fax { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string address { get; set; }
    
        public virtual ICollection<tblServiceMain> tblServiceMains { get; set; }
    }
}

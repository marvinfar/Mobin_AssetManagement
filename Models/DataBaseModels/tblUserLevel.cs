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
    
    public partial class tblUserLevel
    {
        public tblUserLevel()
        {
            this.tblUsers = new HashSet<tblUsers>();
        }
    
        public short levelCode { get; set; }
        public string levelDescription { get; set; }
    
        public virtual ICollection<tblUsers> tblUsers { get; set; }
    }
}

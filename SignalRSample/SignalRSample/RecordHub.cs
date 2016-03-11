using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace SignalRSample
{
    public class RecordHub : Hub
    {
        public void AddRecord(dynamic data)
        {
            Clients.All.OnAddRecord(data);
        }
    }
}
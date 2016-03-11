
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(SignalRSample.Startup))]

namespace SignalRSample
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}

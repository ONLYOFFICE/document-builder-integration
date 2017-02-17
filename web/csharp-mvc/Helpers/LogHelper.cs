using log4net;

namespace DocumentBuilder.Helpers
{
    public class LogHelper
    {
        public static ILog Log = LogManager.GetLogger("DocumentBuilder");
    }
}
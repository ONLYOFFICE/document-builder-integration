
using System.ComponentModel;
using System.Web.Configuration;

namespace DocumentBuilder.Classes
{
    public class Settings
    {
        public static bool DebugMode
        {
            get
            {
                #if DEBUG
                return true;
                #else
                return false;
                #endif
            }
        }
        

        public static string BuilderPath
        {
            get { return GetAppSettings("builder-path", string.Empty); }
        }

        
        private static T GetAppSettings<T>(string key, T defaultValue)
        {
            var configSetting = WebConfigurationManager.AppSettings[key];
            if (!string.IsNullOrEmpty(configSetting))
            {
                var converter = TypeDescriptor.GetConverter(typeof(T));
                if (converter.CanConvertFrom(typeof(string)))
                {
                    return (T)converter.ConvertFromString(configSetting);
                }
            }
            return defaultValue;
        }
    }
}
/**
 *
 * (c) Copyright Ascensio System SIA 2023
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
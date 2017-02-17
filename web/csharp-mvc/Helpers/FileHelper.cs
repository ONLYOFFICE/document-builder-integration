using System.IO;
using System.Reflection;
using System.Web;

namespace DocumentBuilder.Helpers
{
    public class FileHelper
    {
        public static void WriteTextToFile(string path, string text)
        {
            File.WriteAllText(path, text);
        }

        public static string ReadTextFromFile(string path)
        {
            return File.Exists(path) ? File.ReadAllText(path) : null;
        }

        public static string ReadTextFromEmbeddedResource(Assembly assembly, string resourceName)
        {
            var result = string.Empty;

            using (var stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream != null)
                {
                    using (var sr = new StreamReader(stream))
                    {
                        result = sr.ReadToEnd();
                    }
                }
            }

            return result;
        }

        public static byte[] ReadBytesFromFile(string path)
        {
            return File.Exists(path) ? File.ReadAllBytes(path) : null;
        }

        public static byte[] ReadBytesFromEmbeddedResource(Assembly assembly, string resourceName)
        {
            byte[] result = null;

            using (var stream = assembly.GetManifestResourceStream(resourceName))
            {
                if (stream != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        stream.CopyTo(memoryStream);
                        result = memoryStream.ToArray();
                    }
                }
            }

            return result;
        }

        public static void DeleteFile(string path)
        {
            if (File.Exists(path))
                File.Delete(path);
        }

        public static string ReadTextFromFile(HttpPostedFileBase file)
        {
            string result;

            using (var stream = file.InputStream)
            {
                using (var sr = new StreamReader(stream))
                {
                    result = sr.ReadToEnd();
                }
            }

            return result;
        }
    }
}
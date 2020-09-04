/**
 *
 * (c) Copyright Ascensio System SIA 2020
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

using System;
using System.IO;
using System.Reflection;
using System.Web.Mvc;
using DocumentBuilder.Classes;
using DocumentBuilder.Helpers;

namespace DocumentBuilder.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Sample = FileHelper.ReadTextFromEmbeddedResource(Assembly.GetExecutingAssembly(), "DocumentBuilderMVC.Templates.sample.docbuilder");

            return View();
        }

        [HttpPost]
        public JsonResult Upload()
        {
            try
            {
                if (Request.Files == null || Request.Files.Count <= 0)
                    throw new Exception("Files Not Transfered");

                var file = Request.Files[0];

                if (file == null)
                    throw new Exception("Error File Is Null");

                if (file.ContentLength <= 0)
                    throw new Exception("Error File Size");

                if (file.InputStream == null)
                    throw new Exception("Error File InputStream Is Null");

                if (string.IsNullOrEmpty(file.FileName))
                    throw new Exception("Error File Name Is Empty");

                var extension = Path.GetExtension(file.FileName);

                if (string.IsNullOrEmpty(extension) || !extension.Equals(".docbuilder", StringComparison.InvariantCultureIgnoreCase))
                    throw new Exception("Error Invalid File Extension");

                var fileContent = FileHelper.ReadTextFromFile(file);

                return Json(new
                {
                    success = true,
                    message = fileContent
                });
            }
            catch (Exception ex)
            {
                LogHelper.Log.Error(ex.Message, ex);

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult Generate(UserInfo userInfo)
        {
            try
            {
                if (string.IsNullOrEmpty(Settings.BuilderPath))
                    throw new Exception("Empty Builder Path");

                if (userInfo == null)
                    throw new ArgumentException("userInfo");

                if (string.IsNullOrEmpty(userInfo.Script))
                    throw new Exception("Empty Script");

                var filePath = BuildHelper.GenerateDocument(Settings.BuilderPath, userInfo);

                return Json(new
                {
                    success = true,
                    message = filePath
                });
            }
            catch (Exception ex)
            {
                LogHelper.Log.Error(ex.Message, ex);

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost]
        public JsonResult Create(UserInfo userInfo)
        {
            try
            {
                if (string.IsNullOrEmpty(Settings.BuilderPath))
                    throw new Exception("Empty Builder Path");

                if (userInfo == null)
                    throw new ArgumentException("userInfo");

                if (string.IsNullOrEmpty(userInfo.Name))
                    throw new Exception("Empty Name");

                if (string.IsNullOrEmpty(userInfo.Company))
                    throw new Exception("Empty Company");

                if (string.IsNullOrEmpty(userInfo.Title))
                    throw new Exception("Empty Title");

                var filePath = BuildHelper.CreateDocument(Settings.BuilderPath, userInfo);

                return Json(new
                {
                    success = true,
                    message = filePath
                });
            }
            catch (Exception ex)
            {
                LogHelper.Log.Error(ex.Message, ex);

                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet]
        public virtual ActionResult Download(string filePath)
        {
            return File(filePath, "application/octet-stream", Path.GetFileName(filePath));
        }
    }
}

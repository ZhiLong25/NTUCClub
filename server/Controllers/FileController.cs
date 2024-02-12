using Microsoft.AspNetCore.Authorization;
using NanoidDotNet;
using Microsoft.AspNetCore.Mvc;
using NTUCClub.Models;

namespace NTUCClub.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public FileController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("upload")] // ,Authorize
        public IActionResult Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded." });
            }

            // Validate file size
            if (file.Length > 1024 * 1024)
            {
                var message = "Maximum file size is 1MB";
                return BadRequest(new { message });
            }

            // Validate file type based on file extension or content type
            var allowedFileTypes = new[] { ".jpg", ".jpeg", ".png", ".gif" }; // Add more types as needed
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!Array.Exists(allowedFileTypes, t => t == fileExtension))
            {
                var message = "Unsupported file type.";
                return BadRequest(new { message });
            }

            var id = Nanoid.Generate(size: 10);
            var filename = id + fileExtension;
            var imagePath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", filename);

            using var fileStream = new FileStream(imagePath, FileMode.Create);
            file.CopyTo(fileStream);

            UploadResponse response = new() { Filename = filename };
            return Ok(response);
        }

        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultiple(IFormFileCollection files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest(new { message = "No files uploaded." });
            }

            var uploadedFileNames = new List<string>();

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                    continue;

                // Validate file size
                if (file.Length > 1024 * 1024)
                {
                    var message = "Maximum file size is 1MB";
                    return BadRequest(new { message });
                }

                // Validate file type based on file extension or content type
                var allowedFileTypes = new[] { ".jpg", ".jpeg", ".png", ".gif" }; // Add more types as needed
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedFileTypes.Contains(fileExtension))
                {
                    var message = "Unsupported file type.";
                    return BadRequest(new { message });
                }

                var id = Nanoid.Generate(size: 10);
                var filename = id + fileExtension;
                var imagePath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads", filename);

                using var fileStream = new FileStream(imagePath, FileMode.Create);
                await file.CopyToAsync(fileStream);

                uploadedFileNames.Add(filename);
            }

            UploadResponse2 response = new() { Filenames = uploadedFileNames };
            return Ok(response);
        }
    }
    
}

using System;
using System.Linq;
using System.Threading.Tasks;
using backend.DAL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuditController : ControllerBase
	{

        private DBContext _context;

        public AuditController(DBContext context)
		{
            _context = context;
		}

        [Route("GetRevisionHistory/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetRevisionHistory(int id)
        {
            var history = await _context.Audits.Where(x => x.KeyValues == "{\"Id\":" + id + "}").ToListAsync();
            return Ok(history);
        }
    }
}
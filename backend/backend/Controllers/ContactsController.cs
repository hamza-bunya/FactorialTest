using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.DAL;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactsController : ControllerBase
	{
        private DBContext _context;

        public ContactsController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetContacts()
        {
            List<Contact> contacts = new List<Contact>();
            contacts = await _context.Contacts.ToListAsync();
            return Ok(contacts);
        }

        [Route("DeleteContact/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if(contact is null)
            {
                return BadRequest();
            }
            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Route("DeleteMultiple")]
        [HttpDelete]
        public async Task<IActionResult> DeleteMultiple([FromQuery] int[] ids)
        {
            if(ids.Length == 0)
            {
                return BadRequest();
            }

            var contacts = await _context.Contacts.Where(x => ids.Contains(x.Id)).ToListAsync();
            _context.Contacts.RemoveRange(contacts);
            await _context.SaveChangesAsync();
            var newContacts = await _context.Contacts.ToListAsync();
            return Ok(newContacts);
        }

        [Route("StarContact/{id}")]
        [HttpPatch]
        public async Task<IActionResult> StarContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact is null)
            {
                return BadRequest();
            }
            contact.Starred = !contact.Starred;
            await _context.SaveChangesAsync();
            return Ok(contact);
        }

        [HttpPost]
        public async Task<IActionResult> PostContact(Contact contact)
        {
            if(string.IsNullOrEmpty(contact.FirstName) || string.IsNullOrEmpty(contact.LastName)
                || string.IsNullOrEmpty(contact.Phone) || string.IsNullOrEmpty(contact.Email))
            {
                return BadRequest();
            }
            var checkEmail = await _context.Contacts.AnyAsync(x => x.Email == contact.Email);
            if(checkEmail)
            {
                return Conflict("Email already exists");
            }
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();
            return Ok(contact);
        }

        [Route("EditContact/{id}")]
        [HttpPut]
        public async Task<IActionResult> EditContact(int id, Contact contact)
        {
            if (string.IsNullOrEmpty(contact.FirstName) || string.IsNullOrEmpty(contact.LastName)
                || string.IsNullOrEmpty(contact.Phone) || string.IsNullOrEmpty(contact.Email))
            {
                return BadRequest();
            }
            var dbContact = await _context.Contacts.FindAsync(id);
            if (dbContact is null)
            {
                return BadRequest();
            }
            var emailCheck = await _context.Contacts.FirstOrDefaultAsync(x => x.Email == contact.Email);
            if(emailCheck != null)
            {
                if(emailCheck.Id != contact.Id)
                {
                    return Conflict("Email already exists");
                }
            }
            dbContact.FirstName = contact.FirstName;
            dbContact.LastName = contact.LastName;
            dbContact.Phone = contact.Phone;
            dbContact.Email = contact.Email;
            await _context.SaveChangesAsync();
            return Ok(dbContact);
        }
	}
}


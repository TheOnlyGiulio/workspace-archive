using Microsoft.AspNetCore.Mvc;
using Persistence;
using Service;

namespace RestfulPhoneApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhonesController(IPhonesServices phonesServices) : ControllerBase
    {
        [HttpPost]
        public void Post([FromBody] Phone phone)
        {
            phonesServices.CreatePhone(phone);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            phonesServices.DeletePhone(id);
        }

        [HttpPut]
        public void Put([FromBody] Phone phone)
        {
            phonesServices.PutPhone(phone);
        }

        [HttpPatch]
        public void Patch([FromBody] Phone phone)
        {
            phonesServices.PatchPhone(phone);
        }

        [HttpGet]
        public List<Phone> Get()
        {
            return phonesServices.GetAllPhones();
        }

        [HttpGet("{id}")]
        public Phone? Get(int id)
        {
            return phonesServices.GetPhone(id);
        }
    }
}

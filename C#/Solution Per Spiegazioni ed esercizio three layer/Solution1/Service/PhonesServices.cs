using Persistence;
using System.Numerics;

namespace Service
{
    public class PhonesServices(IPhonesRepository phonesRepository) : IPhonesServices
    {
        public void CreatePhone(Phone phone)
        {
            if (phone == null)
                return;
            phonesRepository.CreatePhone(phone);
        }

        public void DeletePhone(int id)
        {
            phonesRepository.DeletePhone(id);
        }

        public List<Phone> GetAllPhones()
        {
            return phonesRepository.GetAllPhones();
        }

        public Phone? GetPhone(int id)
        {
            return phonesRepository.GetPhone(id);
        }

        public void PatchPhone(Phone phone)
        {
            if (phone != null)
                phonesRepository.PatchPhone(phone);
            return;
        }

        public void PutPhone(Phone phone)
        {
            if (phone != null)
                phonesRepository.PutPhone(phone);
            return;
        }
    }
}

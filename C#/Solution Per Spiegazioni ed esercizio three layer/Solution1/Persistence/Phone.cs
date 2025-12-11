namespace Persistence
{
    public class Phone(int battery, string phoneNumber, int status, string typeModel, int id)
    {
        public int Battery { get; set; } = battery;
        public required string PhoneNumber { get; set; } = phoneNumber;
        public int Status { get; set; } = status;
        public required string TypeModel { get; set; } = typeModel;
        public int Id { get; set; } = id;
    }
}

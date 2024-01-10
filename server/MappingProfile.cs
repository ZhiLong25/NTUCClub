using AutoMapper;
using NTUCClub.Models;
namespace NTUCClub
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>();
            CreateMap<User, UserBasicDTO>();
        }
    }
}
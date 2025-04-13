using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.DTO;

namespace DuoLingoKnockOff.Data.Repos.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByIdAsync(int id);
    
    Task<UserProgressDto> GetUserProgressAsync(int userId);
}
using DuoLingoKnockOff.Data.Entities;

namespace DuoLingoKnockOff.Services.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}
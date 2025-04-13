using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.DTO;

namespace DuoLingoKnockOff.Data.Repos.Interfaces;

public interface ILanguageRepository : IRepository<Language>
{
    Task<LeaderboardDto> GetLeaderboardForLanguageAsync(int languageId, int? currentUserId = null);
}
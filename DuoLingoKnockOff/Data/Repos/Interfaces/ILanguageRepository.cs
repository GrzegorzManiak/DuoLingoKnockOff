using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.DTO;

namespace DuoLingoKnockOff.Data.Repos.Interfaces;

public interface ILanguageRepository : IRepository<Language>
{
    Task<IEnumerable<Challenge>> GetChallengesForLanguageAsync(int languageId);
    Task<LeaderboardDto> GetLeaderboardForLanguageAsync(int languageId);
}
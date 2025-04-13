using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Helpers.Challenges;

namespace DuoLingoKnockOff.Data.Repos.Interfaces;

public interface IChallengeRepository
{
    Task<Challenge> CreateChallengeAsync(Challenge challenge);
    Task<UserProgress> CreateUserProgressAsync(UserProgress progress);
    Task<UserProgress?> GetUserProgressAsync(int userId, int challengeId);
    Task UpdateUserProgressAsync(UserProgress progress);
    Task<Challenge?> GetChallengeAsync(int challengeId);
    Task<IEnumerable<Challenge>> GetCompletedChallenges(int userId, int languageId, int page, int pageSize);
    Task<IEnumerable<Challenge>> GetAttemptingChallenges(int userId, int languageId, int page, int pageSize);
    Task<int> GetCompletedChallengesCount(int userId, int languageId);
    Task<int> GetAttemptingChallengesCount(int userId, int languageId);
}
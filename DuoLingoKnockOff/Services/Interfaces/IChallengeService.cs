using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.DTO;
using DuoLingoKnockOff.Helpers.Challenges;

namespace DuoLingoKnockOff.Services.Interfaces;

public interface IChallengeService
{
    public Task<ChallengeDto> GenerateUserChallenge(int userId, int languageId, Difficulty difficulty);
    public Task UpdateUserProgress(int userId, int challengeId, bool isCorrect);
    public Task<PaginatedResult<ChallengeDto>> GetCompletedChallenges(int userId, int languageId, int page, int pageSize);
    public Task<PaginatedResult<ChallengeDto>> GetAttemptingChallenges(int userId, int languageId, int page, int pageSize);
    public Task<ChallengeDto> GetChallenge(int userId, int languageId, int challengeId);
}
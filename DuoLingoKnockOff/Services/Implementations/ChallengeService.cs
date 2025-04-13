using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using DuoLingoKnockOff.Helpers.Challenges;
using DuoLingoKnockOff.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DuoLingoKnockOff.Services.Implementations;

public class ChallengeService(IChallengeRepository challengeRepository, IOptions<AppConfig> appConfig) : IChallengeService
{
    private readonly MultipleChoiceHelper _multipleChoiceHelper = new();
    private readonly AppConfig _appConfig = appConfig.Value;

    public async Task<ChallengeDto> GenerateUserChallenge(int userId, int languageId, Difficulty difficulty)
    {
        var challengeContent = _multipleChoiceHelper.GenerateChallenge(difficulty);
        var serializedContent = _multipleChoiceHelper.SerializeChallenge(challengeContent);
        var challenge = new Challenge
        {
            LanguageId = languageId,
            Content = serializedContent,
            Type = ChallengeType.MultipleChoice,
            Difficulty = difficulty,
        };

        challenge = await challengeRepository.CreateChallengeAsync(challenge);
        var userProgress = new UserProgress
        {
            UserId = userId,
            ChallengeId = challenge.Id,
            Completed = false,
            Score = 0,
            Attempts = 0,
            LastAttemptDate = DateTime.UtcNow
        };

        await challengeRepository.CreateUserProgressAsync(userProgress);
        return ChallengeDto.FromEntity(challenge);
    }

    public async Task UpdateUserProgress(int userId, int challengeId, bool isCorrect)
    {
        var progress = await challengeRepository.GetUserProgressAsync(userId, challengeId);
        if (progress == null) throw new InvalidOperationException("Challenge progress not found");
        
        if (isCorrect)
        {
            progress.Completed = true;
            // -- Calculate score based on attempts * difficulty
            progress.Score = Math.Max(0,
                (100 - progress.Attempts * _appConfig.ChallengeScorePenalty) *
                DifficultyHelper.GetDifficulityMultiplier(progress.Challenge.Difficulty));
            progress.CompletedDate = DateTime.UtcNow;
        }
        
        progress.Attempts++;
        progress.LastAttemptDate = DateTime.UtcNow;
        
        await challengeRepository.UpdateUserProgressAsync(progress);
    }
    
    public async Task<PaginatedResult<ChallengeDto>> GetCompletedChallenges(int userId, int languageId, int page, int pageSize)
    {
        var challenges = await challengeRepository.GetCompletedChallenges(userId, languageId, page, pageSize);
        var totalCount = await challengeRepository.GetCompletedChallengesCount(userId, languageId);
        var dtos = challenges.Select(ChallengeDto.FromEntity);
        return new PaginatedResult<ChallengeDto>(dtos, totalCount, page, pageSize);
    }

    public async Task<PaginatedResult<ChallengeDto>> GetAttemptingChallenges(int userId, int languageId, int page, int pageSize)
    {
        var challenges = await challengeRepository.GetAttemptingChallenges(userId, languageId, page, pageSize);
        var totalCount = await challengeRepository.GetAttemptingChallengesCount(userId, languageId);
        var dtos = challenges.Select(ChallengeDto.FromEntity);
        return new PaginatedResult<ChallengeDto>(dtos, totalCount, page, pageSize);
    }
} 
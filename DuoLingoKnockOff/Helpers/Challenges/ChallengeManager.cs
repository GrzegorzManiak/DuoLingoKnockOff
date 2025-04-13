using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DuoLingoKnockOff.Helpers.Challenges;

public class ChallengeManager
{
    private readonly ApplicationContext _context;
    private readonly MultipleChoiceHelper _multipleChoiceHelper;

    public ChallengeManager(ApplicationContext context)
    {
        _context = context;
        _multipleChoiceHelper = new MultipleChoiceHelper();
    }

    public async Task<Challenge> GenerateUserChallenge(int userId, int languageId, Difficulty difficulty)
    {
        // -- Generate the challenge content
        var challengeContent = _multipleChoiceHelper.GenerateChallenge(difficulty);
        var serializedContent = _multipleChoiceHelper.SerializeChallenge(challengeContent);

        // -- Create a new challenge
        var challenge = new Challenge
        {
            LanguageId = languageId,
            Content = serializedContent,
            Type = ChallengeType.MultipleChoice,
            Difficulty = difficulty,
            SequenceOrder = await GetNextSequenceOrder(userId, languageId),
            UserId = userId
        };

        // -- Add to database
        _context.Challenges.Add(challenge);
        await _context.SaveChangesAsync();

        // -- Create initial user progress
        var userProgress = new UserProgress
        {
            UserId = userId,
            ChallengeId = challenge.Id,
            Completed = false,
            Score = 0,
            Attempts = 0,
            LastAttemptDate = DateTime.UtcNow
        };

        _context.UserProgresses.Add(userProgress);
        await _context.SaveChangesAsync();

        return challenge;
    }

    public async Task UpdateUserProgress(int userId, int challengeId, bool isCorrect)
    {
        var progress = await _context.UserProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.ChallengeId == challengeId);

        if (progress == null)
        {
            throw new InvalidOperationException("Challenge progress not found");
        }

        progress.Attempts++;
        progress.LastAttemptDate = DateTime.UtcNow;

        if (isCorrect)
        {
            progress.Completed = true;
            progress.Score = 100;
            progress.CompletedDate = DateTime.UtcNow;
        }
        else
        {
            // If not correct, update score based on attempts
            progress.Score = Math.Max(0, 100 - (progress.Attempts * 20));
        }

        await _context.SaveChangesAsync();
    }

    private async Task<int> GetNextSequenceOrder(int userId, int languageId)
    {
        var lastChallenge = await _context.Challenges
            .Where(c => c.UserId == userId && c.LanguageId == languageId)
            .OrderByDescending(c => c.SequenceOrder)
            .FirstOrDefaultAsync();

        return (lastChallenge?.SequenceOrder ?? 0) + 1;
    }
} 
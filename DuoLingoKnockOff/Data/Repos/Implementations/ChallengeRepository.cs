using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DuoLingoKnockOff.Data.Repos.Implementations;

public class ChallengeRepository : IChallengeRepository
{
    private readonly ApplicationContext _context;

    public ChallengeRepository(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<Challenge> CreateChallengeAsync(Challenge challenge)
    {
        _context.Challenges.Add(challenge);
        await _context.SaveChangesAsync();
        return challenge;
    }

    public async Task<UserProgress> CreateUserProgressAsync(UserProgress progress)
    {
        _context.UserProgress.Add(progress);
        await _context.SaveChangesAsync();
        return progress;
    }

    public async Task<UserProgress?> GetUserProgressAsync(int userId, int challengeId)
    {
        return await _context.UserProgress
            .FirstOrDefaultAsync(p => p.UserId == userId && p.ChallengeId == challengeId);
    }

    public async Task UpdateUserProgressAsync(UserProgress progress)
    {
        _context.UserProgress.Update(progress);
        await _context.SaveChangesAsync();
    }

    public async Task<Challenge?> GetChallengeAsync(int challengeId)
    {
        return await _context.Challenges
            .FirstOrDefaultAsync(c => c.Id == challengeId);
    }

    public async Task<IEnumerable<Challenge>> GetCompletedChallenges(int userId, int languageId, int page, int pageSize)
    {
        return await _context.UserProgress
            .Include(up => up.Challenge)
            .Where(up => up.UserId == userId && 
                   up.Challenge.LanguageId == languageId && 
                   up.Completed)
            .OrderByDescending(up => up.CompletedDate)
            .Select(up => up.Challenge)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Challenge>> GetAttemptingChallenges(int userId, int languageId, int page, int pageSize)
    {
        return await _context.UserProgress
            .Include(up => up.Challenge)
            .Where(up => up.UserId == userId && 
                   up.Challenge.LanguageId == languageId && 
                   !up.Completed)
            .OrderByDescending(up => up.LastAttemptDate)
            .Select(up => up.Challenge)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetCompletedChallengesCount(int userId, int languageId)
    {
        return await _context.UserProgress
            .CountAsync(up => up.UserId == userId && 
                      up.Challenge.LanguageId == languageId && 
                      up.Completed);
    }

    public async Task<int> GetAttemptingChallengesCount(int userId, int languageId)
    {
        return await _context.UserProgress
            .CountAsync(up => up.UserId == userId && 
                      up.Challenge.LanguageId == languageId && 
                      !up.Completed);
    }
} 
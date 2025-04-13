using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using Microsoft.EntityFrameworkCore;

namespace DuoLingoKnockOff.Data.Repos.Implementations;

public class UserRepository(ApplicationContext context) : Repository<User>(context), IUserRepository
{
    private readonly ApplicationContext _context = context;

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .SingleOrDefaultAsync(x => x != null && x.UsernameUncased == username.ToLower());
    }
    
    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await _context.Users
            .SingleOrDefaultAsync(x => x != null && x.Id == userId);
    }

    public async Task<bool> UpdateUserStreakAsync(int userId)
    {
        var user = await GetUserByIdAsync(userId);
        if (user == null) return false;
        
        // TEMP: not really hwo i want to do this, but for now its grand
        user.Streak.CurrentStreak++;
        if (user.Streak.CurrentStreak > user.Streak.MaxStreak)
            user.Streak.MaxStreak = user.Streak.CurrentStreak;
        
        user.Streak.LastActivity = DateTime.UtcNow;
        return await _context.SaveChangesAsync() > 0;
    }
    
    public async Task<UserProgressDto> GetUserProgressAsync(int userId)
    {
        // -- Get completed challenges for the given user, group by the language,
        //    select all languages and sum their scores and count their completed challenges
        var progressEntries = await _context.UserProgresses
            .Where(up => up.UserId == userId)
            .Join(_context.Challenges,
                progress => progress.ChallengeId,
                challenge => challenge.Id,
                (progress, challenge) => new { Progress = progress, Challenge = challenge })
            .GroupBy(j => j.Challenge.LanguageId)
            .Select(g => new LanguageProgressDto
            {
                LanguageId = g.Key,
                CompletedChallenges = g.Count(j => j.Progress.Completed),
                TotalScore = g.Sum(j => j.Progress.Score)
            })
            .ToListAsync();

        return new UserProgressDto
        {
            UserId = userId,
            LanguageProgress = progressEntries
        };
    }
}
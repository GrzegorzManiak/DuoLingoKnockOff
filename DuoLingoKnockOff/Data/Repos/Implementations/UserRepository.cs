using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DuoLingoKnockOff.Data.Repos.Implementations;

public class UserRepository(ApplicationContext context, IUserStreakRepository userStreakRepository) : Repository<User>(context), IUserRepository
{
    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await context.Users
            .SingleOrDefaultAsync(x => x != null && x.UsernameUncased == username.ToLower());
    }
    
    public async Task<User?> GetUserByIdAsync(int userId)
    {
        return await context.Users
            .SingleOrDefaultAsync(x => x != null && x.Id == userId);
    }
    
    public async Task<UserProgressDto> GetUserProgressAsync(int userId)
    {
        // -- Get completed challenges for the given user, group by the language,
        //    select all languages and sum their scores and count their completed challenges
        var progressEntries = await context.UserProgress
            .Where(up => up.UserId == userId)
            .Join(context.Challenges,
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
    
        var streak = await userStreakRepository.GetUserStreakAsync(userId);
        
        return new UserProgressDto
        {
            UserId = userId,
            LanguageProgress = progressEntries,
            Streak = streak,
        };
    }
}
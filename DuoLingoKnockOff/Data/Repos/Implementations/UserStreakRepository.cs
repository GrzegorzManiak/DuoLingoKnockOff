using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DuoLingoKnockOff.Data.Repos.Implementations;

public class UserStreakRepository(ApplicationContext context, IOptions<AppConfig> appConfig) :  Repository<UserStreak>(context), IUserStreakRepository
{
    private readonly AppConfig _appConfig = appConfig.Value;

    public async Task<UserStreak> AddAsync(UserStreak userStreak)
    {
        context.UserStreaks.Add(userStreak);
        await context.SaveChangesAsync();
        return userStreak;
    }
    
    public async Task<UserStreakDto> GetUserStreakAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.Streak)
            .SingleOrDefaultAsync(u => u != null && u.Id == userId);
            
        if (user?.Streak == null)
            throw new KeyNotFoundException($"User streak not found for user ID {userId}");
            
        return new UserStreakDto
        {
            CurrentStreak = user.Streak.CurrentStreak,
            MaxStreak = user.Streak.MaxStreak,
            LastSuccessfulAttempt = user.Streak.LastSuccessfulAttempt,
            CurrentStreakStartDate = user.Streak.CurrentStreakStartDate
        };
    }

    public async Task<bool> UpdateUserStreakAsync(int userId)
    {
        var user = await context.Users
            .Include(u => u.Streak)
            .SingleOrDefaultAsync(u => u != null && u.Id == userId);
            
        if (user?.Streak == null) return false;
        
        var streak = user.Streak;
        var now = DateTime.UtcNow;
        var streakInterval = TimeSpan.FromHours(_appConfig.StreakIntervalHours);
        
        // -- If the last successful attempt was more than streakInterval ago,
        // reset the current streak start date
        if (now - streak.LastSuccessfulAttempt > streakInterval)
            streak.CurrentStreakStartDate = now;
        
        streak.LastSuccessfulAttempt = now;
        streak.CurrentStreak = (int)(now - streak.CurrentStreakStartDate).TotalDays + 1;
        if (streak.CurrentStreak > streak.MaxStreak)
            streak.MaxStreak = streak.CurrentStreak;
        
        return await context.SaveChangesAsync() > 0;
    }
}
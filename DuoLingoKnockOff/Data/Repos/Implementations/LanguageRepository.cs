using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DuoLingoKnockOff.Data.Repos.Implementations;

public class LanguageRepository(ApplicationContext context, IOptions<AppConfig> appConfig) : Repository<Language>(context), ILanguageRepository
{
    private readonly ApplicationContext _context = context;
    private readonly AppConfig _appConfig = appConfig.Value;
    
    public async Task<LeaderboardDto> GetLeaderboardForLanguageAsync(int languageId, int? currentUserId = null)
    {
        // -- Get all users' progress for the language
        var allUsersProgress = await _context.UserProgress
            .Where(up => up.Challenge.LanguageId == languageId)
            .GroupBy(up => up.UserId)
            .Select(g => new LeaderboardEntryDto
            {
                UserId = g.Key,
                Username = g.First().User.UsernameUncased,
                UsernameCased = g.First().User.UsernameCased,
                TotalScore = g.Sum(up => up.Score),
                CompletedChallenges = g.Count(up => up.Completed)
            })
            .OrderByDescending(e => e.TotalScore)
            .ToListAsync();

        // -- Get top users based on config
        var topUsers = allUsersProgress.Take(_appConfig.TotalLeaderboardEntries).ToList();

        var leaderboard = new LeaderboardDto
        {
            LanguageId = languageId,
            Entries = topUsers
        };

        // -- If current user is provided, find their position and entry
        if (currentUserId.HasValue)
        {
            var currentUserEntry = allUsersProgress.FirstOrDefault(e => e.UserId == currentUserId);
            if (currentUserEntry != null)
            {
                leaderboard.CurrentUserEntry = currentUserEntry;
                leaderboard.CurrentUserPosition = allUsersProgress.IndexOf(currentUserEntry) + 1;
            }
        }

        return leaderboard;
    }
}
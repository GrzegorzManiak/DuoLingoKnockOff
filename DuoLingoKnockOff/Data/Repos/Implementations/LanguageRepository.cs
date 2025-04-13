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

    public async Task<IEnumerable<Challenge>> GetChallengesForLanguageAsync(int languageId)
    {
        return await _context.Challenges
            .Where(c => c.LanguageId == languageId)
            .ToListAsync();
    }

    public async Task<LeaderboardDto> GetLeaderboardForLanguageAsync(int languageId)
    {
        // -- Get completed challenges for the given language, group the by the user, 
        //    select all users and sum their scores and count their completed challenges
        //    sort by their total score and take the top x users
        var topUsers = await _context.UserProgresses
            .Where(up => up.Challenge.LanguageId == languageId)
            .GroupBy(up => up.UserId)
            .Select(g => new LeaderboardEntryDto
            {
                UserId = g.Key,
                Username = g.First().User.UsernameUncased,
                TotalScore = g.Sum(up => up.Score),
                CompletedChallenges = g.Count(up => up.Completed)
            })
            .OrderByDescending(e => e.TotalScore)
            .Take(_appConfig.TotalLeaderboardEntries)
            .ToListAsync();

        return new LeaderboardDto
        {
            LanguageId = languageId,
            Entries = topUsers
        };
    }
}
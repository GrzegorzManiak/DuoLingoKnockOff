using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.DTO;

namespace DuoLingoKnockOff.Data.Repos.Interfaces;

public interface IUserStreakRepository
{
    Task<UserStreak> AddAsync(UserStreak userStreak);
    Task<UserStreakDto> GetUserStreakAsync(int userId);
    
    // -- The idea is to have leaderboards like Duolingo, a streak being
    //    a number of days in a row the user has logged in and completed
    //    a lesson / challenge.
    Task<bool> UpdateUserStreakAsync(int userId);
} 
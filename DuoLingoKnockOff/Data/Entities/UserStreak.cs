// ReSharper disable PropertyCanBeMadeInitOnly.Global
#pragma warning disable CS8618
namespace DuoLingoKnockOff.Data.Entities;

public class UserStreak
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CurrentStreak { get; set; }
    public int MaxStreak { get; set; }
    public DateTime LastSuccessfulAttempt { get; set; }
    public DateTime CurrentStreakStartDate { get; set; }
    public User User { get; set; }
}
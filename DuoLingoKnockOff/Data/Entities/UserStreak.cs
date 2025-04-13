// ReSharper disable PropertyCanBeMadeInitOnly.Global
#pragma warning disable CS8618
namespace DuoLingoKnockOff.Data.Entities;

public class UserStreak
{
    public int Id { get; set; }
    public int UserId { get; set; }
    
    public int CurrentStreak { get; set; }
    public int MaxStreak { get; set; }
    public DateTime LastActivity { get; set; }
    
    public User User { get; set; }
}
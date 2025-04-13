// ReSharper disable PropertyCanBeMadeInitOnly.Global
#pragma warning disable CS8618
namespace DuoLingoKnockOff.Data.Entities;

public class UserProgress
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ChallengeId { get; set; }
    public int Attempts { get; set; }
    public int Score { get; set; }
    public bool Completed { get; set; }
    public DateTime? CompletedDate { get; set; }
    public DateTime LastAttemptDate { get; set; }
        
    public User User { get; set; }
    public Challenge Challenge { get; set; }
}
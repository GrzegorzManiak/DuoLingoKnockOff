namespace DuoLingoKnockOff.DTO;

public class UserStreakDto
{
    public int CurrentStreak { get; set; }
    public int MaxStreak { get; set; }
    public DateTime LastSuccessfulAttempt { get; set; }
    public DateTime CurrentStreakStartDate { get; set; }
    public int StreakDays => (int)(DateTime.UtcNow - CurrentStreakStartDate).TotalDays;
} 
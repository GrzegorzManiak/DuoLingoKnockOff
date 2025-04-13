namespace DuoLingoKnockOff.Data.Context;

public class AppConfig
{
    public int TokenValidDays { get; set; } = 7;
    public int TotalLeaderboardEntries { get; set; } = 30;
    public int ChallengeScorePenalty { get; set; } = 20;
}
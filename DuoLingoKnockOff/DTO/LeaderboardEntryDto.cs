namespace DuoLingoKnockOff.DTO;

public class LeaderboardEntryDto
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public int TotalScore { get; set; }
    
    // TODO: If the ui feels too empty for this ill add a break
    // down interms of the difficulty levels completed
    public int CompletedChallenges { get; set; }
}
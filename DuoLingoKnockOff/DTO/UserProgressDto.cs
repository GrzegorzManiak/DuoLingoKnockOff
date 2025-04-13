namespace DuoLingoKnockOff.DTO;

public class UserProgressDto
{
    public int UserId { get; set; }
    public ICollection<LanguageProgressDto> LanguageProgress { get; set; }
    public int CurrentStreak { get; set; }
    public int MaxStreak { get; set; }
    public DateTime LastActivity { get; set; }
}
namespace DuoLingoKnockOff.DTO;

public class UserProgressDto
{
    public int UserId { get; set; }
    public ICollection<LanguageProgressDto> LanguageProgress { get; set; }
    public UserStreakDto Streak { get; set; }
}
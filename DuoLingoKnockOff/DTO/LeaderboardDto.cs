namespace DuoLingoKnockOff.DTO;

public class LeaderboardDto
{
    public int LanguageId { get; set; }
    public ICollection<LeaderboardEntryDto> Entries { get; set; }
}
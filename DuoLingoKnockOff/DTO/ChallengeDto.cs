using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Helpers.Challenges;

namespace DuoLingoKnockOff.DTO;

public class ChallengeDto
{
    public int Id { get; set; }
    public int LanguageId { get; set; }
    public string Content { get; set; } = string.Empty;
    public ChallengeType Type { get; set; }
    public Difficulty Difficulty { get; set; }
    
    public static ChallengeDto FromEntity(Challenge challenge)
    {
        return new ChallengeDto
        {
            Id = challenge.Id,
            LanguageId = challenge.LanguageId,
            Content = challenge.Content,
            Type = challenge.Type,
            Difficulty = challenge.Difficulty
        };
    }
} 
// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618
using DuoLingoKnockOff.Helpers.Challenges;

namespace DuoLingoKnockOff.Data.Entities;

public class Challenge
{
    public int Id { get; set; }
    public int LanguageId { get; set; }
    public int UserId { get; set; }
    public int UserProgressId { get; set; }

    // -- Stored as JSON since i want multiple types of
    //    challanges, otherwise there'd have to be a table
    //    for each type of challenge.
    public string Content { get; set; } 
    public ChallengeType Type { get; set; }
    public Difficulty Difficulty { get; set; }
    public int SequenceOrder { get; set; }
    
    public Language Language { get; set; }
    public User User { get; set; }
    public UserProgress UserProgress { get; set; }
}
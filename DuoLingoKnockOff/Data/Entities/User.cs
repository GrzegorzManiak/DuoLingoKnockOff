// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable CollectionNeverQueried.Global
// ReSharper disable CollectionNeverUpdated.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
#pragma warning disable CS8618
namespace DuoLingoKnockOff.Data.Entities;

public class User
{
    public int Id { get; set; }

    public string Username { get; set; }
    public string Email { get; set; }

    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }

    public string PreferredLanguage { get; set; }

    public DateTime DateJoined { get; set; }
    public DateTime LastActive { get; set; } 
    
    public ICollection<UserProgress> Progresses { get; set; }
    public UserStreak Streak { get; set; }
}
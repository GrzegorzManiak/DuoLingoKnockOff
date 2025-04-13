// ReSharper disable PropertyCanBeMadeInitOnly.Global
// ReSharper disable EntityFramework.ModelValidation.UnlimitedStringLength
// ReSharper disable CollectionNeverUpdated.Global
#pragma warning disable CS8618
namespace DuoLingoKnockOff.Data.Entities;

public class Language
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string FlagImageUrl { get; set; }
}
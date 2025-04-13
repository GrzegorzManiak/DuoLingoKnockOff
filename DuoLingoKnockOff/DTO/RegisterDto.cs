using System.ComponentModel.DataAnnotations;

namespace DuoLingoKnockOff.DTO;

public class RegisterDto
{
    [Required]
    public string Username { get; set; }
        
    [Required]
    [EmailAddress]
    public string Email { get; set; }
        
    [Required]
    [StringLength(20, MinimumLength = 6)]
    public string Password { get; set; }
        
    public string PreferredLanguage { get; set; } = "en";
}
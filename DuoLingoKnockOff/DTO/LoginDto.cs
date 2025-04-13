using System.ComponentModel.DataAnnotations;

namespace DuoLingoKnockOff.DTO;

public class LoginDto
{
    [Required]
    public string Username { get; set; }
        
    [Required]
    public string Password { get; set; }
}
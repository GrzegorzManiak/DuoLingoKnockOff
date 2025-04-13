using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using DuoLingoKnockOff.Helpers;
using DuoLingoKnockOff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DuoLingoKnockOff.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserRepository userRepository, IUserStreakRepository userStreakRepository, ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var (usernameCased, usernameUncased) = UsernameHelper.GetUsernameVariants(registerDto.Username);
        if (await userRepository.GetUserByUsernameAsync(usernameUncased) != null)
            return BadRequest("Username is taken");
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
        
        var user = new User
        {
            UsernameCased = usernameCased,
            UsernameUncased = usernameUncased,
            Email = registerDto.Email,
            PasswordHash = hashedPassword,
            PreferredLanguage = registerDto.PreferredLanguage,
            DateJoined = DateTime.UtcNow,
            LastActive = DateTime.UtcNow
        };
        
        var streak = new UserStreak
        {
            CurrentStreak = 0,
            MaxStreak = 0,
            LastSuccessfulAttempt = DateTime.UtcNow,
            CurrentStreakStartDate = DateTime.UtcNow,
            User = user,
            UserId = user.Id
        };
        
        user.Streak = streak;
        await userRepository.AddAsync(user);
        await userStreakRepository.AddAsync(streak);
        await userRepository.SaveAllAsync();
        
        return new UserDto
        {
            Id = user.Id,
            Username = user.UsernameUncased,
            UsernameCased = user.UsernameCased,
            Token = tokenService.CreateToken(user),
            PreferredLanguage = user.PreferredLanguage
        };
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(loginDto.Username);
        if (user == null) return Unauthorized("Invalid username");
        
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            return Unauthorized("Invalid password");
        
        user.LastActive = DateTime.UtcNow;
        await userRepository.SaveAllAsync();
        
        return new UserDto
        {
            Id = user.Id,
            Username = user.UsernameUncased,
            UsernameCased = user.UsernameCased,
            Token = tokenService.CreateToken(user),
            PreferredLanguage = user.PreferredLanguage
        };
    }
}
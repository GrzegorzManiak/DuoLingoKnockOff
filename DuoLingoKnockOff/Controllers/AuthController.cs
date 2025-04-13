using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using DuoLingoKnockOff.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DuoLingoKnockOff.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserRepository userRepository, ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {

    }
    
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {

    }
}
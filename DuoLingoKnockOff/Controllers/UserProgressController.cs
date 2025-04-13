using System.Security.Claims;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using DuoLingoKnockOff.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DuoLingoKnockOff.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UserController(IUserRepository userRepository) : ControllerBase
{
    [HttpGet("progress")]
    public async Task<ActionResult<UserProgressDto>> GetProgress()
    {
        var userId = User.GetUserId();
        var progress = await userRepository.GetUserProgressAsync(userId);
        if (progress == null) return NotFound();
        return Ok(progress);
    }
}
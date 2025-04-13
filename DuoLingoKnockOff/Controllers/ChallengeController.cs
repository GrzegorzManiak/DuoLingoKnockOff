using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using DuoLingoKnockOff.Helpers;
using DuoLingoKnockOff.Helpers.Challenges;
using DuoLingoKnockOff.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DuoLingoKnockOff.Controllers;

[ApiController]
[Route("api/languages/{languageId}/[controller]")]
[Authorize]
public class ChallengeController(IChallengeService challengeService, IUserStreakRepository userStreakRepository) : ControllerBase
{
    [HttpPost("new")]
    public async Task<ActionResult<ChallengeDto>> GenerateNewChallenge(int languageId, [FromQuery] Difficulty difficulty)
    {
        try
        {
            return Ok(await challengeService.GenerateUserChallenge(User.GetUserId(), languageId, difficulty));
        }
        
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while generating the challenge");
        }
    }

    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<ChallengeDto>>> GetCompletedChallenges(
        int languageId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            return Ok(await challengeService.GetCompletedChallenges(User.GetUserId(), languageId, page, pageSize));
        }
        
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while retrieving completed challenges");
        }
    }

    [HttpGet("attempting")]
    public async Task<ActionResult<IEnumerable<ChallengeDto>>> GetAttemptingChallenges(
        int languageId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            return Ok(await challengeService.GetAttemptingChallenges( User.GetUserId(), languageId, page, pageSize));
        }
        
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while retrieving attempting challenges");
        }
    }

    [HttpPut("{challengeId}")]
    public async Task<ActionResult> UpdateChallengeProgress(
        int challengeId,
        [FromBody] ChallengeUpdateDto updateDto)
    {
        try
        {
            await challengeService.UpdateUserProgress(User.GetUserId(), challengeId, updateDto.IsCorrect);
            if (updateDto.IsCorrect) await userStreakRepository.UpdateUserStreakAsync(User.GetUserId());
            return Ok();
        }
        
        catch (InvalidOperationException ex)
        {
            return NotFound("Challenge progress not found");
        }
        
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while updating the challenge progress");
        }
    }
} 
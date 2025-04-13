using DuoLingoKnockOff.Data.Entities;
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
public class ChallengeController(IChallengeService challengeService, ILogger<ChallengeController> logger)
    : ControllerBase
{
    [HttpPost("new")]
    public async Task<ActionResult<Challenge>> GenerateNewChallenge(int languageId, [FromQuery] Difficulty difficulty)
    {
        try
        {
            return Ok(challengeService.GenerateUserChallenge(User.GetUserId(), languageId, difficulty));
        }
        
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating new challenge for user [{UserId}] and language [{LanguageId}]", User.GetUserId(), languageId);
            return StatusCode(500, "An error occurred while generating the challenge");
        }
    }

    [HttpGet("completed")]
    public async Task<ActionResult<IEnumerable<Challenge>>> GetCompletedChallenges(
        int languageId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            return Ok(challengeService.GetCompletedChallenges(User.GetUserId(), languageId, page, pageSize));
        }
        
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving completed challenges for user [{UserId}] and language [{LanguageId}]", User.GetUserId(), languageId);
            return StatusCode(500, "An error occurred while retrieving completed challenges");
        }
    }

    [HttpGet("attempting")]
    public async Task<ActionResult<IEnumerable<Challenge>>> GetAttemptingChallenges(
        int languageId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        try
        {
            return Ok(challengeService.GetAttemptingChallenges(User.GetUserId(), languageId, page, pageSize));
        }
        
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving attempting challenges for user [{UserId}] and language [{LanguageId}]", User.GetUserId(), languageId);
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
            return Ok();
        }
        
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Challenge progress not found for user [{UserId}] and challenge [{ChallengeId}]", User.GetUserId(), challengeId);
            return NotFound("Challenge progress not found");
        }
        
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating challenge progress for user [{UserId}] and challenge [{ChallengeId}]", User.GetUserId(), challengeId);
            return StatusCode(500, "An error occurred while updating the challenge progress");
        }
    }
} 
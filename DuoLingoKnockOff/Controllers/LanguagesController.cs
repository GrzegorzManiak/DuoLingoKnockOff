using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DuoLingoKnockOff.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LanguagesController(ILanguageRepository languageRepository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Language>>> GetLanguages()
    {
        return Ok(await languageRepository.GetAllAsync());
    }
    
    [HttpGet("{id}/leaderboard")]
    public async Task<ActionResult<LeaderboardDto>> GetLeaderboard(int id)
    {
        var language = await languageRepository.GetByIdAsync(id);
        if (language == null) return NotFound();
        var leaderboard = await languageRepository.GetLeaderboardForLanguageAsync(id);
        return Ok(leaderboard);
    }
}
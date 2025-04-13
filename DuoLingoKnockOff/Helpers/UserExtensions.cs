using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace DuoLingoKnockOff.Helpers;

public static class UserExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
        
        if (string.IsNullOrEmpty(userIdClaim))
            throw new InvalidOperationException("User ID not found in claims");
        
        if (!int.TryParse(userIdClaim, out var userId))
            throw new InvalidOperationException("Invalid user ID format in claims");

        return userId;
    }
} 
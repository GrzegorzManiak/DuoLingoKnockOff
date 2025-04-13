using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Entities;
using DuoLingoKnockOff.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

namespace DuoLingoKnockOff.Services.Implementations;

public class TokenService(IConfiguration config, IOptions<AppConfig> appConfig) : ITokenService
{
    private readonly SymmetricSecurityKey _key = new(
        Encoding.UTF8.GetBytes(
            config["TokenKey"] ?? 
            throw new ArgumentNullException("TokenKey", "TokenKey is not configured")
        )
    );
    
    private SigningCredentials? _signingCredentials;
    
    private readonly AppConfig _appConfig = appConfig.Value;

    public string CreateToken(User user)
    {
        _signingCredentials ??= new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
        
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UsernameUncased)
        };
        
        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_appConfig.TokenValidDays),
            signingCredentials: _signingCredentials
        );
            
        return new JwtSecurityTokenHandler().WriteToken(token);

        // var tokenDescriptor = new SecurityTokenDescriptor
        // {
        //     Subject = new ClaimsIdentity(claims),
        //     Expires = DateTime.Now.AddDays(_appConfig.TokenValidDays),
        //     SigningCredentials = _signingCredentials
        // };
        //
        // var tokenHandler = new JwtSecurityTokenHandler();
        // var token = tokenHandler.CreateToken(tokenDescriptor);
        //
        // return tokenHandler.WriteToken(token);
    }
}
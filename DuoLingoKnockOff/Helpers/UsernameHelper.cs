namespace DuoLingoKnockOff.Helpers;

public static class UsernameHelper
{
    public static string NormalizeUsername(string username)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Username cannot be null or whitespace", nameof(username));

        return username.Trim();
    }

    public static (string UsernameCased, string UsernameUncased) GetUsernameVariants(string username)
    {
        var normalized = NormalizeUsername(username);
        return (normalized, normalized.ToLowerInvariant());
    }
}
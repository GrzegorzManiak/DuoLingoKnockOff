using System.Text.Json;

namespace DuoLingoKnockOff.Helpers.Challenges;

public enum Difficulty
{
    Easy,
    Medium,
    Hard
}

public abstract class ChallengeService
{
    public abstract Dictionary<string, object> GenerateChallenge(Difficulty difficulty);
    public abstract string SerializeChallenge(Dictionary<string, object> challenge);

    protected int GetDisplayCountForDifficulty(Difficulty difficulty)
    {
        return difficulty switch
        {
            Difficulty.Easy => 3,
            Difficulty.Medium => 4,
            Difficulty.Hard => 6,
            _ => 4
        };
    }
} 
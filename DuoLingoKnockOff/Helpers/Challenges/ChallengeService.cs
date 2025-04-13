using System.Text.Json;

namespace DuoLingoKnockOff.Helpers.Challenges;

public enum Difficulty
{
    Easy,
    Medium,
    Hard
}

public class DifficultyHelper
{
    public static int GetDifficulityMultiplier(Difficulty difficulty)
    {
        return difficulty switch
        {
            Difficulty.Easy => 1,
            Difficulty.Medium => 2,
            Difficulty.Hard => 3,
            _ => 1
        };
    } 
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
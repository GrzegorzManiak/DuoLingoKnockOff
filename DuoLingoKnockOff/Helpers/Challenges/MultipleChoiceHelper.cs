using System.Text.Json;

namespace DuoLingoKnockOff.Helpers.Challenges;

public enum QuestionType
{
    WhatDoesXMean,
    WhatIsThePluralOfX,
    WhatIsTheCorrectTranslation,
    WhatIsTheCorrectArticle,
    WhatIsTheCorrectConjugation
}

public class MultipleChoiceHelper : ChallengeService
{
    private static readonly Dictionary<QuestionType, string> QuestionLocalizationKeys = new()
    {
        { QuestionType.WhatDoesXMean, "challenges.questions.whatDoesXMean" },
        { QuestionType.WhatIsThePluralOfX, "challenges.questions.whatIsThePluralOfX" },
        { QuestionType.WhatIsTheCorrectTranslation, "challenges.questions.whatIsTheCorrectTranslation" },
        { QuestionType.WhatIsTheCorrectArticle, "challenges.questions.whatIsTheCorrectArticle" },
        { QuestionType.WhatIsTheCorrectConjugation, "challenges.questions.whatIsTheCorrectConjugation" }
    };

    public override Dictionary<string, object> GenerateChallenge(Difficulty difficulty)
    {
        // TODO: IMplement
        return CreateMultipleChoiceChallenge(
            "hello",
            "hola",
            new List<string> { },
            QuestionType.WhatDoesXMean,
            GetDisplayCountForDifficulty(difficulty)
        );
    }

    public Dictionary<string, object> CreateMultipleChoiceChallenge(
        string word,
        string correctAnswer,
        List<string> answerPool,
        QuestionType questionType = QuestionType.WhatDoesXMean,
        int displayCount = 4)
    {
        return new Dictionary<string, object>
        {
            { "question", QuestionLocalizationKeys[questionType] },
            { "parameters", new Dictionary<string, string> { { "word", word } } },
            { "answerPool", answerPool },
            { "display", displayCount },
            { "correctAnswer", correctAnswer },
            { "explanation", "challenges.explanations.hello" },
            { "explanationParameters", new Dictionary<string, string> { { "word", word } } }
        };
    }

    public override string SerializeChallenge(Dictionary<string, object> challenge)
    {
        var options = new JsonSerializerOptions();
        options.WriteIndented = true;
        return JsonSerializer.Serialize(challenge, options);
    }
} 
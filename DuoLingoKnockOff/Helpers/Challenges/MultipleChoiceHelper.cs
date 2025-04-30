using System.Text.Json;

namespace DuoLingoKnockOff.Helpers.Challenges;

public enum QuestionType
{
    WhatDoesXMean,
    WhatIsThePluralOfX
}

public struct Question
{
    public string Word { get; set; }
    public string CorrectAnswer { get; set; }
    public Difficulty Difficulty { get; set; }
}

public struct QuestionPool
{
    public QuestionType Type { get; set; }
    public List<string> AnswerPool { get; set; }
    public List<Question> Questions { get; set; }
}

public class MultipleChoiceHelper : ChallengeService
{
    private static readonly Dictionary<QuestionType, string> QuestionLocalizationKeys = new()
    {
        { QuestionType.WhatDoesXMean, "challenges.questions.whatDoesXMean" },
        { QuestionType.WhatIsThePluralOfX, "challenges.questions.whatIsThePluralOfX" }
    };
    
    private static readonly QuestionPool WhatDoesXMeanPool = new()
    {
        Type = QuestionType.WhatDoesXMean,
        AnswerPool = [
            "hello",
            "goodbye",
            "thankYou",
            "please",
            "yes",
            "no",
            "maybe",
            "sure",
            "definitely",
            "computation",
            "algorithm",
            "data",
            "information",
            "cats",
            "dogs",
            "mice",
            "birds",
            "fish",
            "cows",
            "sheep",
            "goats",
            "horses",
            "elephants",
        ],
        Questions = new List<Question>
        {
            new() { Word = "hello", CorrectAnswer = "hello", Difficulty = Difficulty.Easy },
            new() { Word = "goodbye", CorrectAnswer = "goodbye", Difficulty = Difficulty.Easy },
            new() { Word = "yes", CorrectAnswer = "yes", Difficulty = Difficulty.Easy },
            new() { Word = "no", CorrectAnswer = "no", Difficulty = Difficulty.Easy },
            new() { Word = "maybe", CorrectAnswer = "maybe", Difficulty = Difficulty.Easy },
            new() { Word = "sure", CorrectAnswer = "sure", Difficulty = Difficulty.Easy },
            new() { Word = "please", CorrectAnswer = "please", Difficulty = Difficulty.Easy },

            new() { Word = "thankYou", CorrectAnswer = "thankYou", Difficulty = Difficulty.Medium },
            new() { Word = "data", CorrectAnswer = "data", Difficulty = Difficulty.Medium },
            new() { Word = "information", CorrectAnswer = "information", Difficulty = Difficulty.Medium },
            
            new() { Word = "definitely", CorrectAnswer = "definitely", Difficulty = Difficulty.Hard },
            new() { Word = "computation", CorrectAnswer = "computation", Difficulty = Difficulty.Hard },
            new() { Word = "algorithm", CorrectAnswer = "algorithm", Difficulty = Difficulty.Hard },
        }
    };

    private static readonly QuestionPool WhatIsThePluralOfXPool = new()
    {
        Type = QuestionType.WhatIsThePluralOfX,
        AnswerPool = [
            "cats",
            "dogs",
            "mice",
            "birds",
            "fish",
            "cows",
            "sheep",
            "goats",
            "horses",
            "elephants",
        ],
        Questions = new List<Question>
        {
            new() { Word = "cat", CorrectAnswer = "cats", Difficulty = Difficulty.Easy },
            new() { Word = "dog", CorrectAnswer = "dogs", Difficulty = Difficulty.Easy },
            new() { Word = "mouse", CorrectAnswer = "mice", Difficulty = Difficulty.Easy },
            new() { Word = "bird", CorrectAnswer = "birds", Difficulty = Difficulty.Easy },
            new() { Word = "fish", CorrectAnswer = "fish", Difficulty = Difficulty.Easy },
            new() { Word = "cow", CorrectAnswer = "cows", Difficulty = Difficulty.Easy },
            new() { Word = "sheep", CorrectAnswer = "sheep", Difficulty = Difficulty.Easy },

            new() { Word = "goat", CorrectAnswer = "goats", Difficulty = Difficulty.Medium },
            new() { Word = "horse", CorrectAnswer = "horses", Difficulty = Difficulty.Medium },
            
            new() { Word = "elephant", CorrectAnswer = "elephants", Difficulty = Difficulty.Hard },
        }
    };
    
    public override Dictionary<string, object> GenerateChallenge(Difficulty difficulty)
    {
        var random = new Random();
        var pool = random.Next(2) == 0 ? WhatDoesXMeanPool : WhatIsThePluralOfXPool;
        var availableQuestions = pool.Questions
            .Where(q => q.Difficulty == difficulty)
            .ToList();
            
        if (availableQuestions.Count == 0)
            throw new InvalidOperationException($"No questions available for difficulty {difficulty}");
        
        var question = availableQuestions[random.Next(availableQuestions.Count)];
        var displayCount = GetDisplayCountForDifficulty(difficulty);
        var answerPool = new List<string> { question.CorrectAnswer };
        
        var incorrectAnswers = pool.AnswerPool
            .Where(a => a != question.CorrectAnswer)
            .OrderBy(_ => random.Next())
            .Take(displayCount - 1)
            .ToList();
            
        answerPool.AddRange(incorrectAnswers);
        answerPool = answerPool.OrderBy(_ => random.Next()).ToList();
        
        return CreateMultipleChoiceChallenge(
            question.Word,
            question.CorrectAnswer,
            answerPool,
            pool.Type,
            displayCount
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
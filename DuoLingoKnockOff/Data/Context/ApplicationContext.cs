using DuoLingoKnockOff.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace DuoLingoKnockOff.Data.Context;

public class ApplicationContext(DbContextOptions<ApplicationContext> options) : DbContext(options)
{
    // -- Tables
    public DbSet<User?> Users { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Challenge> Challenges { get; set; }
    public DbSet<UserStreak> UserStreaks { get; set; }
    public DbSet<UserProgress> UserProgresses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // -- Default config
        base.OnModelCreating(modelBuilder);
        
        // -- Relationships
        modelBuilder.Entity<Challenge>()
            .HasOne(c => c.Language)
            .WithMany(l => l.Challenges)
            .HasForeignKey(c => c.LanguageId);
            
        modelBuilder.Entity<UserProgress>()
            .HasKey(up => new { up.UserId, up.ChallengeId });
            
        modelBuilder.Entity<UserProgress>()
            .HasOne(up => up.User)
            .WithMany(u => u.Progresses)
            .HasForeignKey(up => up.UserId);
            
        modelBuilder.Entity<UserProgress>()
            .HasOne(up => up.Challenge)
            .WithMany(c => c.UserProgresses)
            .HasForeignKey(up => up.ChallengeId);
            
        modelBuilder.Entity<UserStreak>()
            .HasOne(us => us.User)
            .WithOne(u => u.Streak)
            .HasForeignKey<UserStreak>(us => us.UserId);
        
        // -- Seed data
        Seed(modelBuilder);
    }

    private void Seed(ModelBuilder modelBuilder)
    {
        // -- TODO: Add something a lil more interesting
        modelBuilder.Entity<Language>().HasData(
            new Language { Id = 1, Name = "Spanish", Code = "es", FlagImageUrl = "spain.png", Difficulty = "Beginner" },
            new Language { Id = 2, Name = "French", Code = "fr", FlagImageUrl = "france.png", Difficulty = "Beginner" },
            new Language { Id = 3, Name = "German", Code = "de", FlagImageUrl = "germany.png", Difficulty = "Beginner" },
            new Language { Id = 4, Name = "Italian", Code = "it", FlagImageUrl = "italy.png", Difficulty = "Beginner" }
        );
    }
}
using DuoLingoKnockOff.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DuoLingoKnockOff.Data.Context;

public class ApplicationContext(DbContextOptions<ApplicationContext> options) : DbContext(options)
{
    // -- Tables
    public DbSet<User?> Users { get; set; }
    public DbSet<Language> Languages { get; set; }
    public DbSet<Challenge> Challenges { get; set; }
    public DbSet<UserStreak> UserStreaks { get; set; }
    public DbSet<UserProgress> UserProgress { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // -- Default config
        base.OnModelCreating(modelBuilder);
        
        // -- Relationships
        modelBuilder.Entity<Challenge>()
            .HasOne(c => c.Language)
            .WithMany()
            .HasForeignKey(c => c.LanguageId);
            
        modelBuilder.Entity<UserProgress>()
            .HasKey(up => up.Id);

        modelBuilder.Entity<UserProgress>()
            .Property(up => up.Id)
            .ValueGeneratedOnAdd();

        modelBuilder.Entity<UserProgress>()
            .HasOne(up => up.User)
            .WithMany(u => u.Progresses)
            .HasForeignKey(up => up.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserProgress>()
            .HasOne(up => up.Challenge)
            .WithMany()
            .HasForeignKey(up => up.ChallengeId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<UserStreak>()
            .HasOne(us => us.User)
            .WithOne(u => u.Streak)
            .HasForeignKey<UserStreak>(us => us.UserId);

        // -- Seed data
        Seed(modelBuilder);
    }

    private void Seed(ModelBuilder modelBuilder)
    {
        // -- Languages
        modelBuilder.Entity<Language>().HasData(
            new Language { Id = 1, Name = "Spanish", Code = "es", FlagImageUrl = "images/flags/spain.png", NativeName = "Español" },
            new Language { Id = 2, Name = "French", Code = "fr", FlagImageUrl = "images/flags/france.png", NativeName = "Français" },
            new Language { Id = 3, Name = "German", Code = "de", FlagImageUrl = "images/flags/germany.png", NativeName = "Deutsch" }
        );
    }
}
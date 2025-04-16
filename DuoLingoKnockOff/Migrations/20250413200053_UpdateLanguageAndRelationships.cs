using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DuoLingoKnockOff.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLanguageAndRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "Languages");

            migrationBuilder.DropColumn(
                name: "TotalChallenges",
                table: "Languages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "Languages",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "TotalChallenges",
                table: "Languages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Languages",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Difficulty", "TotalChallenges" },
                values: new object[] { "Beginner", 3 });

            migrationBuilder.UpdateData(
                table: "Languages",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Difficulty", "TotalChallenges" },
                values: new object[] { "Beginner", 3 });

            migrationBuilder.UpdateData(
                table: "Languages",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Difficulty", "TotalChallenges" },
                values: new object[] { "Beginner", 3 });
        }
    }
}

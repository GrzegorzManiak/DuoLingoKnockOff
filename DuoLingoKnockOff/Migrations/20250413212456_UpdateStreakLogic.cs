using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DuoLingoKnockOff.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStreakLogic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastActivity",
                table: "UserStreaks",
                newName: "LastSuccessfulAttempt");

            migrationBuilder.AddColumn<DateTime>(
                name: "CurrentStreakStartDate",
                table: "UserStreaks",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentStreakStartDate",
                table: "UserStreaks");

            migrationBuilder.RenameColumn(
                name: "LastSuccessfulAttempt",
                table: "UserStreaks",
                newName: "LastActivity");
        }
    }
}

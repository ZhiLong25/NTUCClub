using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NTUCClub.Migrations
{
    /// <inheritdoc />
    public partial class queries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QueryReply",
                table: "Queries",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cart");

            migrationBuilder.DropColumn(
                name: "QueryReply",
                table: "Queries");
        }
    }
}

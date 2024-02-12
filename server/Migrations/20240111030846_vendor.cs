using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace NTUCClub.Migrations
{
    /// <inheritdoc />
    public partial class vendor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Services",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Services",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Vendor",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vendor", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Services_Category_CategoryID",
                table: "Services");

            migrationBuilder.DropTable(
                name: "Vendor");

            migrationBuilder.DropIndex(
                name: "IX_Services_CategoryID",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Services");
        }
    }
}

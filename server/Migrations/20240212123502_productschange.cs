using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace NTUCClub.Migrations
{
    /// <inheritdoc />
    public partial class productschange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Services_Category_CategoryID",
                table: "Services");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropIndex(
                name: "IX_Services_CategoryID",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Services");

            migrationBuilder.CreateIndex(
                name: "IX_Wishlist_ServiceId",
                table: "Wishlist",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_cart_ServiceId",
                table: "cart",
                column: "ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wishlist_Services_ServiceId",
                table: "Wishlist",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wishlist_Services_ServiceId",
                table: "Wishlist");

            migrationBuilder.DropTable(
                name: "cart");

            migrationBuilder.DropIndex(
                name: "IX_Wishlist_ServiceId",
                table: "Wishlist");

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Services",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    Image = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Services_CategoryID",
                table: "Services",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Services_Category_CategoryID",
                table: "Services",
                column: "CategoryID",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

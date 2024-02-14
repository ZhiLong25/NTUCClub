﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace NTUCClub.Migrations
{
    /// <inheritdoc />
    public partial class removeVoucher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vouchers");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    Activity_ID = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    User_ID = table.Column<int>(type: "int", nullable: false),
                    Voucher_Details = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    Voucher_Image = table.Column<string>(type: "longtext", nullable: false),
                    Voucher_Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Voucher_Quantity = table.Column<int>(type: "int", nullable: false),
                    Voucher_Validity = table.Column<DateTimeOffset>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vouchers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Vouchers_UserId",
                table: "Vouchers",
                column: "UserId");
        }
    }
}

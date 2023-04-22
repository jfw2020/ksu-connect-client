USE [twpowell]; -- Your database here.

/*********************
 * Drop Tables
 *********************/

IF SCHEMA_Id(N'KSUConnect') IS NULL
   EXEC(N'CREATE SCHEMA [KSUConnect];');
GO

DROP TABLE IF EXISTS KSUConnect.UserMajors;
DROP TABLE IF EXISTS KSUConnect.UserCategories;
DROP TABLE IF EXISTS KSUConnect.PostCategories;
DROP TABLE IF EXISTS KSUConnect.Categories;
DROP TABLE IF EXISTS KSUConnect.Majors;
DROP TABLE IF EXISTS KSUConnect.Posts;
DROP TABLE IF EXISTS KSUConnect.Followers;
DROP TABLE IF EXISTS KSUConnect.Users;
DROP TABLE IF EXISTS KSUConnect.SchoolStatuses;
GO

/******************
 * Create Tables
 ******************/

CREATE TABLE KSUConnect.SchoolStatuses
(
   SchoolStatusId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
   [Status] NVARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE KSUConnect.Users
(
   UserId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
   Username NVARCHAR(32) NOT NULL UNIQUE,
   PasswordHash NVARCHAR(64) NOT NULL,
   FirstName NVARCHAR(32) NOT NULL,
   LastName NVARCHAR(32) NOT NULL,
   ImageUrl NVARCHAR(128) NULL,
   SchoolStatusId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.SchoolStatuses(SchoolStatusId),
   CreatedOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET()),
   UpdatedOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())
);

CREATE TABLE KSUConnect.Posts
(
   PostId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
   UserId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Users(UserId),
   Content NVARCHAR(1024) NOT NULL,
   CreatedOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET()),
   UpdatedOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())
);

CREATE TABLE KSUConnect.Followers
(
   FollowerId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Users(UserId),
   FollowingId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Users(UserId),
   CreatedOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())

   CONSTRAINT PK_Followers PRIMARY KEY
   (
      FollowerId,
      FollowingId
   )
);

CREATE TABLE KSUConnect.Majors
(
   MajorId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
   [Name] NVARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE KSUConnect.Categories
(
   CategoryId INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
   [Name] NVARCHAR(64) NOT NULL UNIQUE,
   MajorId INT NULL FOREIGN KEY 
      REFERENCES KSUConnect.Majors(MajorId)
);

CREATE TABLE KSUConnect.UserMajors
(
   UserMajorId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
   UserId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Users(UserId),
   MajorId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Majors(MajorId)
);

CREATE TABLE KSUConnect.UserCategories
(
   UserCategoriesId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
   UserId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Users(UserId),
   CategoryId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Categories(CategoryId)
);

CREATE TABLE KSUConnect.PostCategories
(
   UserMajorId INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
   PostId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Posts(PostId),
   CategoryId INT NOT NULL FOREIGN KEY
      REFERENCES KSUConnect.Categories(CategoryId)
);
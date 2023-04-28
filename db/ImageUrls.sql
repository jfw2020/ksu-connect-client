UPDATE KSUConnect.Users
SET ImageUrl = N'https://picsum.photos/id/' + CAST(ABS(CHECKSUM(NEWID())) % 100 AS NVARCHAR(3)) + N'/200'
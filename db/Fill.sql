-- TODO: Followers connection generation didn't work
UPDATE KSUConnect.Users
SET ImageUrl = N'https://picsum.photos/id/' + CAST(ABS(CHECKSUM(NEWID())) % 100 AS NVARCHAR(3)) + N'/200'

-- Insert Followers with random data
DECLARE @limit INT = 1;
DECLARE @userCount INT;
SELECT @userCount = COUNT(*) FROM KSUConnect.Users;

WHILE @limit <= (@userCount/2)
BEGIN
    DECLARE @followerId INT = (SELECT TOP 1 UserId FROM KSUConnect.Users ORDER BY NEWID());
    DECLARE @followingId INT = (SELECT TOP 1 UserId FROM KSUConnect.Users WHERE UserId != @followerId ORDER BY NEWID());
    
    INSERT INTO KSUConnect.Followers(FollowerId, FollowingId) VALUES (@followerId, @followingId);
    
    SET @limit = @limit + 1;
END
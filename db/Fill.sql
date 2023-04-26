-- TODO: Followers connection generation didn't work

-- Insert Users with random data
INSERT INTO KSUConnect.Users(Username, PasswordHash, FirstName, LastName, SchoolStatusId)
SELECT 
    CONCAT('user', ROW_NUMBER() OVER(ORDER BY (SELECT NULL))), -- generate username
    'password', -- static password
    LEFT(NEWID(), 10), -- generate random first name
    LEFT(NEWID(), 10), -- generate random last name
    SS.SchoolStatusId -- assign random school status
FROM KSUConnect.SchoolStatuses SS
CROSS JOIN (SELECT TOP 100 * FROM sys.objects) AS O; -- generate 100 random rows

-- Insert UserMajors with random data
INSERT INTO KSUConnect.UserMajors(UserId, MajorId)
SELECT 
    U.UserId,
    M.MajorId
FROM KSUConnect.Users U
CROSS JOIN KSUConnect.Majors M
WHERE RAND() < 0.3; -- randomly assign a major to 30% of users

-- Insert UserCategories with random data
INSERT INTO KSUConnect.UserCategories(UserId, CategoryId)
SELECT 
    U.UserId,
    C.CategoryId
FROM KSUConnect.Users U
CROSS JOIN KSUConnect.Categories C
WHERE RAND() < 0.5; -- randomly assign a category to 50% of users

-- Insert Posts with random data
INSERT INTO KSUConnect.Posts(UserId, Content)
SELECT 
    U.UserId,
    CONCAT('Hello from user ', U.UserId, '! ', LEFT(NEWID(), 50)) -- generate random post content
FROM KSUConnect.Users U
CROSS JOIN (SELECT TOP 100 * FROM sys.objects) AS O -- generate 100 random rows
WHERE RAND() < 0.2; -- randomly generate a post for 20% of users

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
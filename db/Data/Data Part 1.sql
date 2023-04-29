/******************
 * Insert Initial
 * Values
 ******************/

-- Static DO NOT ADD
INSERT KSUConnect.SchoolStatuses([Status])
VALUES 
   (N'Freshman'),
   (N'Sophomore'),
   (N'Junior'),
   (N'Senior'),
   (N'Grad Student'),
   (N'Alumni'),
   (N'Faculty')

INSERT KSUConnect.Majors([Name])
VALUES
    (N'Computer Science'),
    (N'Computer Engineering'),
    (N'Undecided'),
    (N'Cybersecurity'),
    (N'Mechanical Engineering'),
    (N'Secondary Education'),
    (N'Agriculture Economics'),
    (N'Finance'),
    (N'Accounting'),
    (N'Architecture'),
    (N'Art'),
    (N'Bakery Science'),
    (N'Chemistry'),
    (N'Criminology'),
    (N'Philosophy'),
    (N'Psychology'),
    (N'Sociology'),
    (N'Electrical Engineering'),
    (N'Nuclear Engineering'),
    (N'Biology')

INSERT KSUConnect.Categories([Name], MajorId)
SELECT M.[Name], M.MajorID
FROM KSUConnect.Majors M

INSERT KSUConnect.Categories([Name])
VALUES
    (N'Basketball'),
    (N'Video Games'),
    (N'Football'),
    (N'Greek Life'),
    (N'Networking'),
    (N'Engineering'),
    (N'Campus News'),
    (N'Music'),
    (N'Theatre'),
    (N'KSU Band'),
    (N'Student Clubs'),
    (N'Student Government'),
    (N'Awards & Accolades'),
    (N'Alumni'),
    (N'Diversity & Inclusion')
-- Static DO NOT ADD

INSERT KSUConnect.Users(Username, PasswordHash, FirstName, LastName, SchoolStatusId)
VALUES
    (N'jfw2020', N'password', N'Jacob', N'Williams', 4),
    (N'tpowell', N'password', N'Trent', N'Powell', 3),
    (N'whackemer', N'password', N'Will', N'Hackemer', 2),
    (N'jmhervey', N'password', N'Joel', N'Hervey', 2);

INSERT KSUConnect.Posts(UserId, Content)
VALUES
    (1, N'Had a great time at the KSU Foundation annual ball. Wanted to give a huge shout out to Trent Powell and Will Hackemer for being beasts!'),
    (2, N'Is your engineering team spending too much time building data pipelines instead of focusing on revenue-driving projects?💸 Learn how Fivetran helps thousands of data-driven companies like yours automate their data movement, saving them time and money.📈'),
    (3, N'Our employees take pride in connecting with local students and programs to share insights highlighting the importance of STEM, advancements within the robotics industry, and exploring career paths to go #BeyondTheFinish. Recently, our partners and mentees from the Newton College and Career Academy won the 2023 Georgia state robotics championship, showcasing their dedication for the future of robotics. Thank you to everyone who contributed, and happy #RoboWeek! #SRGGlobal');

INSERT KSUConnect.Followers(FollowerId, FollowingId)
VALUES
    (1, 3),
    (2, 3),
    (2, 1),
    (3, 2)

INSERT KSUConnect.UserMajors(UserId, MajorId)
VALUES
    (1, 1),
    (1, 8),
    (2, 3),
    (3, 7)

INSERT KSUConnect.UserCategories(UserId, CategoryId)
VALUES
    (1, 10),
    (1, 1),
    (1, 8),
    (2, 12),
    (3, 4)

INSERT KSUConnect.PostCategories(PostId, CategoryId)
VALUES
    (1, 13),
    (2, 14),
    (3, 5),
    (3, 2)

-- Update everyone's image URLs
UPDATE KSUConnect.Users
SET ImageUrl = N'https://picsum.photos/id/' + CAST(ABS(CHECKSUM(NEWID())) % 100 AS NVARCHAR(3)) + N'/200'

-- Insert Followers with random data
DECLARE @limit INT = 1;
DECLARE @userCount INT;
SELECT @userCount = COUNT(*) FROM KSUConnect.Users;

WHILE @limit <= @userCount
BEGIN
    DECLARE @followerId INT = (SELECT TOP 1 UserId FROM KSUConnect.Users ORDER BY NEWID());
    DECLARE @followingId INT = (SELECT TOP 1 UserId FROM KSUConnect.Users WHERE UserId != @followerId ORDER BY NEWID());
    
    INSERT INTO KSUConnect.Followers(FollowerId, FollowingId) VALUES (@followerId, @followingId);
    
    SET @limit = @limit + 1;
END
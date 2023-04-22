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
    (N'Finance')

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
    (N'Engineering')
-- Static DO NOT ADD

INSERT KSUConnect.Users(Username, PasswordHash, FirstName, LastName, ImageUrl, SchoolStatusId)
VALUES
    (N'jfw2020', N'password', N'Jacob', N'Williams', N'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg', 4),
    (N'tpowell', N'password', N'Trent', N'Powell', N'https://pub-static.fotor.com/assets/projects/pages/d5bdd0513a0740a8a38752dbc32586d0/fotor-03d1a91a0cec4542927f53c87e0599f6.jpg', 3),
    (N'whackemer', N'password', N'Will', N'Hackemer', N'https://marketplace.canva.com/EAE2_HrPNRU/1/0/1600w/canva-mascot-character-twitch-profile-picture-jF0b61iv4pQ.jpg', 2);

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
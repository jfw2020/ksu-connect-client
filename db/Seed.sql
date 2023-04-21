INSERT KSUConnect.Users(Username, PasswordHash, FirstName, LastName, ImageUrl)
VALUES
    (N'jfw2020', N'password', N'Jacob', N'Williams', N'https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg'),
    (N'tpowell', N'password', N'Trent', N'Powell', N'https://pub-static.fotor.com/assets/projects/pages/d5bdd0513a0740a8a38752dbc32586d0/fotor-03d1a91a0cec4542927f53c87e0599f6.jpg'),
    (N'whackemer', N'password', N'Will', N'Hackemer', N'https://marketplace.canva.com/EAE2_HrPNRU/1/0/1600w/canva-mascot-character-twitch-profile-picture-jF0b61iv4pQ.jpg');

INSERT KSUConnect.Posts(UserId, Content)
VALUES
    (1, N'Had a great time at the KSU Foundation annual ball. Wanted to give a huge shout out to Trent Powell and Will Hackemer for being beasts!'),
    (2, N'Is your engineering team spending too much time building data pipelines instead of focusing on revenue-driving projects?💸 Learn how Fivetran helps thousands of data-driven companies like yours automate their data movement, saving them time and money.📈'),
    (3, N'Our employees take pride in connecting with local students and programs to share insights highlighting the importance of STEM, advancements within the robotics industry, and exploring career paths to go #BeyondTheFinish. Recently, our partners and mentees from the Newton College and Career Academy won the 2023 Georgia state robotics championship, showcasing their dedication for the future of robotics. Thank you to everyone who contributed, and happy #RoboWeek! #SRGGlobal');
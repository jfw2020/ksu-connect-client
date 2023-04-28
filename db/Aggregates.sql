-- Rank categories by number of posts, then by user count
SELECT C.Name AS Category, COUNT(PC.PostId) AS NumberOfPosts, COUNT(UC.UserId) AS UserCount
FROM KSUConnect.Categories C
LEFT JOIN KSUConnect.PostCategories PC ON c.CategoryId = PC.CategoryId
INNER JOIN KSUConnect.UserCategories UC ON C.CategoryId = UC.CategoryId
GROUP BY C.Name
ORDER BY NumberOfPosts DESC, UserCount DESC

-- Count users per status
SELECT SchoolStatuses.Status, COUNT(*) AS CountOfUsers
FROM KSUConnect.Users
INNER JOIN KSUConnect.SchoolStatuses ON Users.SchoolStatusId = SchoolStatuses.SchoolStatusId
GROUP BY SchoolStatuses.Status
ORDER BY CountOfUsers DESC

-- Shows statistics for when Users joined
SELECT 
    DATEPART(YEAR, CreatedOn) AS Year, 
    DATEPART(MONTH, CreatedOn) AS Month, 
    COUNT(*) AS UserCount
FROM KSUConnect.Users
GROUP BY 
    DATEPART(YEAR, CreatedOn), 
    DATEPART(MONTH, CreatedOn)
ORDER BY 
    DATEPART(YEAR, CreatedOn) DESC, 
    DATEPART(MONTH, CreatedOn) DESC


-- Rank Users by follower count
SELECT U.Username, COUNT(F.FollowerId) AS FollowerCount
FROM KSUConnect.Users U
LEFT JOIN KSUConnect.Followers F ON U.UserId = F.FollowingId
GROUP BY U.UserId, U.Username
ORDER BY FollowerCount DESC

-- Shows top 10 most frequent words
SELECT TOP 10 Word, COUNT(*) AS Frequency
FROM (
    SELECT 
        value AS Word
    FROM KSUConnect.Posts
        CROSS APPLY STRING_SPLIT(Content, ' ')
) AS Words
    WHERE LEN(word) > 3 -- exclude short words
GROUP BY Word
ORDER BY Frequency DESC;

-- Shows top 10 trending topics from the past week
SELECT TOP 10 C.Name, COUNT(*) AS Count
FROM KSUConnect.Categories C
JOIN KSUConnect.PostCategories PC ON PC.CategoryId = C.CategoryId
JOIN KSUConnect.Posts P ON P.PostId = PC.PostId
WHERE P.CreatedOn >= DATEADD(WEEK, -1, GETDATE())
GROUP BY C.Name
ORDER BY Count DESC

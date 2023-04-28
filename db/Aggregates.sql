-- Rank categories by number of posts, then by user count
SELECT C.Name AS Category, COUNT(PC.PostId) AS NumberOfPosts, COUNT(UC.UserId) AS UserCount
FROM KSUConnect.Categories C
LEFT JOIN KSUConnect.PostCategories PC ON c.CategoryId = PC.CategoryId
INNER JOIN KSUConnect.UserCategories UC ON C.CategoryId = UC.CategoryId
GROUP BY C.Name
ORDER BY NumberOfPosts DESC, UserCount DESC

-- Count users per year
SELECT SchoolStatuses.Status, COUNT(*) AS CountOfUsers
FROM KSUConnect.Users
INNER JOIN KSUConnect.SchoolStatuses ON Users.SchoolStatusId = SchoolStatuses.SchoolStatusId
GROUP BY SchoolStatuses.Status
ORDER BY CountOfUsers DESC

-- Calculate average amount of followers overall
SELECT AVG(FollowerCount) AS AvgFollowers
FROM (
    SELECT COUNT(*) AS FollowerCount
    FROM KSUConnect.Followers
    GROUP BY FollowingId
) AS FollowerCounts

-- Rank Users by follower count
SELECT U.Username, COUNT(F.FollowerId) AS FollowerCount
FROM KSUConnect.Users U
LEFT JOIN KSUConnect.Followers F ON U.UserId = F.FollowingId
GROUP BY U.UserId, U.Username
ORDER BY FollowerCount DESC

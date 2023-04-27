INSERT KSUConnect.Majors([Name])
VALUES
    (N'Accounting'),
    (N'Architecture'),
    (N'Art'),
    (N'Bakery Science'),
    (N'Chemistry'),
    (N'Criminology'),
    (N'Philosophy'),
    (N'Psychology'),
    (N'Sociology'),
    (N'Theatre'),
    (N'Nuclear Engineering'),
    (N'Biology')
    
INSERT KSUConnect.Categories([Name], MajorId)
SELECT M.[Name], M.MajorID
FROM KSUConnect.Majors M

INSERT KSUConnect.Categories([Name])
VALUES
    (N'Campus News'),
    (N'Music'),
    (N'Theatre'),
    (N'KSU Band'),
    (N'Student Clubs'),
    (N'Student Government'),
    (N'Awards & Accolades'),
    (N'Alumni'),
    (N'Diversity & Inclusion')
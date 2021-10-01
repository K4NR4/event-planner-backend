USE [1087343]
GO

ALTER TABLE dbo.event
DROP CONSTRAINT IF EXISTS FK_event_users
GO

ALTER TABLE dbo.eventSchedules
DROP CONSTRAINT IF EXISTS FK_eventSchedules_event, FK_eventSchedules_users
GO

DROP TABLE IF EXISTS dbo.event
GO

DROP TABLE IF EXISTS dbo.users
GO


DROP TABLE IF EXISTS dbo.eventSchedules
GO

CREATE TABLE [users]
(
    userid INT IDENTITY NOT NULL PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    useremail NVARCHAR(255) NOT NULL UNIQUE,
    userpassword NVARCHAR(255) NOT NULL,
)
GO

CREATE TABLE [event]
(
    eventid INT IDENTITY NOT NULL PRIMARY KEY,
    eventname NVARCHAR(50) NOT NULL,
    eventdescription NVARCHAR(255) NOT NULL,
    eventweek INT NOT NULL,
    FK_userid INT NOT NULL

    CONSTRAINT FK_event_users FOREIGN KEY (FK_userid) REFERENCES [users] (userid)
)
GO

CREATE TABLE [eventSchedules]
(
    FK_eventid INT NOT NULL,
    FK_userid INT NOT NULL,
    schedulearray NVARCHAR(MAX) NOT NULL

    CONSTRAINT FK_eventSchedules_event FOREIGN KEY (FK_eventid) REFERENCES [event] (eventid),
    CONSTRAINT FK_eventSchedules_users FOREIGN KEY (FK_userid) REFERENCES [users] (userid)
)
GO

INSERT INTO [users]
    ([username], [useremail], [userpassword])
VALUES
    ('GuildMasterGary', 'gm@gmail.com', '$2a$13$moLqQmRhQTYRPlAotm3yPeFQBVIaDfHjIdEYIa9ui5gVEfLc7Vfpi'),
    ('Filip', 'filipK@gmail.com', '$2a$13$Rz9JBVi/ANUC2/gTvthmWOKBXhxFOY0hChqJ4MCEKROHiNyeRPpAy'),
    ('Andrew', 'andyS@gmail.com', '$2a$13$cYDjy0binh7gUQSbZ34i5euESCsuwDc5qbZJmBCXmasb7dbvqaAAy'),
    ('Konrad', 'konradS@gmail.com', '$2a$13$hk5JshgkrCZK6T7xRhRe/uCEeOnkLxXE6NE0zIANjU1nCezuq1YH6')
GO

INSERT INTO [event]
    ([eventname], [eventdescription], [eventweek], [FK_userid])
VALUES
    ('Dungeons & Dragons', 'game night with the boys!', 32, 1),
    ('Guild Raid', 'Raiding with the boys!', 33, 1),
    ('Movie night', 'Shanghai Noon with the boys??', 34, 1)
GO

INSERT INTO [eventSchedules]
    ([FK_eventid], [FK_userid], [schedulearray])
VALUES
    (1, 1, '["Tue Aug 17 2021 15:00:00 GMT+0200 (Central European Summer Time)"]'),
    (1, 2, '["Tue Aug 17 2021 11:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 15:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 17:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 21:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 07:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 11:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 11:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 13:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 13:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 15:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 17:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 20 2021 13:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 13:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 11:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 11:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 15:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 15:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 19:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 20 2021 17:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 17:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 17:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 15:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 16 2021 13:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 16 2021 15:00:00 GMT+0200 (Central European Summer Time)"]'),
    (1, 3, '["Tue Aug 17 2021 15:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 13:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 17:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 13:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 15:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 15:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 17:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 15:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 17:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 19:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 19:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 17:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 11:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 19:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 15:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 17:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 19:00:00 GMT+0200 (Central European Summer Time)"]'),
    (1, 4, '["Tue Aug 17 2021 15:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 16 2021 15:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 16 2021 17:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 17:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 16 2021 19:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 19:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 15:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 17:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 19:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 15:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 19:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 17:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 20 2021 15:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 20 2021 17:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 20 2021 19:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 19:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 17:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 15:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 15:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 17:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 22 2021 19:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 17 2021 13:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 18 2021 13:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 13:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 21 2021 13:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 20 2021 13:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 19 2021 11:00:00 GMT+0200 (Central European Summer Time)"]'),
    (2, 1, '["Tue Aug 24 2021 10:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 12:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 12:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 12:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 16:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 20:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 12:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 12:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 08:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 08:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 14:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 12:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 14:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 18:00:00 GMT+0200 (Central European Summer Time)"]'),
    (2, 2, '["Sat Aug 28 2021 08:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 10:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 12:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 10:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 08:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 12:00:00 GMT+0200 (Central European Summer Time)"]'),
    (2, 3, '["Tue Aug 24 2021 14:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 16:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 18:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 18:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 18:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 18:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 16:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 12:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 14:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 14:00:00 GMT+0200 (Central European Summer Time)"]'),
    (2, 4, '["Mon Aug 23 2021 16:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 23 2021 18:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 23 2021 20:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 16:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 18:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 16:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 18:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 23 2021 22:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 00:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 00:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 24 2021 22:00:00 GMT+0200 (Central European Summer Time)","Wed Aug 25 2021 22:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 00:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 20:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 18:00:00 GMT+0200 (Central European Summer Time)","Thu Aug 26 2021 22:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 00:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 20:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 22:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 00:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 20:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 22:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 00:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 20:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 22:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 00:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 18:00:00 GMT+0200 (Central European Summer Time)","Fri Aug 27 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Aug 28 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sun Aug 29 2021 16:00:00 GMT+0200 (Central European Summer Time)"]'),
    (3, 1, '["Mon Aug 30 2021 10:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 14:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 18:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 16:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 12:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 10:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 16:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 18:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 14:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 20:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 14:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 10:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 12:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 10:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 08:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 06:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 08:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 12:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 16:00:00 GMT+0200 (Central European Summer Time)"]'),
    (3, 2, '["Fri Sep 03 2021 14:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 16:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 18:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 20:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 22:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 14:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 20:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 22:00:00 GMT+0200 (Central European Summer Time)"]'),
    (3, 3, '["Fri Sep 03 2021 16:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 18:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 20:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 20:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 18:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 18:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 16:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 16:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 18:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 16:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 18:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 20:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 20:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 20:00:00 GMT+0200 (Central European Summer Time)"]'),
    (3, 4, '["Mon Aug 30 2021 22:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 20:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 18:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 22:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 22:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 20:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 18:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 18:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 20:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 22:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 22:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 20:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 18:00:00 GMT+0200 (Central European Summer Time)","Fri Sep 03 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 20:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 22:00:00 GMT+0200 (Central European Summer Time)","Tue Aug 31 2021 16:00:00 GMT+0200 (Central European Summer Time)","Wed Sep 01 2021 16:00:00 GMT+0200 (Central European Summer Time)","Thu Sep 02 2021 16:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 16:00:00 GMT+0200 (Central European Summer Time)","Mon Aug 30 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sat Sep 04 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 16:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 20:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 18:00:00 GMT+0200 (Central European Summer Time)","Sun Sep 05 2021 22:00:00 GMT+0200 (Central European Summer Time)"]')

GO

SELECT *
FROM [event]
GO

SELECT *
FROM [users]
GO

SELECT *
FROM [eventSchedules]
GO

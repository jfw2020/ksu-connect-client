## Notes
A few notes regarding how our project is structured.
1. Since this is not a C# application, we do not have files that create stored procedures. Rather, each API route in `/pages/api` contains queries that perform various functions.
2. In the `/db` folder, you will find a file named Procedures.sql. This file contains the aggregating queries that are layed out in the final report.

## Getting Started

First, install the dependencies

```bash
npm install
```

Next, run the files in the `/db` folder in Azure Data Studio/SQL Management Studio in the following order:
1. Tables.sql
2. Data/Data Part 1.sql
3. Data/Data Part 2.sql
4. Data/Data Part 3.sql

Make sure to take note of the database name you are using. This should be used in the next step.

Then, create a .env.local file in the root directory. It should have the following variables:

```
DB_USER=<username for your mssql server instance>
DB_PASSWORD=<password for your mssql server instance>
DB_HOST=<password for your mssql server instance>
DB_DATABASE=<database you want to connect to>
DB_PORT=<port your mssql server instance is running on>

SECRET_COOKIE_PASSWORD=<randomly generated 32 character string>
```

Then, run the development server:

```bash
npm run dev
```

## Credentials
Username: jfw2020
Password: password

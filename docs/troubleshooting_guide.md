# **Troubleshooting and Maintenance Guide**

**Project:** Threat Intelligence Dashboard  
**Environment:** Local/Production  
**Last Updated:** 04/23/2025

## **Common Issues:**

| Error | Cause | Fix |
| :---- | :---- | :---- |
| 403 Forbidden on localhost | CORS or Airplay conflict | Check to make sure server.js is running on localhost:5050 and not 5000, which is used by MacOS Airplay |
| Database error: no such table | Table not created | Restart server, verify the path in srv.env, and ensure that the schema is created in server.js |
| Email alerts not sending | Missing credentials  | Make sure EMAIL\_USER, EMAIL\_PASS, and EMAIL\_RECEIPIENT has valid email credentials in srv.env |
| React app not showing data | Backend not running | Make sure backend is running with node server.js |
| sqlite3 permission error | Read-only database file | Make sure .db file is writeable |
| jmeter command not found | Not added to path | Run JMeter with ./bin/jmeter |

## **System Health Checks:**

| Component | Check Command |
| :---- | :---- |
| Backend API | curl http://localhost:5050/api |
| SQLite DB | sqlite3 ./threat\_intel.db ".tables" |
| Server Running | ‘ps aux |
| React Build | Open browser to http://localhost:5173 |

## **Maintenance Tasks**

| Task | Frequency | How |
| :---- | :---- | :---- |
| Restart Sever | As Needed | node server.js |
| Backup DB | Weekly | cp threat\_data.db |
| Clear Logs | Monthly | Manual |
| Dependency Check | Monthly  | npm outdated |
| Performance Test | Before Release | Run JMeter with load\_test.jmx |

## Contact:

Haley Nilsen, Project Manager  
Jack Keys, GitHub Manager/Backend Developer  
Montana Nicholson, Frontend Developer  
Samuel Yohannes, API Developer  
Toan Nguyen, Database Developer
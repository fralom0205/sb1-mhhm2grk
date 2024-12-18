# Required Firestore Indexes

Visit the following URLs to create the required indexes:

1. For Promotions Collection:
```
https://console.firebase.google.com/project/ubox-manager/firestore/indexes?create_composite=Ckxwcm9qZWN0cy91Ym94LW1hbmFnZXIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3Byb21vdGlvbnMvaW5kZXhlcy8YAQoHdXNlcklkEAEKCWNyZWF0ZWRBdBACGgwKCGNvbXBvc2l0ZRABGgwKCF9fbmFtZV9fEAE
```

2. For Content Collection:
```
https://console.firebase.google.com/project/ubox-manager/firestore/indexes?create_composite=Ckpwcm9qZWN0cy91Ym94LW1hbmFnZXIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2NvbnRlbnQvaW5kZXhlcy8YAQoHdXNlcklkEAEKCWNyZWF0ZWRBdBACGgwKCGNvbXBvc2l0ZRABGgwKCF9fbmFtZV9fEAE
```

3. For Notifications Collection:
```
https://console.firebase.google.com/project/ubox-manager/firestore/indexes?create_composite=Ck5wcm9qZWN0cy91Ym94LW1hbmFnZXIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL25vdGlmaWNhdGlvbnMvaW5kZXhlcy8YAQoHdXNlcklkEAEKCWNyZWF0ZWRBdBACGgwKCGNvbXBvc2l0ZRABGgwKCF9fbmFtZV9fEAE
```

4. For Analytics Collection:
```
https://console.firebase.google.com/project/ubox-manager/firestore/indexes?create_composite=Cktwcm9qZWN0cy91Ym94LW1hbmFnZXIvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2FuYWx5dGljcy9pbmRleGVzLxgBCgplbnRpdHlUeXBlEAEKBm1ldHJpYxABGgwKCGNvbXBvc2l0ZRABGgwKCF9fbmFtZV9fEAE
```

## Instructions

1. Click each link above to open the Firebase Console
2. Make sure you're logged in with the correct account
3. Click "Create Index" for each one
4. Wait for the indexes to finish building (this may take a few minutes)

## Index Details

The following indexes will be created:

1. Promotions:
   - Fields: userId (Ascending), createdAt (Descending)
   - Collection Group: promotions

2. Content:
   - Fields: userId (Ascending), createdAt (Descending)
   - Collection Group: content

3. Notifications:
   - Fields: userId (Ascending), createdAt (Descending)
   - Collection Group: notifications

4. Analytics:
   - Fields: entityType (Ascending), metric (Ascending)
   - Collection Group: analytics

Once all indexes are built, the queries in the application will work correctly.
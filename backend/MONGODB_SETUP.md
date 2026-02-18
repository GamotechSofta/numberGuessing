# MongoDB Connection String Setup

## Common MongoDB Connection String Formats

### 1. Local MongoDB
If you're running MongoDB locally:
```
MONGO_URI=mongodb://localhost:27017/matka
```

### 2. MongoDB Atlas (Cloud)
If you're using MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster-name.mongodb.net/matka?retryWrites=true&w=majority
```

**To get your Atlas connection string:**
1. Go to https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with your database name (e.g., `matka`)

### 3. MongoDB with Authentication (Local)
If your local MongoDB has authentication:
```
MONGO_URI=mongodb://username:password@localhost:27017/matka
```

## Example .env file

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/matka?retryWrites=true&w=majority
PORT=5000
```

## Important Notes

- **No spaces** around the `=` sign in .env file
- **No quotes** needed around the connection string (unless it contains special characters)
- Make sure your MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) or your current IP
- For local MongoDB, make sure the MongoDB service is running

## Testing Your Connection String

You can test your connection string using MongoDB Compass or the MongoDB shell:
```bash
mongosh "your_connection_string"
```

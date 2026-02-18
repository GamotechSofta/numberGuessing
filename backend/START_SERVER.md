# How to Start the Backend Server

## Step 1: Create .env file

Create a file named `.env` in the `backend` folder with the following content:

```
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```

Replace `your_mongodb_connection_string_here` with your actual MongoDB connection string.

Example:
```
MONGO_URI=mongodb://localhost:27017/matka
```

Or for MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/matka?retryWrites=true&w=majority
```

## Step 2: Start the server

Open a terminal in the `backend` folder and run:

```bash
npm start
```

You should see:
- ✓ Connected to MongoDB
- ✓ Server running on http://localhost:5000
- ✓ API available at http://localhost:5000/api/markets

## Troubleshooting

### Error: MONGO_URI is not set
- Make sure you created the `.env` file in the `backend` folder
- Check that the file is named exactly `.env` (not `.env.txt`)

### Error: MongoDB connection error
- Check your MongoDB connection string
- Make sure MongoDB is running (if using local MongoDB)
- Verify your MongoDB Atlas credentials (if using Atlas)
- Check your network connection

### Error: Port 5000 already in use
- Change the PORT in your `.env` file to a different port (e.g., 5001)
- Or stop the process using port 5000

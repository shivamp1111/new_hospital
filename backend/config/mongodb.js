import mongoose from "mongoose";

const connectDB = async () => {

    try {
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not defined in environment variables")
            throw new Error("MONGODB_URI is not defined. Please check your .env file")
        }

        mongoose.connection.on('connected', () => console.log("Database Connected"))
        mongoose.connection.on('error', (err) => console.error("Database Connection Error:", err))
        mongoose.connection.on('disconnected', () => console.log("Database Disconnected"))

        // Parse the MongoDB URI and add database name correctly
        let mongoUri = process.env.MONGODB_URI.trim()
        const dbName = 'prescripto'
        
        // Check if URI already has a database name (check for pattern: host.net/dbname)
        const hasDbName = mongoUri.match(/\.mongodb\.net\/[^\/\?]+/)
        
        if (!hasDbName) {
            // No database name found, need to add it
            if (mongoUri.includes('?')) {
                // If it has query parameters, insert database name before the '?'
                // Handle both cases: host.net/?params and host.net?params
                if (mongoUri.includes('/?')) {
                    mongoUri = mongoUri.replace('/?', `/${dbName}?`)
                } else {
                    mongoUri = mongoUri.replace('?', `/${dbName}?`)
                }
            } else {
                // No query parameters, just add database name
                mongoUri = mongoUri.endsWith('/') ? `${mongoUri}${dbName}` : `${mongoUri}/${dbName}`
            }
        }
        // If database name already exists, use the URI as is

        console.log("Connecting to MongoDB...")
        // Log the connection string (without password for security)
        const safeUri = mongoUri.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')
        console.log("Connection string:", safeUri)
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // Timeout after 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        })

        console.log("MongoDB connection established successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        console.error("Please ensure:")
        console.error("1. MongoDB is running (if using local MongoDB)")
        console.error("2. MONGODB_URI is set correctly in your .env file")
        console.error("3. Your network connection is stable")
        process.exit(1) // Exit the process if database connection fails
    }

}

export default connectDB;

// Do not use '@' symbol in your database user's password else it will show an error.
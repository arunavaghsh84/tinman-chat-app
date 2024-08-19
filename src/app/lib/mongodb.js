import mongoose from 'mongoose';

const connectMongo = async () => {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, // Allows to use the old connection string parser if they find a bug in the new parser
        useUnifiedTopology: true, // Allows to use a new connection management engine for the MongoDB driver
    });
};

export default connectMongo;

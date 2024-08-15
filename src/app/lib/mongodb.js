import mongoose from 'mongoose';

const connectMongo = async () => {
    if (mongoose.connections[0].readyState) return;

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default connectMongo;

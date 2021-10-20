import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from 'supertest';

let mongo: any;

declare global {
    var signin: () => Promise<string[]>;
}



beforeAll(async () => {
    process.env.JWT_KEY='1111';

    mongo = await MongoMemoryServer.create();
    const mongoUri =  mongo.getUri();

    await mongoose.connect(mongoUri, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const authResponse = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password,
        })
        .expect(201);

    return authResponse.get('Set-Cookie');
};
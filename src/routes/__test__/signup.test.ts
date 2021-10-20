import request from "supertest";
import {app} from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "qq@gmai22644.com",
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "gmai22644",
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "qq@gmai22644.com",
            password: 'p'
        })
        .expect(400);
});

it('returns a 400 with missing email ang password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({email: "qq@gmai22644.com",})
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({password: 'password'})
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "qq@gmai22644.com",
            password: 'password'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "qq@gmai22644.com",
            password: 'password'
        })
        .expect(400);
});

it('sets a cookie after successful singup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "qq@gmai22644.com",
            password: 'password'
        })
        .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
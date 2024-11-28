const { describe, it } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;
describe('Resource API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let resourceId; // Variable to store the ID of the resource

    // Test Suite for applying job
    describe('POST /apply-job', () => {
        it('should return 400 for invalid phone format', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')  // If jobId is required in URL, modify as needed
                .send({
                    name: 'Test Resource',
                    age: 21,
                    education: 'Diploma',
                    phone: 'invalid-phone',  // Invalid phone number format
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);

                    // Expecting a 400 status code for validation error
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Validation error: phone number must contain only numbers');
                    done();
                });
        });

        it('should return 400 for invalid age format', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')  // If jobId is required in URL, modify as needed
                .send({
                    name: 'Test Resource',
                    age: 'invalid-age',  // Invalid age format (not a number)
                    education: 'Diploma',
                    phone: '99998888',
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);

                    // Expecting a 400 status code for validation error
                    expect(res).to.have.status(400);  // Change this from 201 to 400
                    expect(res.body.message).to.equal('Validation error: age must be a number');
                    done();
                });
        });

        it('should return 400 for age less than 18', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')  // If jobId is required in URL, modify as needed
                .send({
                    name: 'Test Resource',
                    age: 17,  // Age less than 18
                    education: 'Diploma',
                    phone: '99998888',
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);

                    // Expecting a 400 status code for validation error
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Minimum age is 18 to apply.');
                    done();
                });
        });

        it('should return 400 for invalid phone format again', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')  // If jobId is required in URL, modify as needed
                .send({
                    name: 'Test Resource',
                    age: 21,
                    education: 'Diploma',
                    phone: 'invalid-phone',  // Invalid phone number format
                    email: 'invalid-email'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Validation error: phone number must contain only numbers');
                    done();
                });
        });

        it('should return 400 for invalid email format', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    name: 'Test Resource',
                    age: 21,
                    education: 'Diploma',
                    phone: '99998888',
                    email: 'invalid-email'  // Invalid email format
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Validation error: invalid email format');
                    done();
                });
        });
        

        it('should apply for a new job and return 201', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')  // No need to specify a jobId in the URL anymore
                .send({
                    name: 'Test Resource',
                    age: 21,
                    education: 'Diploma',
                    phone: '99998888',
                    email: 'test@gmail.com'
                })
                .end((err, res) => {
                    if (err) return done(err);

                    // Expecting a 201 status code for successful creation
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should return 400 if name is missing', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    age: 21, // missing name field
                    education: 'Diploma',
                    phone: '99998888',
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Name is required');
                    done();
                });
        });

        it('should return 400 for invalid characters in name', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    name: 'Test123@Resource',  // Invalid name with numbers and special characters
                    age: 21,
                    education: 'Diploma',
                    phone: '99998888',
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Validation error: name must not contain numbers or special characters');
                    done();
                });
        });

        it('should return 400 for email with spaces', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    name: 'Test Resource',
                    age: 21,
                    education: 'Diploma',
                    phone: '99998888',
                    email: ' test@example.com '  // Email with leading/trailing spaces
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Validation error: email address should not have leading or trailing spaces');
                    done();
                });
        });
                
        
        it('should return 400 for missing email', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    name: 'Test Resource',
                    age: 21,
                    education: 'Diploma',
                    phone: '99998888', // missing email
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Email is required');
                    done();
                });
        });
        
        it('should return 400 for missing education', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    name: 'Test Resource',
                    age: 21,
                    phone: '99998888', // missing education
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Education is required');
                    done();
                });
        });
        
        it('should return 400 for missing age', (done) => {
            chai.request(baseUrl)
                .post('/apply-job')
                .send({
                    name: 'Test Resource',
                    education: 'Diploma', // missing age 
                    phone: '99998888',
                    email: 'test@example.com'
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Age is required');
                    done();
                });
        });        
        
    });
});

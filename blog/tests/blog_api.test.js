const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const api = supertest(app)

beforeAll(async ()=>{
    await Blog.deleteMany({})
    const list = helper.initialList
    .map(blog => new Blog(blog))
    const promiseArr = list.map(e => e.save())
    await Promise.all(promiseArr)

    await User.deleteMany({})
    const usrlist = helper.initialUsers
    .map(usr => new User(usr))
    const promiseArrb = usrlist.map(e => e.save())
    await Promise.all(promiseArrb)
})



describe('users', () => {
    test('can be created', async () => {
        const initialUsers = await helper.getUsr()

        const goodUsr = {name: "test", username: "test", password:"dckdckdckMLLNMLLNMLLN103103103"}

        await api.post('/api/users').send(goodUsr)
        .expect(200).expect('Content-Type', /application\/json/)

        const endUsers = await helper.getUsr()

        expect(endUsers).toHaveLength(initialUsers.length +1)
        
        const usernames = endUsers.map(m => m.username)

        expect(usernames).toContain(goodUsr.username)
    })
    
    test('without an username is not created', async ()=> {
        const initialUsers = await helper.getUsr()

        const faultyUsr = {name: "boris", password:"cream"}

        await api.post('/api/users')
                .send(faultyUsr)
                .expect(400)
                .expect('Content-Type', /application\/json/)

        const endUsers = await helper.getUsr()

        expect(endUsers).toHaveLength(initialUsers.length)
    })
    test('without a password is not created', async ()=> {
        const initialUsers = await helper.getUsr()

        const faultyUsr = {name: "boris", username:"boris"}

        await api.post('/api/users')
                .send(faultyUsr)
                .expect(400)
                .expect('Content-Type', /application\/json/)

        const endUsers = await helper.getUsr()

        expect(endUsers).toHaveLength(initialUsers.length)
    })
    test('you can login with good credentials', async ()=>{
        const loginData = {username : "test", password : "dckdckdckMLLNMLLNMLLN103103103"}
        await api.post('/api/login')
                    .send(loginData)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)

                
    })
    
    
})
describe('blogs', () => {
    test('blogs are returned as json', async () =>{
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    
    test('the good number of blogs is returned', async () => {
        const response = await helper.getDbData()
    
        expect(response).toHaveLength(helper.initialList.length)
    })
    
    test('identifier is defined as id', async ()=>{
        const response = await helper.getDbData()
    
    
       response.forEach(element => {
        expect(element.id).toBeDefined()
        expect(element._id).not.toBeDefined()
       } )
       
    })
    
    test('posting a blog works as intended', async ()=>{
        const newBlog = {
            title: "test",
            author: 'testtest',
            url:"www.testexemple.com",
            likes: 10
        }
        const data = await api.post('/api/login')
                            .send({username : "test" , password: "dckdckdckMLLNMLLNMLLN103103103"})
        
        await api.post('/api/blogs')
        .set('Authorization', `bearer ${data.body.token}`)
                .send(newBlog)
               
                .expect(200)
                .expect('Content-Type', /application\/json/)
        const response = await helper.getDbData()
    
        expect(response).toHaveLength(helper.initialList.length +1)
    
        const titles = response.map(r => r.title)
    
        expect(titles).toContain(newBlog.title)
    })
    
    test('posting a blog without a likes property default the value of this property to 0', async ()=> {
        const faultyBlog = {
            title:"test2",
            author: "testtest",
            url:"www.exampletest.test"
        }
        const data = await api.post('/api/login').send({username: "test", password:"dckdckdckMLLNMLLNMLLN103103103"})
        await api.post('/api/blogs')
                    .set('Authorization', `bearer ${data.body.token}`)
                .send(faultyBlog)
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
        const response = await helper.getDbData()
    
        expect(response[response.length-1].likes).toBeDefined()
        expect(response[response.length-1].likes).toEqual(0)
    
    })
    
    test('Validation errors are working', async ()=> {
        const faultyBlog = {
            author: "miss"
        }
    
        const data = await api.post('/api/login').send({username: "test", password:"dckdckdckMLLNMLLNMLLN103103103"})
        await api.post('/api/blogs')
                    .set('Authorization', `bearer ${data.body.token}`)
                .send(faultyBlog)
                .expect(400)
    
    })
    
    test('a blog in the db can be deleted and returns 204', async ()=> {
        const initialBlogs = await helper.getDbData()
        const blogToDelete = initialBlogs[initialBlogs.length -1]
        const data = await api.post('/api/login').send({username: "test", password:"dckdckdckMLLNMLLNMLLN103103103"})
        
                    
        await api.delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `bearer ${data.body.token}`)
                    .expect(204)
    
        const endBlogs = await helper.getDbData()
    
        expect(endBlogs).toHaveLength(initialBlogs.length -1)
    
        const titles = endBlogs.map(r => r.title)
    
        expect(titles).not.toContain(blogToDelete.title)
    
    
    
    })
    
    test('you can update the likes of a blog', async ()=> {
        const initialBlogs = await helper.getDbData()
        const blogToUpdate = initialBlogs[0]
    
        await api.put(`/api/blogs/${blogToUpdate.id}`)
                .send({title: blogToUpdate.title, author: blogToUpdate.author, url: blogToUpdate.url, likes:999})
    
        const endBlogs = await helper.getDbData()
    
        expect(endBlogs).toHaveLength(initialBlogs.length)
        
        expect(endBlogs[0].likes).toEqual(999)
    })

    test('not providing a token when posting a blog returns 401', async () => {
        const legitBlog = {
            title : "legit",
            author :"also",
            likes: 4,
            url:"www.legit.url"

        }
        await api.post('/api/blogs')
                .send(legitBlog)
                .expect(401)
    })
})




afterAll(()=>{
    mongoose.connection.close()
    
})
import axios from 'axios'
let token = null

const baseUrl = "/api/blogs"


const setToken = (newToken) => {
    token = `bearer ${newToken}`
    console.log(token)
}

const getData = async () => {
    const response = await axios.get(baseUrl)
    console.log(response.data)
    return response.data
}
const deleteElement = async (element) => {
    const config = {
        headers: {
            Authorization : token
        },
    }

    console.log(token)
    console.log(element.id)
    return await axios.delete(`${baseUrl}/${element.id}`, config)

}

const addABlog = async (data) => {
    const config = {
        headers : 
        {Authorization : token }
    }

    await axios.post(baseUrl, data, config)
    return

}
const blogServices = { setToken, getData, deleteElement, addABlog}

export default blogServices
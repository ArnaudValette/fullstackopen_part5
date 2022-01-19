import { useEffect, useState, useRef, useImperativeHandle } from "react";
import loginServices from "./services/loginServices";
import blogServices from "./services/blogServices";






const Togglable = React.forwardRef((props, ref) => {


  const [visible, setVisible] = useState(false)

  const  hideWhenVisible = {display : visible ? 'none' : ''}
  const showWhenVisible = {display : visible ? '' : 'none'}

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, ()=>{
    return{
      toggleVisibility
    }
  })

  return(
  <div>
    <div style={hideWhenVisible}>
      <button  onClick={toggleVisibility}>{props.btnLabel}</button>
    </div>
    <div style={showWhenVisible}>
      {props.children}
      <button onClick={toggleVisibility}>cancel</button>
    </div>

  </div>)

}
)





const CreateBlogForm = ({createBlog}) => {
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url,setUrl] = useState('')
  

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title, author, url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    noteRef.current.toggleVisibility()
  }


  return(<div>
    <form onSubmit={addBlog}>
      Title:
      <input value={title} onChange={e=>setTitle(e.target.value)}/>
      Author:
      <input value={author} onChange={e=>setAuthor(e.target.value)}/>
      Url:
      <input value={url} onChange={e=>setUrl(e.target.value)}/>
      <button type="submit">send</button>
    </form>
  </div>)

}




function App() {


  
  //LOGIN_RELATED_STATE
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //BLOGS_RELATED_STATE
  const [blogs, setBlogs] = useState([])
  //NOTIF_RELATED_STATE
  const [errorMessage, setError] = useState(null)
  const [notif, setNotif] = useState(null)


  const noteRef = useRef()




  /////////////////////////////////////////
  ////////////////////////////////////////
  //////////                 /////////////
  /////////  METHODS        //////////
  ////////_________________//////////
  /////////////////////////////////////
  //_______________________________________
  //A//BLOG RELATED
  //B//USER RELATED
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  ///////////////////////////////////////////

  ////////////
  // A>>>> BLOG RELATED

  const loadBlogList = async () => {

    const blogList = await blogServices.getData()
    
    
    setBlogs(blogList)
    

  }

  const handleDeletionOf = async (element) => {

    await blogServices.deleteElement(element)
    setNotif(`Deleted blog ${element.title}`)
    setTimeout(()=>{

      setNotif(null)

    },2000)

    loadBlogList()

  }



  const handleBlogSub = async (blogObj) => {
    
    try{

      await blogServices.addABlog(blogObj)
      setNotif(`Added blog ${blogObj.title}`)
      setTimeout(()=>{

        setNotif(null)

      },2000)

      loadBlogList()

    } 
    
    catch(error){
      
      setError('Please enter a valid url, title and author')
      setTimeout(()=>{

      setError(null)

      }, 2000)

    }

  }

  //////////
  // B>>>>> USER RELATED

  //LOGIN____________________________

  const handleLogin = async (event) => {
    event.preventDefault()

    const credentials = {username, password}
    try{

      const user = await loginServices.login(credentials)
      setUser(user)
      
      setUsername('')
      setPassword('')
      const token = user.token
      blogServices.setToken(token)
      setNotif(`Logged in as ${user.username}`)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      console.log(user)
      setTimeout(()=>{
        setNotif(null)
      }, 2000)

      loadBlogList()

    } catch(error){
      setError('Invalid username or password')
      setTimeout(()=>{
        setError(null)
      }, 2000)
    }

  }

  //LOGOUT___________________________

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedUser')
    window.location.reload()
  }




  ////////////
  // INIT STATE

  useEffect(()=>{
    const loggedUser = window.localStorage.getItem('loggedUser')
    if(loggedUser){
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogServices.setToken(user.token)
      console.log("logged")
      loadBlogList()
    }
  }, [])


  //////////
  //


  

  


  return (
    <div >
      
      {user === null  
      ///////////////////////
      ///////////////////////
      ///////////////////////
      // LOGIN PROMPT :
        // this is accessible 
        // only when logged out
        // .........................
      //////////////////////////////
      ///////////////////////////////////////////
      ?
      <div>
        <form onSubmit={handleLogin}>
            <h1>log in to app</h1>
            <h2>{errorMessage}
            {notif}</h2>
            <div>
              username :
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div>
              password :
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type="submit">login</button>
        </form>
      </div>


      ///////////////////////////////
      // APP ACCESS ? >>>>> RENDER THIS


          //this is only accessible when logged
      ///////////////////
      //////////////////////////////////
      //////////////////////////////////
      : 
      <div>
        
        <div>
          <h1>blogs</h1>
          <h2>{errorMessage}
          {notif}</h2>
        </div>


        <div>
          <h3>  {user.username} is logged in <button onClick={handleLogOut}>log out</button></h3>
        </div>

          
          <Togglable btnLabel="create blog" ref={noteRef}>
            <CreateBlogForm createBlog={handleBlogSub}/>
          </Togglable>

          {blogs.map(el => <p key={el.id}>{el.title} {el.author} {el.user ? (user.username === el.user.username.toString() ? <button onClick={()=> handleDeletionOf(el)}>delete</button> : el.user.username ): ""}</p>)}
      
        </div>
    }
      
    </div>
  );
}

export default App;

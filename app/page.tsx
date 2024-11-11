import React from 'react'
import PostsComponent from './components/postsComponent'
import Nav from './components/nav'
import Comments from './components/commentsComponent'
const Home = () => {
  return (
    <div className='w-screen h-screen'>
      <Nav />
      <PostsComponent />
      <Comments />
      
    </div>
  )
}

export default Home

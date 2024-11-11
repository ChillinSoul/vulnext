import React from 'react'
import PostsComponent from './components/postsComponent'
import Nav from './components/nav'
const Home = () => {
  return (
    <div className='w-screen h-screen'>
      <Nav />
      <PostsComponent />
    </div>
  )
}

export default Home

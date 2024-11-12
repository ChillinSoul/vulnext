import React from 'react'
import PostsComponent from './components/postsComponent'
import MusicShareComponent from './components/musicShareComponent'
import Nav from './components/nav'
import Comments from './components/commentsComponent'
const Home = () => {
  return (
    <div className='w-screen h-screen'>
      <Nav />
      <PostsComponent />
      <MusicShareComponent />
      <Comments />

    </div>
  )
}

export default Home

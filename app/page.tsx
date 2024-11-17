import React from "react";
import PostsComponent from "./components/postsComponent";
import Nav from "./components/nav";
import Comments from "./components/commentsComponent";
import FileUploader from "./components/fileUploader";
const Home = () => {
  return (
    <div className="w-screen h-screen">
      <Nav />
      <PostsComponent />
      <FileUploader />
      <Comments />
    </div>
  );
};

export default Home;

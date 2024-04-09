import Header from "../../components/Header/Header";
import React, { useEffect } from "react";
import "./Home.scss";
const Home = () => {
  useEffect(() => {
    document.title = "Test";
  }, []);
  return (
    <div className="home">
      <Header />
    </div>
  );
};
export default Home;

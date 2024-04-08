import Header from "../../components/Header/Header";
import React, { useEffect } from "react";
import "./Page.scss";
const Page = () => {
  useEffect(() => {
    document.title = "Test";
  }, []);
  return (
    <div className="page">
      <Header />
    </div>
  );
};
export default Page;

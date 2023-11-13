import React from "react";
import Nav from "./Nav";
import Slider from "../components/Slider";
import Footer from "../components/Footer";
import Featured from "../components/Featured";

const Home = () => {
  return (
    <section className="min-h-screen w-full overflow-hidden">
      <Nav />
      <Slider />
      <Featured />
      <Footer />
    </section>
  );
};

export default Home;

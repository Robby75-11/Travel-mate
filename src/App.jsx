import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/NavBar";
import CardViaggio from "./Components/CardViaggio";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
      <NavBar />
      <CardViaggio />
      <Footer />
      {/* <Container> */}
    </>
  );
}

export default App;

import "./App.css";
import Header from "./component/Header";
import Footer from "./component/Footer";
import About from "./component/About";
import Skills from "./component/Skills";
import NavBar from "./component/NavBar";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Header themeColor="#0140ec" />
      <About />
      <Skills skillList={["HTML", "CSS", "JavaScript", "React"]} />
      <Footer />
      
    </div>
  );
}

export default App;
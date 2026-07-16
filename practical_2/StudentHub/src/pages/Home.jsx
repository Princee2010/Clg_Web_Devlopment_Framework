import Header from "../component/Header";
import About from "../component/About";
import Skills from "../component/Skills";

function Home() {
  return (
    <>
      <Header themeColor="#1d4ed8" />
      <About />
      <Skills skillList={["HTML", "CSS", "JavaScript", "React"]} />
    </>
  );
}

export default Home;

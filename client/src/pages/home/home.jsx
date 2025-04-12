import React from "react";

import Hero from "../../components/hero/hero";
import InfoBar from "../../components/infobar/infobar";
import MainContent from "../../components/maincontent/maincontent";

function Home() {
  return (
    <>
      <Hero />
      <InfoBar />
      <MainContent />
    </>
  );
}

export default Home;
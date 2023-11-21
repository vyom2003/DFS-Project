import React from "react";
import "./Home.css";
import homeConfig from "./homeConfig.json";

import {
  Heading,
  ParaFont,
  ParaHeading,
  FlexSection,
} from "../../GlobalStyles";
const Home = () => {
  return (
    <div className={FlexSection} id="home" >
        <h1 className={Heading}>{homeConfig[0].HeadingText}</h1>
        <p className={ParaFont}>{homeConfig[0].Paragraphs[0]}</p>
        <p className={ParaFont}>{homeConfig[0].Paragraphs[1]}</p>
        <h3 className="font-extrabold text-4xl tracking-tighter mt-6 text-regal-blue">{homeConfig[1].SubHeadingText}</h3>
      {homeConfig.slice(2).map(({ id, Paragraphs, SubHeadingText }) => (
        <div key={id}>
          <h3 className={ParaHeading}>{SubHeadingText}</h3>
          {Paragraphs.map((paragraph, index) => (
            <p className={ParaFont} key={`p-${index}`}>{paragraph}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Home;

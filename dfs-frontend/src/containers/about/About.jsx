import React from "react";
import "./About.css";
import {
  FlexSection,
  Heading,
  ParaFont,
  OverviewFont,
} from "../../GlobalStyles";
import aboutConfig from "./aboutConfig.json";

function About() {
  return (
    <div className="bg-white">
      {aboutConfig.map(({ id, HeadingText, Paragraphs, ListItems, Image }) => (
        <div className={FlexSection} key={id}>
          {Image.includes("jpg") ||
          Image.includes("png") ||
          Image.includes("jpeg") ? (
            <div className="row shadow-sm rounded">
              <div className="col-md-7 mt-1">
                <h1 className={Heading}>{HeadingText}</h1>
                {Paragraphs.map((paragraph, index) => (
                  <p className={ParaFont} key={`p-${index}`}>
                    {paragraph}
                  </p>
                ))}
                {ListItems.length > 0 && (
                  <ul className="list-square pl-8">
                    {ListItems.map((item, index) => (
                      <li className={OverviewFont} key={`li-${index}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-md-5 mt-1 mb-1">
                <div className="flex flex-1 justify-center items-center">
                  <img src={Image} alt={HeadingText} />
                </div>
              </div>
            </div>
          ) : (
            <div className="row shadow-sm rounded">
              <div className="col-md-12">
                <h1 className={Heading}>{HeadingText}</h1>
                {Paragraphs.map((paragraph, index) => (
                  <p className={ParaFont} key={`p-${index}`}>
                    {paragraph}
                  </p>
                ))}
                {ListItems.length > 0 && (
                  <ul className="list-square pl-8">
                    {ListItems.map((item, index) => (
                      <li className={OverviewFont} key={`li-${index}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default About;

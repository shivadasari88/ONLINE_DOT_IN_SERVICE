import React from "react";
import PickMeals from "../Assets/profilecheck-women.png";
import ChooseMeals from "../Assets/expert-approved-cartoon-character-holding-checkmark-symbol-hand-finished-task-done-sign-satisfactory-official-sanction-acceptance.png";
import DeliveryMeals from "../Assets/select-concept.png";

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Upload Documents",
      text: "Easily upload your required documents like Aadhaar, college memos, or certificates for processing.",
    },
    {
      image: ChooseMeals,
      title: "AI-Powered Form Filling",
      text: "Our AI extracts details from your documents and automatically fills out application forms with 99% accuracy.",
    },
    {
      image: DeliveryMeals,
      title: "One-Click Submission",
      text: "Once verified, submit your applications effortlessly with a single click—fast, error-free, and hassle-free!",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Process</p>
        <h1 className="primary-heading">How O.IS Works</h1>
        <p className="primary-text">
        O.IS (Online. In Service) automates application processes, reducing manual effort 
      and ensuring accuracy. Here’s how it simplifies your online applications:
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;

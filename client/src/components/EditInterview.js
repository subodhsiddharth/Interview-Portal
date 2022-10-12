import React from "react";
import { useParams } from "react-router";
import Details from "./InterviewDetails";

const EditPage = () => {
  const { meetingId } = useParams();
  console.log(meetingId)
  return (
    <div>
      <Details func="edit" meetingId={meetingId}></Details>
    </div>
  );
};

export default EditPage;

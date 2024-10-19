import { Quote } from "../components/Quote";
import { SignUpForm } from "./Signup";

export const Hero = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center h-screen px-8">
      <div className="w-full md:w-1/2 mb-8 flex justify-center items-center ">
        <Quote />
      </div>
      <div className="w-full md:w-1/2 flex justify-center ">
        <SignUpForm />
      </div>
    </div>
  );
};

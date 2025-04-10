// import { useState } from "react";

// export function useRegisterForm() {
//   const [step, setStep] = useState(1);

//   const [mobileNumber, setMobileNumber] = useState("");
//   const [whatsappNumber, setWhatsappNumber] = useState("");
//   const [email, setEmail] = useState("");

//   const [mobileOtp, setMobileOtp] = useState(Array(6).fill(""));
//   const [whatsappOtp, setWhatsappOtp] = useState(Array(6).fill(""));
//   const [emailOtp, setEmailOtp] = useState(Array(6).fill(""));

//   const [showMobileOtp, setShowMobileOtp] = useState(false);
//   const [showWhatsappOtp, setShowWhatsappOtp] = useState(false);
//   const [showEmailOtp, setShowEmailOtp] = useState(false);

//   const [mobileVerified, setMobileVerified] = useState(false);
//   const [whatsappVerified, setWhatsappVerified] = useState(false);
//   const [emailVerified, setEmailVerified] = useState(false);

//   const [selectedLevel, setSelectedLevel] = useState("State");
//   const [state, setState] = useState("Rajasthan");
//   const [division, setDivision] = useState("Jaipur");
//   const [district, setDistrict] = useState("Jaipur");
//   const [block, setBlock] = useState("Bassi");
//   const [sector, setSector] = useState("Malviya Nagar");
//   const [organizationType, setOrganizationType] = useState("Director - MH");
//   const [designation, setDesignation] = useState("Project Director - MH");

//   const [fullName, setFullName] = useState("");
//   const [gender, setGender] = useState("Male");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const resetForm = () => {
//     setStep(1);
//     setMobileNumber("");
//     setWhatsappNumber("");
//     setEmail("");
//     setMobileOtp(Array(6).fill(""));
//     setWhatsappOtp(Array(6).fill(""));
//     setEmailOtp(Array(6).fill(""));
//     setShowMobileOtp(false);
//     setShowWhatsappOtp(false);
//     setShowEmailOtp(false);
//     setMobileVerified(false);
//     setWhatsappVerified(false);
//     setEmailVerified(false);
//     setSelectedLevel("State");
//     setState("Rajasthan");
//     setDivision("Jaipur");
//     setDistrict("Jaipur");
//     setBlock("Bassi");
//     setSector("Malviya Nagar");
//     setOrganizationType("Director - MH");
//     setDesignation("Project Director - MH");
//     setFullName("");
//     setGender("Male");
//     setPassword("");
//     setConfirmPassword("");
//   };

//   return {
//     step, setStep,
//     mobileNumber, setMobileNumber,
//     whatsappNumber, setWhatsappNumber,
//     email, setEmail,
//     mobileOtp, setMobileOtp,
//     whatsappOtp, setWhatsappOtp,
//     emailOtp, setEmailOtp,
//     showMobileOtp, setShowMobileOtp,
//     showWhatsappOtp, setShowWhatsappOtp,
//     showEmailOtp, setShowEmailOtp,
//     mobileVerified, setMobileVerified,
//     whatsappVerified, setWhatsappVerified,
//     emailVerified, setEmailVerified,
//     selectedLevel, setSelectedLevel,
//     state, setState,
//     division, setDivision,
//     district, setDistrict,
//     block, setBlock,
//     sector, setSector,
//     organizationType, setOrganizationType,
//     designation, setDesignation,
//     fullName, setFullName,
//     gender, setGender,
//     password, setPassword,
//     confirmPassword, setConfirmPassword,
//     resetForm
//   };
// }

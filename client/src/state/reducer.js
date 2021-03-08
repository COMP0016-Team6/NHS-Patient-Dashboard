export function mainReducer(state = {}, action) {
  let newState = { ...state };
  switch (action.type) {
    case "LOGGED_IN":
      return {
        isAuth: true,
        user_id: action.user_id,
        isClinician: action.user_role === "Clinician",
        user_name: action.user_name,
        user_email: action.user_email,
        patientInfo: {}, // { patient_id, patient_name, patient_email, patient_description, target feeds, the actual feeds and etc }
        patientPlan: [],
        patientFeed: {}
      };

    case "LOGGED_OUT":
      return {
        isAuth: false
      };
    
    case "CLINICIAN_PROFILE":
      newState.patients = action.patients; // [patient_ids] that clinician supervises
      newState.allPatients = action.allPatients; // the list of all patients in the system 
      return newState;
    
    case "PATIENT_PROFILE":
      const { patientInfo, curWeight, patientPlan, patientFeed } = action.allInfo;
      newState.patientInfo = {...patientInfo.info, weight: curWeight};
      newState.patientPlan = patientPlan;
      newState.patientFeed = patientFeed;
      return newState;
    
    case "SET_CLINICIAN_PATIENTS":
      newState.patients = action.patients;
      return newState;
      
    default:
      return state;
  }
}
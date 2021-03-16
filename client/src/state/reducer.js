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
        patientInfo: {},
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
      newState.patientInfo = {};
      newState.patientPlan = [];
      newState.patientFeed = {};
      return newState;
    
    case "PATIENT_PROFILE":
      const { info, plan, feed } = action.allInfo;
      newState.patientInfo = info;
      newState.patientPlan = plan;
      newState.patientFeed = feed;
      return newState;
    
    case "SET_CLINICIAN_PATIENTS":
      newState.patients = action.patients;
      return newState;
    
    case "CHANGED_WEIGHT":
      newState.patientInfo.weight = action.weight;
      return newState;
    
    default:
      return state;
  }
}
import { Provider } from "react-redux";
import { loggedIn, patientProfile, clinicianProfile } from "../state/action";
import store from "../state/store";
import React from "react";

export const patientWrapper = component => {

  store.dispatch(loggedIn("Patient", 2, "Test User Two", "test.user.two@gmail.com"));

  const patientInfo = { user_id: 2, user_name: "Test User Two", user_email: "test.user.two@gmail.com", 
    patient_gender: "Male", patient_dob: "2000-01-03 00:00:00", diagnostic_conclusion: "Lung Cancer I", weight: 70 }
  
  const patientTreatmentPlan = [{ description: "test", target_feed_fluid: "1.5", target_feed_energy: "2.5", modified_time: "2020-05-05 20:20:20" }]
  
  const patientFeeds = {feeds: [ {id: 1, fluid: '1', energy: '2', timestamp: "2020-05-07 20:20:20"}, {id: 2, fluid: '0.5', energy: '1.5', timestamp: "2020-05-10 20:20:20"}],
    weights: [{weight: 70, timestamp: "2021-03-17 00:00:00"}, {weight: 65, timestamp: "2021-03-20 00:00:00"}]
  };

  const allInfo = { info: patientInfo, plan: patientTreatmentPlan, feed: patientFeeds };

  store.dispatch(patientProfile(allInfo));

  return <Provider store={store}>{component}</Provider>
}

export const clinicianWrapper = component => {
  store.dispatch(loggedIn("Clinician", 1, "Test User One", "test.user.one@gmail.com"));
  const allPatients = [{user_id: 2, user_name: "Test User Two", user_email: "test.user.two@gmail.com"}, {user_id: 3, user_name: "Test User Three", user_email: "test.user.three@gmail.com"}]
  const patients = [{user_id: 2, user_name: "Test User Two", user_email: "test.user.two@gmail.com"}];
  store.dispatch(clinicianProfile(patients, allPatients));

  return <Provider store={store}>{component}</Provider>
}

export const wrapProvider = component => {
  return <Provider store={store}>{component}</Provider>;
};

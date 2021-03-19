module.exports = function(req, res, next) {
  
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    const { email, name, password, confPassword, role, dob, gender, diagnosticConclusion, weight } = req.body.inputs;
    const { description, target_feed_fluid, target_feed_energy, modified_time } = req.body.plan;

    if (![email, name, password, confPassword].every(Boolean))
      return res.json("Missing Fields");
    else if (password !== confPassword)
      return res.json("Passwords Do Not Match");
    else if (!validEmail(email))
      return res.json("Invalid Email");

    if (role === "Patient") {
      if (![dob, gender, diagnosticConclusion, weight].every(Boolean))
        return res.json("All Fields Must be Filled");
      else if (isNaN(weight))
        return res.json("Weight Must be a Number");
      else if (parseFloat(weight) < 0) 
        return res.json("Weight Must be Positive");
      else if (![description, target_feed_fluid, target_feed_energy].every(Boolean))
        return res.json("Missing Fields");
      else if (isNaN(target_feed_fluid) || isNaN(target_feed_energy))
        return res.json("Target Value Must be a Number");
      else if (parseFloat(target_feed_fluid) < 0 || parseFloat(target_feed_energy) < 0)
        return res.json("Target Feed Must be Positive");
    }
  } else if (req.path === "/login") {
    const { email, password } = req.body;

    if (![email, password].every(Boolean))
      return res.json("Missing Credentials");
    else if (!validEmail(email))
      return res.json("Invalid Email");
  } else if (req.path === "/changeTreatmentPlan") {
    if (![req.body.description, req.body.target_feed_fluid, req.body.target_feed_energy].every(Boolean))
      return res.json("Missing Credentials");
    else if (isNaN(req.body.target_feed_fluid) || isNaN(req.body.target_feed_energy))
      return res.json("Target Value Must be a Number")
    else if (parseFloat(req.body.target_feed_fluid) < 0 || parseFloat(req.body.target_feed_energy) < 0) 
      return res.json("Target Feed Must be Positive");
  } else if (req.path === "/changeWeight") {
    if (!req.body.newWeight)
      return res.json("New Weight Cannot be Empty");
    else if (isNaN(req.body.newWeight))
      return res.json("Weight Must be a Number");
    else if (parseFloat(req.body.newWeight) < 0) 
      return res.json("Weight Must be Positive");
  }

  next();
};

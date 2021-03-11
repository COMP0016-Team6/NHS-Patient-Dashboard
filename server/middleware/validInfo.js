module.exports = function(req, res, next) {
  
  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    const { email, name, password, role, dob, gender, diagnosticConclusion, weight } = req.body.inputs;
    const { description, target_feed_volume, target_feed_energy, modified_time } = req.body.plan;

    if (![email, name, password].every(Boolean))
      return res.json("Missing Credentials");
    else if (!validEmail(email))
      return res.json("Invalid Email");

    if (role === "Patient") {
      if (![dob, gender, diagnosticConclusion, weight].every(Boolean))
        return res.json("All fields must be filled!");
      else if (isNaN(weight))
        return res.json("Weight Must be a Number!");
      else if (![description, target_feed_volume, target_feed_energy].every(Boolean))
        return res.json("Missing Credentials");
      else if (isNaN(target_feed_volume) || isNaN(target_feed_energy))
        return res.json("Target Value Must be a Number!");
    }
  } else if (req.path === "/login") {
    const { email, password } = req.body;

    if (![email, password].every(Boolean))
      return res.json("Missing Credentials");
    else if (!validEmail(email))
      return res.json("Invalid Email");
  } else if (req.path === "/changeTreatmentPlan") {
    if (![req.body.description, req.body.target_feed_volume, req.body.target_feed_energy].every(Boolean))
      return res.json("Missing Credentials");
    else if (isNaN(req.body.target_feed_volume) || isNaN(req.body.target_feed_energy))
      return res.json("Target Value Must be a Number!")
  } else if (req.path === "/changeWeight") {
    if (!req.body.newWeight)
      return res.json("New Weight Cannot be Empty!");
    else if (isNaN(req.body.newWeight))
      return res.json("Weight Must be a Number!");
  }

  next();
};
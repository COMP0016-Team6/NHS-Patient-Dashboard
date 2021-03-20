import React from 'react';
import { Dialog, DialogActions, DialogContent }  from '@material-ui/core';
import { addFeedback } from "../api/fetches"; 
import { useTextArea } from "../useInput";
import { toast } from 'react-toastify';
import { useSelector} from "react-redux";

export default function FormDialog({ open, feed_id, setOpen }) {
  const user_name = useSelector(state => state.user_name);
  const [feedback, feedbackField] = useTextArea({placeholder: "Reason for abnormality"});

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const parseRes = await addFeedback(feed_id, `${feedback} (${user_name})`);
      if (parseRes) {
        toast.success("Feedback Added");
      }
    } catch (err) {
        toast.error("Feedback Add Failed");
        console.error(err.message);
    }

    setOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
        <h3 align="center" style={{marginTop: 15}}>Patient Feedback</h3>
        <DialogContent>{feedbackField}</DialogContent>
        <DialogActions style={{margin: 10}}>
          <button onClick={() => setOpen(false)} className="btn btn-danger">Cancel</button>
          <button onClick={onSubmit} className="btn btn-primary">Submit</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
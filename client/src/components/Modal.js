import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addFeedback } from "../api/fetches"; 
import { useInput } from "../useInput";
import { toast } from 'react-toastify';

export default function FormDialog({ open, feed_id, setOpen }) {
  const [feedback, feedbackField] = useInput({placeholder:"Reason for abnormality"});

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const parseRes = await addFeedback(feed_id, feedback);
      if (parseRes) {
        toast.success("Feedback Added!");
      }
    } catch (err) {
        toast.error("Feedback Add Failed!");
        console.error(err.message);
    }

    handleClose();
  }

  return (
    <div style={{maxWidth: 700, maxHeight: 600}}>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Patient Feedback</DialogTitle>
        <DialogContent>
          {feedbackField}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
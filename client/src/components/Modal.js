import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addFeedback } from "../api/fetches"; 
import { toast } from 'react-toastify';

export default function FormDialog({ open, feed_id, setOpen }) {
  const [inputs, setInputs] = useState({
    feedback: ""
  });

  const { feedback } = inputs;

  const onChange = e =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

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
          <TextField
              variant="outlined"
              margin="feedback"
              required
              fullWidth
              id="feedback"
              label="Reason for abnormality"
              name="feedback"
              autoComplete="feedback"
              autoFocus
              value={feedback}
              onChange={e => onChange(e)}
            />
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
import { makeStyles } from '@material-ui/core/styles';
import NHS from '../assets/NHS.png';

const image = {
  backgroundImage: `url(${NHS})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',

};

const paper = {
  marginTop: 80,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const avatar =  {
  marginTop: '25vh',
  backgroundColor: "#1976d2",
};

const useStylesReg = makeStyles(() => ({
  image: image,
  form: {
    width: '100%',
    marginTop: 24
  },
  avatar
}));

const useStylesLogin = makeStyles(() => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  paper,
  image,
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '',
  }
}));

const useStylesUser = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
    maxHeight: 600
  }
});

export { useStylesReg, useStylesLogin, useStylesUser, useStylesTable };
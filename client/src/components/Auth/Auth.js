import React, {useState} from 'react'
import { GoogleLogin } from 'react-google-login';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import  useStyles  from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon  from './icon';
import { signin, signup } from '../../actions/auth';


const initialState = {firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

function Auth() {
    const classes = useStyles();
    const [showPassword, setShowPassword ] = useState(false);
    const [isSignup, setIsSignUp] = useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData ] = useState(initialState);
    const history = useHistory();



    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e)=>{
        e.preventDefault();
       if(isSignup){
           dispatch(signup(formData, history));
       }else{
        dispatch(signin(formData, history));
       }

    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    };
    const switchMode = () =>{
        setIsSignUp((prevIsSignUp) => !prevIsSignUp);
        setShowPassword(false);
      

    }
   const googleSuccess = async (res) => {
       const result= res?.profileObj; //cannot get property
       const token = res?.tokenId;
       //console.log(result);

       try {
           dispatch({ type: 'AUTH', data : {result, token} });
           history.push('/');
       } catch (error) {
        console.log("Google sign in unsuccessful");
       }

    }
   const googleFailure =() => {
       console.log("Google sign in unsuccessful");

    }
    
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />

                </Avatar>
                <Typography variant="h5">{ isSignup ? 'Sign Up':'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} half />

                                </>
                            ) 
                        }
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password"/>}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>

                    <GoogleLogin 
                        clientId="847882486171-1emc0cvst6acsclheaa4i3049knkk49l.apps.googleusercontent.com"
                        render={(renderProps)=>(
                            <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon/>} variant="contained" >
                                Google Sign In
                            </Button>
                        )
                    }
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"

                    />
                   
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>{ isSignup ? 'Already have an account? Sign In' : 'Create an new account? Sign Up'}</Button>
                        </Grid>

                    </Grid >
                </form>
            </Paper>

        </Container>
    );
};

export default Auth

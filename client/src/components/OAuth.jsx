import { Button } from 'flowbite-react';
import GoogleIcon from '../assets/icons8-google-96.svg';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../../firbase/firebase';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSigninRoutes } from '../../utils/ApiRoutes';
import { useNavigate } from 'react-router-dom';
import { signInSuccess, signInFailure } from '../../redux/users/userSlice';
function OAuth() {
  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post(
        GoogleSigninRoutes,
        {
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoURL: resultFromGoogle.user.photoURL,
          uid: resultFromGoogle.user.uid,
          idToken: resultFromGoogle._tokenResponse.idToken,
        },
        { withCredentials: true }
      );
      if (res.data.statusCode === false) {
        return dispatch(signInFailure(res.data.message));
      }
      if (res.status === 200) {
        dispatch(signInSuccess(res.data));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
      disabled={loading}
    >
      <img src={GoogleIcon} className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}

export default OAuth;

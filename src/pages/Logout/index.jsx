import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../sharedComponents/Firebase';

const Logout = (props) => {
    // Firebase
    const firebase = useContext(FirebaseContext)

    // Construction => logout user
    useEffect(() => {
        firebase.doSignOut()
    }, [])

    return ("Logging out");
}

export { Logout }; 
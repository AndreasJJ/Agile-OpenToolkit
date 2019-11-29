import React, { useEffect, useContext } from 'react';
import { FirebaseContext } from '../../sharedComponents/Firebase';

const Logout = (props) => {
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        firebase.doSignOut()
    }, [])

    return ("Logging out");
}

export { Logout }; 
import { createContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

function UserProvider({ children }) {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL
    axios.defaults.withCredentials = true

    const storedPreferences = JSON.parse(localStorage.getItem("preferences")) || {};

    const [user, setUser] = useState(null);
    const [preferences, setPreferences] = useState({
        ...storedPreferences,
        theme: storedPreferences.theme || 'light',
        privacyPolicyAccepted: storedPreferences.privacyPolicyAccepted || 0,
        doNotShowAgain: storedPreferences.doNotShowAgain || {},
        debug: storedPreferences.debug || false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get('/auth/user', { withCredentials: true });
                const userData = data.user || null;

                setUser(userData);
                sessionStorage.setItem('user', JSON.stringify(userData));
            } catch (error) {
                console.error('Error fetching user', error);
            }
        };
    
        fetchUser();
    }, []);    

    const changeTheme = (value) => {
        setPreferences({ ...preferences, theme: value });
        localStorage.setItem("preferences", JSON.stringify({ ...preferences, theme: value }));
    };

    const acceptPrivacyPolicy = () => {
        localStorage.setItem("preferences", JSON.stringify({ ...preferences, privacyPolicyAccepted: Date.now() }));
    };

    const doNotShowAgain = (key) => {
        setPreferences({ ...preferences, doNotShowAgain: { ...preferences.doNotShowAgain, [key]: true } });
        localStorage.setItem("preferences", JSON.stringify({ ...preferences, doNotShowAgain: { ...preferences.doNotShowAgain, [key]: true } }));
    };

    const changeDebug = (value) => {
        setPreferences({ ...preferences, debug: value });
        localStorage.setItem("preferences", JSON.stringify({ ...preferences, debug: value }));
    };

    const logIn = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    };

    const logOut = async () => {
        await axios.get('/auth/logout')
        setUser(null);
        sessionStorage.removeItem('user');
    };

    const providedValues = {
        user,
        preferences,
        changeTheme,
        changeDebug,
        acceptPrivacyPolicy,
        doNotShowAgain,
        logIn,
        logOut,
    };

    return (
        <UserContext.Provider value={providedValues}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };
export default UserContext;

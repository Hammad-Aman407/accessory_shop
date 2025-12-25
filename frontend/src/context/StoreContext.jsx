import React, { createContext, useEffect, useState } from 'react';

export const StoreContext = createContext();

const StoreContextProvider = (props) => {

    const url = import.meta.env.VITE_API_URL;

    const [token, setToken] = useState("");

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const contextValue = {
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

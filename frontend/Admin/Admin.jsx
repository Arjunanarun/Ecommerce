import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useContext, useEffect } from "react";
import { toast } from 'react-toastify';
import LoadingSpinner from "../Components/LoadinSpinner";

export default function Admin({ element }) {
    const { user, loading } = useContext(AuthContext);

    // --- 1. Authorized Access ---
    // If user is logged in AND is admin, grant access immediately.
    if (user && user.isAdmin) {
        return element;
    }

    // --- 2. Loading State ---
    // 🛑 FIX 1: Must return the loading spinner while fetching auth status.
    if (loading) {
        return <LoadingSpinner />;
    }

    // --- 3. Unauthorized Side Effect (Toast) ---
    useEffect(() => {
        // Run this effect only when loading is FALSE (status known)
        // AND the user is NOT authorized.
        // The check should be: NOT user OR user is NOT admin
        if (!loading && (!user || !user.isAdmin)) { 
            toast.error("Need to be admin to access this route.", {
                toastId: 'admin-access-denied',
                autoClose: 5000 
            });
        }
    }, [user, loading]);

    // --- 4. Redirection ---
    // 🛑 FIX 2: Must return the Navigate component when unauthorized.
    // If not loading, and access was not granted above, redirect the user.
    if (!user || !user.isAdmin) {
        return <Navigate to='/login' replace />;
    }
    
    // Fallback return (should technically not be reached if logic is complete)
    return null;
}
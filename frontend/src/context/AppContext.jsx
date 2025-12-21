import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    // Get backend URL from environment variable or use default
    let backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    
    // Validate and clean the backend URL
    backendUrl = backendUrl.trim()
    // If URL doesn't start with http:// or https://, add http://
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
        // If it starts with : (like :4000), prepend http://localhost
        if (backendUrl.startsWith(':')) {
            backendUrl = `http://localhost${backendUrl}`
        } else {
            backendUrl = `http://${backendUrl}`
        }
    }
    
    // Remove trailing slash if present
    backendUrl = backendUrl.replace(/\/$/, '')
    
    // Validate backend URL format
    if (!backendUrl || (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://'))) {
        console.error('Invalid backend URL detected:', backendUrl)
        console.error('Please check your .env file. Setting default to http://localhost:4000')
        backendUrl = 'http://localhost:4000'
    }
    
    // Log the backend URL in development (for debugging)
    if (import.meta.env.DEV) {
        console.log('✅ Backend URL configured:', backendUrl)
        console.log('⚠️  If you see connection errors, ensure the backend server is running on this URL')
    }

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                const doctorsList = data.doctors || []
                console.log('✅ Doctors loaded successfully:', doctorsList.length, 'doctors')
                setDoctors(doctorsList)
            } else {
                console.error('❌ Failed to load doctors:', data.message)
                toast.error(data.message || 'Failed to load doctors')
                setDoctors([])
            }

        } catch (error) {
            console.log('Error fetching doctors:', error)
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.code === 'ERR_CONNECTION_REFUSED') {
                console.error('Cannot connect to backend server at', backendUrl)
                console.error('Please ensure the backend server is running on port 4000')
                // Only show toast on first load attempt, not on every retry
                toast.error('Cannot connect to backend server. Please ensure the server is running.')
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to load doctors. Please check your connection.'
                toast.error(errorMessage)
            }
            setDoctors([])
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log('Error loading user profile:', error)
            // Don't show error toast for connection refused errors when no token exists
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                console.error('Cannot connect to backend server. Please ensure the backend is running on', backendUrl)
                // Only show error if token exists (user is logged in)
                if (token) {
                    toast.error('Cannot connect to server. Please check if the backend is running.')
                }
            } else if (error.response?.data?.code === 'INVALID_TOKEN' || error.response?.data?.message?.includes('Invalid or expired token')) {
                // Clear invalid token and log user out
                console.log('Invalid token detected, clearing localStorage')
                localStorage.removeItem('token')
                setToken('')
                setUserData(false)
                toast.error('Session expired. Please login again.')
            } else {
                toast.error(error.response?.data?.message || error.message || 'Failed to load profile')
            }
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
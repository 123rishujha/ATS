import { localStoragekeys } from "./mainExports";

function getToken() {
    try {
        const data = localStorage.getItem(localStoragekeys.userState);
        if (!data) return null;
        
        const parsedData = JSON.parse(data);
        console.log('User state:', parsedData);
        
        // Check for token in various possible locations in the state
        if (parsedData && parsedData.user && parsedData.user.userState) {
            return parsedData.user.userState.token;
        }
        
        if (parsedData && parsedData.userState) {
            return parsedData.userState.token;
        }
        
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
}

export default getToken;
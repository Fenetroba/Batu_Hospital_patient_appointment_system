import { io } from 'socket.io-client';

let socket;

export const getSocket = (token) => {
    if (!socket) {
        socket = io('https://batu-hospital-patient-appointment-system.onrender.com', {
            auth: { token },
            withCredentials: true
        });
    }
    return socket;
};

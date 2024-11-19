import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    extraHeaders: {
        'my-custom-header': 'abcd'
    }
});

export default socket;

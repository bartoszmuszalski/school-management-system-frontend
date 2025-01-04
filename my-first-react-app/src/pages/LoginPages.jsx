import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm'; // Ścieżka do komponentu

function LoginPage() {
    const [message, setMessage] = useState('');
    const handleLogin = async (fieldValues) => {
        const { username, password } = fieldValues;

        const response = await fetch('http://localhost/api/v1/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage += ` ${errorData.message || ''}`;
            } catch (jsonError) {
                console.error('Failed to parse error JSON:', jsonError);
            }
            throw new Error(errorMessage);
        }
        const result = await response.json();
        return {message: "Login successful", ...result};

    };

    return (
        <AuthForm
            title="Logowanie"
            fields={[
                { name: 'username', type: 'email', label: 'Email', required: true },
                { name: 'password', type: 'password', label: 'Hasło', required: true },
            ]}
            submitButtonText="Zaloguj"
            onSubmit={handleLogin}
            message={message}
            setMessage={setMessage}
        />
    );
}

export default LoginPage;
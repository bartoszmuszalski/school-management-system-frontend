import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm';

function RegisterPage() {
    const [message, setMessage] = useState('');

    const handleRegister = async (fieldValues) => {
        const { username, password } = fieldValues;
        const response = await fetch('http://localhost/api/v1/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            let errorMessage = `Register failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage += ` ${errorData.message || ''}`;
            } catch (jsonError) {
                console.error('Failed to parse error JSON:', jsonError);
            }
            throw new Error(errorMessage);
        }
        const result = await response.json();
        return {message: "Registration successful", ...result}
    }

    return (
        <AuthForm
            title="Rejestracja"
            fields={[
                { name: 'username', type: 'email', label: 'Email', required: true },
                { name: 'password', type: 'password', label: 'Hasło', required: true },
                { name: 'passwordConfirm', type: 'password', label: 'Powtórz hasło', required: true },
            ]}
            submitButtonText="Zarejestruj"
            onSubmit={handleRegister}
            message={message}
            setMessage={setMessage}
        />
    );
}

export default RegisterPage;
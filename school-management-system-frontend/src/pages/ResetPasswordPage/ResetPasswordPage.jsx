import AuthForm from '../../components/Auth/AuthForm/AuthForm';
import React, { useState } from 'react';

function ResetPasswordPage() {
    const [message, setMessage] = useState('');

    const handleResetPassword = async (fieldValues) => {
        const { username } = fieldValues;

        const response = await fetch('http://localhost/api/v1/user/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!response.ok) {
            let errorMessage = `Reset failed: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage += ` ${errorData.message || ''}`;
            } catch (jsonError) {
                console.error('Failed to parse error JSON:', jsonError);
            }
            throw new Error(errorMessage);
        }
        return {message: "Reset password success"};
    }

    return (
        <AuthForm
            title="Reset Password"
            fields={[
                { name: 'username', type: 'email', label: 'Email', required: true },
            ]}
            submitButtonText="Reset password"
            onSubmit={handleResetPassword}
            message={message}
            setMessage={setMessage}
        />
    );
}

export default ResetPasswordPage;
import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            console.log(response);

            if (!response.ok) {
                let errorMessage = `Login failed: ${response.status} ${response.statusText}`;
                try {
                    //Spróbuj sparsować JSON, żeby pobrać ewentualny komunikat
                    const errorData = await response.json();
                    errorMessage += ` ${errorData.message || ''}`;
                } catch (jsonError) {
                    // Jeżeli nie udało się sparsować JSON (pusta odpowiedź, nieprawidłowy format)
                    console.error('Failed to parse error JSON:', jsonError);
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setMessage('Login successful');
            console.log('Login successful', result);

        } catch (error) {
            setMessage(`Login error: ${error.message}`);
            console.error('Login error:', error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label>Username:</label>
                <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
}

export default Login;
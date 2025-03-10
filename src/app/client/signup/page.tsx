const SignUp: React.FC = () => {
    // React.FC (or React.FunctionComponent) is a TypeScript type that provides type safety for functional components in React
    return (
        <>
            <h2>Welcome to our website</h2>
            <div>
                <h1>Already a user:</h1>
                <form action="/logging" method="post">
                    <input type="text" name="lname" placeholder="Enter name" />
                    <input type="password" name="lpassword" placeholder="Enter password" />
                    <input type="submit" value="Log User" id="cubtn" />
                </form>
                {/* Server-side templating like EJS cannot be directly used in React. */}
                {/* You need to pass `message` as a prop or manage it via state/context. */}
                {/* Example: {message && <div style={{ color: 'red' }}>{message}</div>} */}
                <h1>New user:</h1>
                <a href="/createuser">Sign Up</a>
            </div>
        </>
    );
}

export default SignUp;

 const RegisterUser= ()=> {
        return (
        <main>
            <form className="flex">
                <label htmlFor="name">Name</label>
                <input type="text" />
                <label htmlFor="Email">Email</label>
                <input type="text" />
                <label htmlFor="password">password</label>
                <input type="text" />
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="text" />
                <label htmlFor="Role">Role</label>
                <input type="text" />
            </form>
        </main>
    )
}

export default RegisterUser
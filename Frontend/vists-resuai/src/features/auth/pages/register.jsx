import React from 'react'
import "../auth.form.scss"
import { Link } from 'react-router';
function register() {
  // const navigate=useNavigate();
      const handleSubmit=(e)=>{
        e.preventDefault();
    }
  return (
     <main>
    <div className="form-container">
        <h1>REGISTER</h1>
        <form onSubmit={handleSubmit}>
           <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" id='userma,e' name='username' placeholder='Enter username' />
            </div>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email' placeholder='Enter email' />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="text" id='password' name='password' placeholder='Enter password' />
            </div>
            <button className='button primary-button' >Submit</button>

        </form>
        <p>Already have an Account? <Link to={"/login"}>Login</Link></p>
    </div>
   </main>
  )
}

export default register

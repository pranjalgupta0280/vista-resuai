import React from 'react'
import "../auth.form.scss"

function login() {

    const handleSubmit=(e)=>{
        e.preventDefault();
    }
  return (
   <main>
    <div className="form-container">
        <h1>LOGIN</h1>
        <form onSubmit={handleSubmit}>

            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="text" id='email' name='email' placeholder='Enter email' />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="text" id='password' name='password' placeholder='Enter password' />
            </div>
            <button className='button primary-button' >Submit</button>

        </form>
    </div>
   </main>
  )
}

export default login

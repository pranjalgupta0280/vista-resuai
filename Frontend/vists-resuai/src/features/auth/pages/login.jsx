import React from 'react'

function login() {
  return (
   <main>
    <div className="form-container">
        <h1>LOGIN</h1>
        <form>

            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="text" id='email' name='email' placeholder='Enter email' />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="text" id='password' name='password' placeholder='Enter password' />
            </div>
            <button className='button primary-button'></button>

        </form>
    </div>
   </main>
  )
}

export default login

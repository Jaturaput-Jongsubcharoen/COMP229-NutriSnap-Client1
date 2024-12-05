import {useState } from "react";

function Signup (){
    return(
        <div className ="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div classname="bg -whiote p-3 riunded w-25">
                <h2>Register</h2>
                <form>
                    <div classname="mb-3">
                        <label htmlFor="emial">
                            <strong>Name</strong>
                        </label>
                        <input
                        type="text"
                        placeholder="Enter Name"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                    <p>Alredy have an account</p>
                    <button className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
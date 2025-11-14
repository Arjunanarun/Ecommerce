import { useState,useRef} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BaseUrl = import.meta.env.VITE_API_URL;

export default function Register() {
    const navigate=useNavigate();
    const [username, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [mobilenum, setMobilenum] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirmpass] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const passRef=useRef();

    const match=password && confirmpass && password === confirmpass;

    // console.log(BaseUrl+"register");
    const handleSubmit = async () => {
        try {
            const reg = await axios.post(BaseUrl + "register",   // axois do res.json() auto
                {
                    username,
                    email,
                    password,
                    mobilenum,
                });
                
            console.log("the response from register is ", reg);
                navigate('/login');
        } catch (err) {
            console.log("the error in reg is ", err.response.data)
        }
    }

    return (
        <>

            <div className="Reg_Container">
                <div className="labels">
                    <p>Enter Username</p>
                    <input type="text"
                        required={true}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="Enter Username"
                        className="Uname"
                    />

                    <p className="label">Enter Mobile Number</p>
                    <input
                        type='number'
                        required={true}
                        className='login-num'
                        placeholder='Enter username'
                        onChange={(e) => setMobilenum(e.target.value)}
                    ></input>

                    <p>Enter Email</p>
                    <input type="text"
                        required={true}
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="Email"
                    />

                    <p>Enter Password</p>
                    <input type={showPassword ? "text" : "password"}
                        required={true}
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="Password"
                    />

                    <p className="label">Re-enter Password</p>
                    <input
                        ref={passRef}
                        type='password'
                        onChange={(e)=>{setConfirmpass(e.target.value)}}
                        required={true}
                        style={{
                            border : confirmpass ? `2px solid ${match ? "green":"red"}` :"1px solid grey",
                            color : confirmpass ? match ? "green" : "red" :"black", 
                        }}
                        className='login-pass'
                        placeholder='confirm Password'
                    ></input>
                    { confirmpass && !match && <p>PAsswords not match</p>}

                    <button onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                <button
                    className="submit"
                    onClick={handleSubmit}
                >Submit</button>
            </div>
        </>
    )
}
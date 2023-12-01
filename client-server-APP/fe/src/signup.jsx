import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './signup.css'
function ClassScheduleInput() {
    const [username_input, setUsername_input] = useState('');
    const [password_input, setPassword_input] = useState('');
    const [address_input, setAddress_input] = useState('');
    const [schedule_input, setSchedule_input] = useState('');
    const [selectedChoice, setSelectedChoice] = useState('Driver');
    const [m1, setM1] = useState("");
    const [t1, setT1] = useState("");
    const [w1, setW1] = useState("");
    const [r1, setR1] = useState("");
    const [f1, setF1] = useState("");
    const [m2, setM2] = useState("");
    const [t2, setT2] = useState("");
    const [w2, setW2] = useState("");
    const [r2, setR2] = useState("");
    const [f2, setF2] = useState("");

    useEffect(() => {
        calculateSched(schedule_input);
    }, [schedule_input]);


    //This function will add the specified ride to the rider
    //The input must be a valid rider name, the day, and the arrival or departure
    //The day must have the first 3 letters spelled correctly, day and arr/dep are case insensitive, rider is case sensitive
    const [rider_input, setRider_input] = useState('');
    const [day_input, setDay_input] = useState('');
    const [time_input, setTime_input] = useState('');
    const [a_or_d, setA_or_D] = useState('');
    const handleAddRide = () => {
        axios.post("http://localhost:8081/user/addRide", {
            rider: rider_input,
            day: day_input,
            time: time_input,
            AorD: a_or_d
        }).then(res => {
            console.log(res)
        })
    }

    const handleSubmit = () => {

        calculateSched(schedule_input);

        axios.post("http://localhost:8081/user/create", {
            username: username_input,
            password: password_input,
            address: address_input,
            type: selectedChoice,
            mon_A: m1,
            mon_D: m2,
            tue_A: t1,
            tue_D: t2,
            wed_A: w1,
            wed_D: w2,
            thu_A: r1,
            thu_D: r2,
            fri_A: f1, 
            fri_D: f2
        }).then(res => {
            console.log(res)
        })
    }


    function calculateSched(i) {
        const regexM1 = /(?:Monday).*?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)/;
        const regexT1 = /(?:Tuesday).*?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)/;
        const regexW1 = /(?:Wednesday).*?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)/;
        const regexR1 = /(?:Thursday).*?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)/;
        const regexF1 = /(?:Friday).*?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)/;
        const regexM2 = /.* - ?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)(?: - .* Tuesday)/;
        const regexT2 = /.* - ?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)(?: - .* Wednesday)/;
        const regexW2 = /.* - ?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)(?: - .* Thursday)/;
        const regexR2 = /.* - ?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)(?: - .* Friday)/;
        const regexF2 = /.* - ?(\b\d{1,2}:\d{2}\s[APap][Mm]\b)/;

       
        const matchM1 = regexM1.exec(i);
        if (matchM1) {
            setM1(matchM1[1]);
        } else {
            setM1('');
        }

        
        const matchT1 = regexT1.exec(i);
        if (matchT1) {
            setT1(matchT1[1]);
        } else {
            setT1('');
        }

       
        const matchW1 = regexW1.exec(i);
        if (matchW1) {
            setW1(matchW1[1]);
        } else {
            setW1('');
        }

        const matchR1 = regexR1.exec(i);
        if (matchR1) {
            setR1(matchR1[1]);
        } else {
            setR1('');
        }

       
        const matchF1 = regexF1.exec(i);
        if (matchF1) {
            setF1(matchF1[1]);
        } else {
            setF1('');
        }

       
        const matchM2 = regexM2.exec(i);
        if (matchM2) {
            setM2(matchM2[1]);
        } else {
            setM2('');
        }

      
        const matchT2 = regexT2.exec(i);
        if (matchT2) {
            setT2(matchT2[1]);
        } else {
            setT2('');
        }

      
        const matchW2 = regexW2.exec(i);
        if (matchW2) {
            setW2(matchW2[1]);
        } else {
            setW2('');
        }

        
        const matchR2 = regexR2.exec(i);
        if (matchR2) {
            setR2(matchR2[1]);
        } else {
            setR2('');
        }

     
        const matchF2 = regexF2.exec(i);
        if (matchF2) {
            setF2(matchF2[1]);
        } else {
            setF2('');
        }
    }

    const choices = [
        { value: 'Driver', label: 'Driver' },
        { value: 'Rider', label: 'Rider' },
    ];

    return (
        <div>
            <h1>UCLA Carpool Connect</h1>
            <div>
                <h3>Username</h3>
                <input
                    type="text"
                    name="username_input"
                    value={username_input}
                    onChange={(e) => setUsername_input(e.target.value)}
                />
            </div>
            <div>
                <h3>Password</h3>
                <input
                    type="text"
                    name="password_input"
                    value={password_input}
                    onChange={(e) => setPassword_input(e.target.value)}
                />
            </div>
            <div>
                <h3>Your Home Address</h3>
                <input
                    type="text"
                    name="address_input"
                    value={address_input}
                    onChange={(e) => setAddress_input(e.target.value)}
                />
            </div>
            <div>
                <h3>Your Class Schedule</h3>
                <input
                    type="text"
                    name="schedule_input"
                    value={schedule_input}
                    onChange={(e) => setSchedule_input(e.target.value)}
                />
            </div>
            <div>
                <h3>Driver or Rider</h3>
                <select
                    value={selectedChoice}
                    onChange={(e) => setSelectedChoice(e.target.value)}
                >
                    {choices.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                            {choice.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <br></br>
                <h2>Account Overview</h2>
                <p>Username: {username_input}</p>
                <p>Home Address: {address_input}</p>
                <p>Account Type: {selectedChoice}</p>
                <br></br>
                <h3>Ride Schedule</h3>
                <p>Monday Arrival: {m1} Departure: {m2}</p>
                <p>Tuesday Arrival: {t1} Departure: {t2}</p>
                <p>Wednesday Arrival: {w1} Departure: {w2}</p>
                <p>Thursday Arrival: {r1} Departure: {r2}</p>
                <p>Friday Arrival: {f1} Departure: {f2}</p>
            </div>
            <div>
                <button onClick={handleSubmit} type="submit">Sign Up</button>
            </div>

            {/* add ride button 
            Extremely ugly but only so that frontend team can see it*/}
            <div>
                <label htmlFor="riderInput">Rider:</label>
                <input type="text" id="riderInput" value={rider_input} onChange={(e) => setRider_input(e.target.value)} />

                <label htmlFor="dayInput">Day:</label>
                <input type="text" id="dayInput" value={day_input} onChange={(e) => setDay_input(e.target.value)} />

                <label htmlFor="timeInput">Time:</label>
                <input type="text" id="timeInput" value={time_input} onChange={(e) => setTime_input(e.target.value)} />

                <label htmlFor="AorDInput">Arrival or Departure:</label>
                <input type="text" id="AorDInput" value={a_or_d} onChange={(e) => setA_or_D(e.target.value)} />

                <button onClick={handleAddRide}>Add Ride</button>
            </div>
        </div>
    );
}

export default ClassScheduleInput;

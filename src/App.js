import { useEffect, useState } from 'react'
import './App.css'

const App = () => {

    const [hotels, setHotels] = useState(false);

    useEffect(() => {

        fetch('api/hotels')
		.then(response => response.json())
		.then(data => setHotels(data));

    }, []);

    return (
    <div className="App">
        <h1>Hotels</h1>
        {
            !hotels ? <LoadingMask /> :
            hotels.map((hotel, i) => <Hotel key={ i } hotel={ hotel } />)
        }
    </div>
    )
}


function Hotel(props) {
    const [show, setShow] = useState(false);
    const [showSub, setShowSub] = useState(false);

    return (
        <div className="hotel">
            <p>{ props.hotel.name }</p>
            <button onClick={ ()=> setShow(!show) }>{ show ? 'Show less' : 'Show more' }</button>
            {   
                show && <div>
                    <p>{ props.hotel.city } ({ props.hotel.stars })</p>
                    <button onClick={ ()=> setShowSub(true) }>Request more info about { props.hotel.name }</button>
                    {
                        showSub && <Subscription hotel={ props.hotel.name } setShowSub={setShowSub} />
                    }
                </div>
            }
        </div>
    );
}

//Subscribed

function Subscription(props) {
    const [email, setEmail] = useState('');
    const [answer, setAnswer] = useState(false);
    const [load, setLoad] = useState(false);

    function sendSub() {
        fetch('api/hotels/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": email, "hotel": props.hotel })
        })
        .then(response => response.json())
        .then(data => {setAnswer(data); setLoad(false) 
            setTimeout(function() {props.setShowSub(false)}, 5000)});

    }

    return (
        <div>
            { 
            load ? <LoadingMask /> :
            !answer ?
            <form onSubmit={ (e)=> e.preventDefault() }>
                <input type="text" onChange={ (e)=> setEmail(e.target.value) } />
                <button disabled={ !(email.includes('@') && email.includes('.')) } 
                onClick={ ()=> { setLoad(true); sendSub(); } }            
                >Submit</button>
            </form> : answer.success ? 'Subscribed' : 'Already subscribed'
            }
        </div>
    );
}


function LoadingMask() {
    return (
        <div>Loading...</div>
    );
}

export default App

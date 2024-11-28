import { Link } from "react-router-dom";


export function Home(){


    return(
        <main className="home-main">
            <h1>Welcome to Lee's Toybox!</h1>
            <h2>Where Ideas Come to Play</h2>
            <div className="links">
            <Link to="/menu">Explore My Creations</Link>
            <Link to="/about">Learn About Me</Link>
            </div>
        </main>
    )
}
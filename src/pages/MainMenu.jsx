import { Link } from "react-router-dom";


export function MainMenu(){

    return(
        <main className="main-menu">
            <Link to="/birthday">
                <img src="../src/assets/img/cake.png"></img>
                <h5>Happy birthday! Blow your candles</h5>
            </Link>
        </main>
    )
}
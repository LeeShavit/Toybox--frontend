import { useState } from 'react'
import { NavLink, } from 'react-router-dom'

export function AppHeader() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)


    return (

        <header className="app-header">
            <section className="header-container">
                <h4>Lee's Toybox!</h4>
                <nav className={`app-nav`}>
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/birthday" >Birthday</NavLink>
                </nav>
            </section>
        </header>
    )
}
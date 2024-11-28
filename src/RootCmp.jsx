import React from 'react'
import { Routes, Route } from 'react-router'

import { Home } from './pages/Home'
import { BirthdayIndex } from './apps/birthday/pages/BirthdayIndex'
import { AppHeader } from './cpms/AppHeader'
import { AppFooter } from './cpms/AppFooter'
import { UserMsg } from './cpms/UserMsg'
import { MainMenu } from './pages/MainMenu'


export function RootCmp() {
    return (
        <div className="main-container">
            <AppHeader />
            <UserMsg />
            <main >
                <Routes>
                    <Route path="" element={<Home />} />
                    {/* <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
                    <Route path="menu" element={<MainMenu />} />
                    <Route path="birthday" element={<BirthdayIndex />} />
                </Routes>
            </main>
            <AppFooter />
        </div >
    )
}



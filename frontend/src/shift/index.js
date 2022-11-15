import React, {useEffect, useState} from 'react';
import "./index.scss"
import Header from "./component/navBar/index"
import Title from "./component/title/index"
import About from "./component/aboutUs/index"
import WhyUs from "./component/whyUs/index"
import Courses from "./component/courses/index"
import Gallery from "./component/Gallery/index"
import OurTeam from "./component/ourTeam/index"
import Footer from "./component/footer/index"
import request from "./utils/request";

function Index(props) {
    const [shift, setShift] = useState(null)

    function getShift() {
        request("shift", "get").then(res => {
            setShift(res.data)
        })
    }

    useEffect(() => {
        getShift()
    }, [])


    return (
        <div>
            <Header getShift={getShift}/>
            <Title title={shift?.title}/>
            <About about={shift?.about}/>
            <WhyUs whyUses={shift?.whyUses}/>
            <Courses courses={shift?.courses}/>
            <Gallery galleries={shift?.galleries}/>
            <OurTeam ourTeams={shift?.ourTeams}/>
            <Footer address={shift?.address} followUses={shift?.followUses}/>
        </div>
    );
}

export default Index;
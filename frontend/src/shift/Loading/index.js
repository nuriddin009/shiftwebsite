import React from 'react';
import "./index.scss";
import loading from "./loading.webp";

function Index(props) {
    return (
        <div className={"loading-page"}>
            <img src={loading} alt="loading"/>
        </div>
    );
}

export default Index;
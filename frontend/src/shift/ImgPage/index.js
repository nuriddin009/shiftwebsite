import React, {useState} from 'react';
import "./index.scss"
import request from "../utils/request";
function Index(props) {
    const [img,setImg]=useState(null)
    const [post,setPosts]=useState([])
    function saveImg() {

    }

    function handleFile(e) {
        let data = new FormData();
        data.append("file", e.target.files[0])
        request("/img","post",data).then(res=>{

        })
    }

    return (
        <div>
            <label className={"my-label"}>
                <img style={{width: "250px", height: "200px"}} src={"http://localhost:81/api/img/" + 1} alt={"img"}/>
                <input accept={"image/*"} style={{display: "none"}} onChange={e => handleFile(e)}
                       type="file"/>
            </label>
            <button onClick={()=>saveImg()} className={"btn btn-success"}>Save</button>

        </div>
    );
}

export default Index;
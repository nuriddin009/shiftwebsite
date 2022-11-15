import React, {useEffect, useState} from 'react';
import "./index.scss"
import request from "../../../shift/utils/request";

function Index(props) {

    const [users, setUsers] = useState([])
    const [page, setPage] = useState(0)
    const [input, setInput] = useState({fullname: "", stardate: "", enddate: ""})
    const [totalPages, setTotalPages] = useState([]);
    const [totalElements, setTotalElements] = useState([]);
    const [currentPageNumber, setCurrentPageNumber] = useState(false);

    function getUser(fullname, stardate, enddate, page) {

        request("/studyCenter/timeTableUsers/getDeleteUsers/" + page + "?fullname=" + fullname + "&stardate=" + stardate + "&enddate=" + enddate, "get").then(res => {
            setTotalPages(res.data.totalPages);
            setCurrentPageNumber(res.data.number)
            setUsers(res.data.content)
            setTotalElements(res.data.totalElements)
        })
    }

    useEffect(() => {
        getUser("", "", "", 0)
    }, [])

    function heandleInput(e, item) {
        let a = {...input, [item]: e.target.value}
        setInput(a)
        if (item==="fullname") {
            getUser(e.target.value, input.stardate, input.enddate, 0)
        } else if (item==="stardate") {
            getUser(input.fullname, e.target.value, input.enddate, 0)
        } else {
            getUser(input.fullname, input.stardate, e.target.value, 0)

        }

    }

    function reset() {
        setInput({fullname: "", stardate: "", enddate: ""})
        getUser("", "", "", 0)
    }

    function goToPage(index) {
        getUser("", "", "", index)
        setPage(page)
    }

    return (
        <div className={"deleteUser my-5  col-md-8 offset-1"}>
            <div>

                <div className={"d-flex gap-5"}>
                    <div>

                        <input type="text" placeholder={"FullName"} value={input.fullname}
                               onChange={(e) => heandleInput(e, "fullname")} className={"form-control w-75"}/>
                        <label>
                            <p>StartDate</p>
                            <input type="date" value={input.stardate} onChange={(e) => heandleInput(e, "stardate")}
                                   className={"form-control "}/>
                        </label>
                        <label>
                            <p>EndDate</p>
                            <input type="date" value={input.enddate} onChange={(e) => heandleInput(e, "enddate")}
                                   className={"form-control"}/>
                        </label>
                    </div>

                    {input.fullname||input.stardate||input.enddate ?
                        <div>
                            <button onClick={reset} className={"btn btn-dark"}> reset</button>
                        </div>
                        : ""
                    }
                    <h3>
                Size    {totalElements?totalElements:""}
                    </h3>
                </div>
                <div>
                    <table className="table my-3">
                        <thead>
                        <tr>
                            <th>Fullname</th>
                            <th>phone</th>
                            <th>Group</th>
                            <th>TimeTable</th>
                            <th>lesson</th>
                            <th>date</th>
                            <th>why</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users?.map(item => <tr className={"tabletbodytr"} key={item.id}>
                            <td className={"bg-secondary text-white"}><h5>{item.firstname} {item.lastname}</h5></td>
                            <td>{item.phone}</td>
                            <td>{item.groupname}</td>
                            <td>{item.timatablename}</td>
                            <td>{item.gotogroup}</td>
                            <td>{item.deletedate}</td>
                            <td>
                                <pre>{item.whytogroup}</pre>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                    {
                        totalPages > 1 && new Array(totalPages).fill(0).map((item, index) => <button key={index}
                                                                                                     className={(currentPageNumber === index ? "btn btn-dark" : "btn btn-info")}
                                                                                                     onClick={() => goToPage(index)}>
                            {index + 1}

                        </button>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Index;

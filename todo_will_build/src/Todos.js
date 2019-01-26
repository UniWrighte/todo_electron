import React, { Component } from 'react';
import logo from './logo.svg';
import './Todos.css';
import {ticker} from './api/binance';

const Todo = ({text, isDone, onClick, del}) =>{
    const c = isDone ? "todo done" : "todo undone";
    return (
    <div className="todo-cont" onClick={onClick}>
        <div  className={c}>{text}</div>
        <div className="del-btn" onClick={del}>x</div>
    </div>
    )
}

class Todos extends Component {

    constructor(props){
        super(props);
        //change this so that the defined state is iterated throught to test for
        //each item in local storage in componentDidMount
        this.state = {
            todoStrings: [],
            todoBools: [],
            newText: ""
        }
        this.addTodo = this.addTodo.bind(this);
    }

    componentDidMount(){
        
        console.log("opening the console for you master..");

        const todoStrings = !!localStorage.getItem("todoStrings")
        ? localStorage.getItem("todoStrings") : [];

        const todoBools = !!localStorage.getItem("todoBools")
        ? localStorage.getItem("todoBools") : [];
        this.setState({todoStrings, todoBools});
        this.mapLocalStorageToState();

        ticker();
    }

    mapLocalStorageToState(){
        const stateArray = Array.from(Object.keys(this.state));
        //may be able to use reduce instead of map to make this a single object to avoid forEach
        const newState = stateArray.map((item)=>{
            //get the empty state item
            const stateRef = this.state[item];
            //pass name string to a function to get string in localStorage or null if there is none.
            const content = this.getLocalStorage(item);
            //maybe... maybe this will be ok. stateRef may self reference or something odd.
            return {[item]: content !== null ? this.transformLocalStorage(content, stateRef) : stateRef};
        });

        newState.forEach((item)=>{
            this.setState({...item});
        })


    }
    getLocalStorage(name){
        return !!localStorage.getItem(name) ? localStorage.getItem(name) : null;
    }
    transformLocalStorage(content, stateRef){
        //type is. Basically it is an empty variable with the correct type
        //get the item type
        const stateType = typeof stateRef;
        switch(stateType){
            case 'object':
                const isArray = Array.isArray(stateRef);
                if(isArray){
                    return content.split(',');
                }else{
                    return JSON.parse(content);
                }
            case 'string':
                return content;
            case 'number':
                return Number(content);
            default:
                return Error("type not accounted for");
        }
    }

    addTodo(e){
        e.preventDefault();
        const {todoStrings, todoBools, newText} = this.state;
        const newStrings = [...todoStrings, newText];
        const newBools = [...todoBools, false];
        this.setState({todoStrings: newStrings, todoBools: newBools, newText: ""});

        localStorage.setItem("todoStrings", newStrings);
        localStorage.setItem("todoBools", newBools);

    }
    removeTodo(e,i){
        e.stopPropagation();
        const {todoStrings, todoBools} = this.state;
        const newStrings = todoStrings.slice();
        const newBools = todoBools.slice();
        newBools.splice(i, 1);
        newStrings.splice(i, 1);

        this.setState({todoBools: newBools, todoStrings: newStrings});
        localStorage.setItem("todoStrings", newStrings);
        localStorage.setItem("todoBools", newBools);


    }


    render() {
        const {newText, todoStrings, todoBools} = this.state;
        return (
            <div className="cont">
                <h1>Todo application on Electron</h1>
                <form onSubmit={this.addTodo} >

                <input type="text" placeholder="todo text" value={newText}
                       className="add-input" onChange={(e)=>{this.setState({newText: e.target.value})}} />
                   <button className="add-btn">add todo</button>
                </form>
                {todoStrings.map((item, i)=>(
                    <Todo onClick={(e)=>{

                            const bools = todoBools.slice();

                            bools[i] = todoBools[i] === "true" ? "false" : "true";

                            this.setState({todoBools: bools});
                            localStorage.setItem("todoBools", bools);


                        }} key={i} text={item} isDone={todoBools[i] === "true"}
                        del={(e)=>{this.removeTodo(e,i)}}/>
                ))}


            </div>
        );
    }
}

export default Todos;
